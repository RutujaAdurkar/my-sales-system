import React, { useState, useEffect, useRef } from "react";
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
  <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
    <Box sx={{ width: 170, fontWeight: 600 }}>{label}</Box>
    <Box sx={{ flexGrow: 1 }}>
      {children}
      {error && (
        <Box sx={{ color: "error.main", mt: 0.5, fontSize: 12 }}>{error}</Box>
      )}
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


  /* ================= UI ================= */
  return (
    <Box sx={{ width: "95%", mx: "auto", mt: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box sx={{ fontSize: 20, fontWeight: 600 }}>
          Application Report Entry
        </Box>
        {view === "table" ? (
          <Button variant="contained"
          startIcon={<AddIcon />}
           onClick={openAddForm}>
            Add
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{ background: "#1976d2" }}
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
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box
           sx={{
           display: "flex",
           justifyContent: "space-between",
           alignItems: "center",
           mb: 2,
          }}
        >
  {/* ⬇️ EXPORT ICON (LEFT) */}
  <IconButton
    color="primary"
    onClick={(e) => setExportAnchorEl(e.currentTarget)}
  >
    <DownloadIcon />
  </IconButton>

  <Menu
    anchorEl={exportAnchorEl}
    open={Boolean(exportAnchorEl)}
    onClose={() => setExportAnchorEl(null)}
  >
    <MenuItem
      onClick={() => {
        exportCSV();
        setExportAnchorEl(null);
      }}
    >
      Export CSV
    </MenuItem>
    <MenuItem
      onClick={() => {
        exportExcel();
        setExportAnchorEl(null);
      }}
    >
      Export Excel
    </MenuItem>
  </Menu>

  {/* 🔍 SEARCH (RIGHT) */}
  <TextField
    size="small"
    placeholder="Search..."
    sx={{ width: 260 }}
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setPage(0);
    }}
    />
   </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
         {/* ✅ SELECT ALL CHECKBOX */}
        <TableCell padding="checkbox">
        <Checkbox
        indeterminate={
          selectedRows.length > 0 &&
          selectedRows.length < filteredRows.length
        }
        checked={
          filteredRows.length > 0 &&
          selectedRows.length === filteredRows.length
        }
        onChange={(e) => handleSelectAll(e.target.checked)}
      />
    </TableCell>

    <TableCell>Report No</TableCell>
    <TableCell>Date</TableCell>
    <TableCell>Customer</TableCell>
    <TableCell>Quotation No</TableCell>
    <TableCell>Quantity</TableCell>
    <TableCell>Actions</TableCell>
  </TableRow>
</TableHead>

            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => (
                  <TableRow
                    key={row.Id || idx}
                    hover
                    selected={isSelected(row.Id)}
                  >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected(row.Id)}
                    onChange={() => handleSelectRow(row.Id)}
                  />
                </TableCell>
                  <TableCell>{row.ReportNo}</TableCell>
                  <TableCell>
                    {row.Date?.toString().substring(0, 10)}
                  </TableCell>
                  <TableCell>{row.Customer}</TableCell>
                  <TableCell>{row.QuotationNo}</TableCell>
                  <TableCell>{row.Quantity}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, row)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>
            <Box>
              Page {page + 1} /{" "}
              {Math.ceil(filteredRows.length / rowsPerPage) || 1}
            </Box>
            <Button
              variant="outlined"
              disabled={
                page + 1 >= Math.ceil(filteredRows.length / rowsPerPage)
              }
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Box>

          {/* Action Menu */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MUIMenuItem
              onClick={() => {
                handleMenuClose();
                openViewForm();
              }}
            >
              <VisibilityIcon fontSize="small" style={{ marginRight: 8 }} />
              View
            </MUIMenuItem>
            <MUIMenuItem
              onClick={() => {
                handleMenuClose();
                openEditForm();
              }}
            >
              <EditIcon fontSize="small" style={{ marginRight: 8 }} />
              Edit
            </MUIMenuItem>
            <MUIMenuItem
              onClick={() => {
                handleMenuClose();
                handleDelete();
              }}
            >
              <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
              Delete
            </MUIMenuItem>
          </Menu>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Grid container spacing={4}>
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
                  <MenuItem value="">Select Customer</MenuItem>
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

            {/* BUTTONS */}
            <Grid item xs={12} textAlign="center">
              {!readOnly && (
                <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmit}>
                  Save
                </Button>
              )}
             <Button
            variant="contained"
            sx={{ background: "#d32f2f" }}   // 🔴 custom red color
            onClick={() => {
            setView("table");
            setReadOnly(false);
             }}
            >
         {readOnly ? "CLOSE" : "CANCEL"}
         </Button>

            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ApplicationReportEntry;
 