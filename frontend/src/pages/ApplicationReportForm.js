import React, { useState, useEffect, useRef } from "react";
import "./ApplicationReportEntry.css";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem as MUIMenuItem
} from "@mui/material";
import StandardTable from "../components/StandardTable";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const FormRow = ({ label, children, error }) => (
  <Box className="form-row">
    <Box className="form-label">{label}</Box>
    <Box style={{ flexGrow: 1 }}>
      {children}
      {error && <Box className="form-error">{error}</Box>}
    </Box>
  </Box>
);

const ApplicationReportEntry = ({
  initialData = null,
  editingIdFromProps = null,
  onSaved = () => {},
  onCancel = () => {},
}) => {
  const [customers, setCustomers] = useState([]);
  const [attentionList, setAttentionList] = useState([]);
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [view, setView] = useState("table");
  const [editingId, setEditingId] = useState(null);
  const [readOnly, setReadOnly] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
 
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
const [selectedRows, setSelectedRows] = useState([]);

  const menuRowRef = useRef(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  
  const rowsPerPage = 10;

  const [formData, setFormData] = useState({
    reportNo: "",
    date: "",
    customer: "",
    quotationNo: "",
    duration: "",
    machineName: "",
    contactPerson: "",
    oemsInvolved: "",
    partNumber: "",
    quantity: "",
    application: "",
    ifmSolution: "",
    kindAttention: "",
  });

  const [errors, setErrors] = useState({});

  const filteredRows = rows.filter((r) =>
    Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const getRowId = (r) => r?.Id ?? r?.id ?? r?.ID ?? null;

  const handleChange = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value });

  const handleAlphaOnly = (field) => (e) => {
    const value = e.target.value.replace(/[^A-Za-z\s\-']/g, "");
    setFormData({ ...formData, [field]: value });
  };

  const handleNumericOnly = (field) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, [field]: value });
  };

  /* LOAD DROPDOWNS + FETCH ROWS */
  useEffect(() => {
    loadDropdownData();
    fetchRows();
  }, []);

  const loadDropdownData = async () => {
    try {
      const custRes = await fetch(
        "http://localhost:5000/api/appDropdowns/customers"
      );
      setCustomers(await custRes.json());

      const attRes = await fetch(
        "http://localhost:5000/api/appDropdowns/attention"
      );
      setAttentionList(await attRes.json());
    } catch (err) {
      console.error("Dropdown fetch failed", err);
    }
  };

  useEffect(() => {
    if (initialData) {
      fillForm(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (editingIdFromProps) fetchEditRecord(editingIdFromProps);
  }, [editingIdFromProps]);

  const fetchEditRecord = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appReport/${id}`);
      const r = await res.json();
      if (r) {
        fillForm(r);
        setEditingId(r.Id || id);
        setView("form");
      }
    } catch (err) {
      console.error("Fetch Edit Error", err);
    }
  };

  const fillForm = (data) => {
    setFormData({
      reportNo: data.ReportNo || "",
      date: data.Date || "",
      customer: data.Customer || "",
      quotationNo: data.QuotationNo || "",
      duration: data.Duration || "",
      machineName: data.MachineName || "",
      contactPerson: data.ContactPerson || "",
      oemsInvolved: data.OEMsInvolved || "",
      partNumber: data.PartNumber || "",
      quantity: data.Quantity || "",
      application: data.ApplicationText || "",
      ifmSolution: data.IFMSolution || "",
      kindAttention: data.KindAttention || "",
    });
    setFile(null);
  };

  const fetchRows = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appReport");
      const data = await res.json();
      const normalized = (data || []).map((r) => ({
        ...r,
        Id: r.Id ?? r.id ?? r.ID,
      }));
      setRows(normalized);
    } catch (err) {
      console.error("Fetch rows failed", err);
      setRows([]);
    }
  };

  /* ========== ACTIONS ========== */
  const handleMenuOpen = (event, row) => {
    menuRowRef.current = row;
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const openAddForm = () => {
    setFormData({
      reportNo: "",
      date: "",
      customer: "",
      quotationNo: "",
      duration: "",
      machineName: "",
      contactPerson: "",
      oemsInvolved: "",
      partNumber: "",
      quantity: "",
      application: "",
      ifmSolution: "",
      kindAttention: "",
    });
    setEditingId(null);
    setReadOnly(false);
    setView("form");
  };

  const openEditForm = () => {
    const row = menuRowRef.current;
    if (!row) return;
    fillForm(row);
    setEditingId(getRowId(row));
    setReadOnly(false);
    setView("form");
  };

  const openViewForm = () => {
    const row = menuRowRef.current;
    if (!row) return;
    fillForm(row);
    setEditingId(getRowId(row));
    setReadOnly(true);
    setView("form");
  };

  const handleDelete = async () => {
    const row = menuRowRef.current;
    const id = getRowId(row);
    if (!id) return alert("Invalid record ID");

    if (!window.confirm("Delete this record?")) return;

    try {
      await fetch(`http://localhost:5000/api/appReport/${id}`, {
        method: "DELETE",
      });
      fetchRows();
    } catch (err) {
      alert("Delete failed");
    }
  };

/* ========== EXPORT ========== */
const exportCSV = () => {
  if (!filteredRows.length) {
    alert("No data to export");
    return;
  }

  const headers = Object.keys(filteredRows[0]);
  const csv = [
    headers.join(","),
    ...filteredRows.map(row =>
      headers.map(h => `"${row[h] ?? ""}"`).join(",")
    )
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "application_report.csv");
};

const exportExcel = () => {
  if (!filteredRows.length) {
    alert("No data to export");
    return;
  }

  const sheet = XLSX.utils.json_to_sheet(filteredRows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Reports");

  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "application_report.xlsx");
};


  /* ========== SAVE FORM ========== */
  const validate = () => {
    const newErr = {};
    if (!formData.reportNo) newErr.reportNo = "Report No is required.";
    if (!formData.date) newErr.date = "Date is required.";
    if (!formData.customer) newErr.customer = "Customer is required.";
    if (!formData.machineName) newErr.machineName = "Machine name required.";
    if (!formData.quantity) newErr.quantity = "Quantity required.";
   
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return alert("Please fill all required fields!");

    try {
      if (editingId) {
        await fetch(`http://localhost:5000/api/appReport/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        const fd = new FormData();
        if (file) fd.append("diagram_file", file);
        Object.entries(formData).forEach(([key, val]) => fd.append(key, val));

        await fetch("http://localhost:5000/api/appReport", {
          method: "POST",
          body: fd,
        });
      }
      fetchRows();
      setView("table");
    } catch (err) {
      alert("Save failed");
    }
  };

  const isSelected = (id) => selectedRows.includes(id);

const handleSelectRow = (id) => {
  setSelectedRows((prev) =>
    prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
  );
};

const handleSelectAll = (checked) => {
  if (checked) {
    setSelectedRows(filteredRows.map((r) => r.Id));
  } else {
    setSelectedRows([]);
  }
};
const columns = [
  { field: "ReportNo", headerName: "Report No", width: 120 },
  { field: "Date", headerName: "Date", width: 140 },
  { field: "Customer", headerName: "Customer", width: 180 },
  { field: "QuotationNo", headerName: "Quotation No", width: 150 },
  { field: "Quantity", headerName: "Quantity", width: 100 },
];


  /* ================= UI ================= */
  return (
    <Box  className="app-container">
   
<Box className="app-header">
  {view !== "table" && (
    <Button
      variant="contained"
      onClick={() => {
        setView("table");
        setEditingId(null);
        setReadOnly(false);
      }}
    >
      Back to Table
    </Button>
  )}
</Box>

      {view === "table" ? (
  <StandardTable
    title="Application Report Entry"
    columns={columns}
    rows={filteredRows}
    search={search}
    setSearch={setSearch}
    selectedRows={selectedRows}
    setSelectedRows={setSelectedRows}
    onAdd={openAddForm}
    onView={(row) => {
      fillForm(row);
      setEditingId(row.Id);
      setReadOnly(true);
      setView("form");
    }}
    onEdit={(row) => {
      fillForm(row);
      setEditingId(row.Id);
      setReadOnly(false);
      setView("form");
    }}
    onDelete={(row) => {
      menuRowRef.current = row;
      handleDelete();
    }}
    onExport={() => {
      exportExcel(); // or exportCSV
    }}
  />
) : (

        
        <Paper
  sx={{
    p: 3,
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    minHeight: "70vh"   // 👈 IMPORTANT
  }}
>

        
          <Grid container spacing={4} sx={{ flexGrow: 1 }}>

            {/* LEFT */}
            <Grid item xs={12} sm={6}>
              <FormRow label="Application Report No:" error={errors.reportNo}>
                <TextField
                  size="small"
                  fullWidth
                  value={formData.reportNo}    
                  onChange={handleNumericOnly("reportNo")}
                  error={!!errors.reportNo}
                  disabled={readOnly}    
                />
              </FormRow>

              <FormRow label="Customer:" error={errors.customer}>
                <TextField  

                  select
                  size="small"
                  fullWidth
                  value={formData.customer}
                  onChange={handleChange("customer")}
                  disabled={readOnly}
                >
                  <MenuItem value="" disabled>
                     Select Customer
                  </MenuItem>

                  {customers.map((c) => (
                    <MenuItem key={c.CustomerID} value={c.CustomerName}>
                      {c.CustomerName}
                    </MenuItem>
                  ))}
                </TextField>
              </FormRow>

              <FormRow
                label="Machine / Application Name:"
                error={errors.machineName}
              >
                <TextField
                  size="small"
                  fullWidth
                  value={formData.machineName}
                  onChange={handleAlphaOnly("machineName")}
                  disabled={readOnly}
                />
              </FormRow>

              <FormRow label="Kind Attention:">
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={formData.kindAttention}
                  onChange={handleChange("kindAttention")}
                  disabled={readOnly}
                >
                  <MenuItem value="">Select Person</MenuItem>
                  {attentionList.map((p) => (
                    <MenuItem key={p.PersonID} value={p.PersonName}>
                      {p.PersonName}
                    </MenuItem>
                  ))}
                </TextField>
              </FormRow>

              <FormRow label="OEMs Involved:">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.oemsInvolved}
                  onChange={handleChange("oemsInvolved")}
                  disabled={readOnly}
                />
              </FormRow>

              <FormRow label="Quantity:" error={errors.quantity}>
                <TextField
                  size="small"
                  fullWidth
                  value={formData.quantity}
                  onChange={handleNumericOnly("quantity")}
                  error={!!errors.quantity}
                  disabled={readOnly}
                />
              </FormRow>

              <FormRow label="Application:">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.application}
                  onChange={handleChange("application")}
                  disabled={readOnly}
                />
              </FormRow>
            </Grid>

            {/* RIGHT */}
            <Grid item xs={12} sm={6}>
              <FormRow label="Date:">
                <TextField
                  size="small"
                  fullWidth
                  type="date"
                  value={formData.date}
                  onChange={handleChange("date")}
                  disabled={readOnly}
                />
              </FormRow>

              <FormRow label="Quotation No:">
                <TextField
                  size="small"
                  fullWidth
                  value={formData.quotationNo}
                  onChange={handleNumericOnly("quotationNo")}
                  disabled={readOnly}
                />
              </FormRow>

              <FormRow label="Duration:">
                <TextField
                  size="small"
                  fullWidth
                  value={formData.duration}
                  onChange={handleChange("duration")}
                  disabled={readOnly}
                />
              </FormRow>

              <FormRow label="Diagram File:">
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={readOnly}
                  >
                    Select File
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </Button>
                  {file && <span>{file.name}</span>}
                </Box>
              </FormRow>

              <FormRow label="Part Number:">
                <TextField
                  size="small"
                  fullWidth
                  value={formData.partNumber}
                  onChange={handleNumericOnly("partNumber")}
                  disabled={readOnly}
                />
              </FormRow>

              <FormRow label="IFM Solution:">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.ifmSolution}
                  onChange={handleChange("ifmSolution")}
                  disabled={readOnly}
                />
              </FormRow>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: "auto" }}>

  <Box
    className="form-buttons"
    sx={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      gap: 2,
      mt: 3,
    }}
  >

    {!readOnly && (
      <Button variant="contained" className="save-btn" onClick={handleSubmit}>
        Save
      </Button>
    )}

    <Button
      variant="contained"
      className="cancel-btn"
      onClick={() => {
        setView("table");
        setReadOnly(false);
      }}
    >
      {readOnly ? "CLOSE" : "CANCEL"}
    </Button>
  </Box>
</Grid>

          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ApplicationReportEntry;