import React, { useState, useEffect } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import "./ProjectFollowUpForm.css";
import { saveAs } from "file-saver";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem as MUIMenuItem,TableContainer,TableCell,TableHead,TableRow,TableBody,Table,TablePagination
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

/* ---------- Reusable Form Row ---------- */
const FormRow = ({ label, children, error }) => (
  <Box className="form-row">
    <Box className="form-label">{label}</Box>
    <Box style={{ flexGrow: 1 }}>
      {children}
      {error && <Box className="form-error">{error}</Box>}
    </Box>
  </Box>
);

/* ---------- Initial Form ---------- */
const initialForm = {
  projectNo: "",
  projectDate: "",
  customerName: "",
  projectName: "",
  createdBy: "",
  followBy1: "",
  followBy2: "",
  notes: "",
  followUpDate: "",
  noFollowUpRequired: false,
};

const ProjectFollowUpForm = ({ mode = "project" }) => {
  const [formData, setFormData] = useState(initialForm);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [rows, setRows] = useState([]);
  const [view, setView] = useState("table");
  const [editingId, setEditingId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [errors, setErrors] = useState({});
  const [readOnly, setReadOnly] = useState(false);
const [search, setSearch] = useState("");
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);

const [selectedRows, setSelectedRows] = useState([]);
const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);


const filteredRows = rows.filter((x) =>
  JSON.stringify(x).toLowerCase().includes(search.toLowerCase())
);

  const isPayment = mode === "payment";
  const labels = {
    id: isPayment ? "Invoice No" : "Project No",
    date: isPayment ? "Invoice Date" : "Project Date",
    entity: isPayment ? "Amount" : "Project Name",
    createdBy: isPayment ? "Payment Created By" : "Project Created By",
    follow1: "Follow By (1)",
    follow2: "Follow By (2)",
    followUpDate: "Follow-Up Date",
  };

  useEffect(() => {
    fetchLists();
    fetchRows();
  }, []);

const fetchLists = () => {
  axios
    .get("http://localhost:5000/api/dropdown/customers")
    .then((res) => {
      console.log("Customers Response:", res.data);   // 👈 log response
      setCustomers(res.data);
    })
    .catch((err) => console.error("Customers Error:", err));

  axios
    .get("http://localhost:5000/api/dropdown/employees")
    .then((res) => {
      console.log("Employees Response:", res.data);   // 👈 log response
      setEmployees(res.data);
    })
    .catch((err) => console.error("Employees Error:", err));
};

  const fetchRows = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payment/list");
      console.log("Fetched rows:", res.data); // Debug log
      setRows(res.data || []);
    } catch {
      setRows([]);
    }
  };

  const handleChange = (field) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: v });
  };

  const handleAlphaOnly = (field) => (e) => {
    const v = e.target.value.replace(/[0-9]/g, "");
    setFormData({ ...formData, [field]: v });
  };

  const handleAmountChange = (field) => (e) => {
    let v = e.target.value.replace(/[^0-9.]/g, "");
    const d = v.indexOf(".");
    if (d !== -1) {
      const int = v.slice(0, d).replace(/\./g, "");
      const dec = v.slice(d + 1).replace(/\./g, "").slice(0, 2);
      v = dec ? `${int}.${dec}` : int;
    }
    setFormData({ ...formData, [field]: v });
  };

  const openAddForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setReadOnly(false);
    setView("form");
  };

  const openEditForm = (row) => {
    setFormData({
      projectNo: row.ProjectNo,
      projectDate: row.ProjectDate?.substr(0, 10),
      customerName: row.CustomerName,
      projectName: row.ProjectName,
      createdBy: row.CreatedBy,
      followBy1: row.FollowBy1,
      followBy2: row.FollowBy2,
      notes: row.Notes,
      followUpDate: row.FollowUpDate?.substr(0, 10),
      noFollowUpRequired: row.NoFollowUpRequired,
    });
    setEditingId(row.Id);
    setReadOnly(false);
    setView("form");
  };

  const openViewForm = (row) => {
    openEditForm(row);
    setReadOnly(true);
  };

  const validate = () => {
    const e = {};
    if (!formData.projectNo) e.projectNo = "Required";
    if (!formData.projectDate) e.projectDate = "Required";
    if (!formData.customerName) e.customerName = "Required";
    if (!formData.createdBy) e.createdBy = "Required";
    if (!formData.projectName) e.projectName = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

const handleSubmit = async () => {
  if (!validate()) {
    alert("Please fill all required fields!");
    return;
  }

  try {
    let response;

    if (editingId) {
      response = await axios.put(
        `http://localhost:5000/api/payment/${editingId}`,
        formData
      );
    } else {
      response = await axios.post(
        "http://localhost:5000/api/payment/save",
        formData
      );
    }
    console.log("Response:", response.data);

    setView("table");
    fetchRows();
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Something went wrong while saving data");
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Delete record?")) return;
    await axios.delete(`http://localhost:5000/api/payment/${id}`);
    fetchRows();
  };

  const handleRowSelect = (row) => {
  setSelectedRows((prev) =>
    prev.some((r) => r.Id === row.Id)
      ? prev.filter((r) => r.Id !== row.Id)
      : [...prev, row]
  );
};

const downloadCSV = () => {
  if (selectedRows.length === 0) {
    alert("Please select at least one row");
    return;
  }

  const headers = Object.keys(selectedRows[0]);
  const csvRows = [
    headers.join(","),
    ...selectedRows.map(row =>
      headers.map(h => `"${row[h] ?? ""}"`).join(",")
    )
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "selected_rows.csv");
};

const downloadExcel = () => {
  if (selectedRows.length === 0) {
    alert("Please select at least one row");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(selectedRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "SelectedRows");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "selected_rows.xlsx");
};

  /* ---------- DataGrid Columns ---------- */
  const columns = [
    { field: "ProjectNo", headerName: labels.id, width: 150 },
    { field: "ProjectDate", headerName: labels.date, width: 150 },
    { field: "CustomerName", headerName: "Customer", width: 160 },
    { field: "ProjectName", headerName: labels.entity, width: 180 },
    { field: "CreatedBy", headerName: labels.createdBy, width: 160 },
    { field: "FollowBy1", headerName: labels.follow1, width: 150 },
    { field: "FollowBy2", headerName: labels.follow2, width: 150 },
    { field: "FollowUpDate", headerName: labels.followUpDate, width: 160 },

    {
      field: "actions",
      headerName: "Actions",
      width: 90,
      renderCell: (params) => (
        <IconButton
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setMenuRow(params.row);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box className="project-container">
      <Box className="project-header">
        <Typography className="project-title">
          {isPayment ? "Payment Follow-Up Entry" : "Project Follow-Up Entry"}
        </Typography>

        {view === "table" && (
          <Button variant="contained" 
          startIcon={<AddIcon />}
          onClick={openAddForm}>
            ADD
          </Button>
        )}
      </Box>

      {view === "table" ? (
  <Paper sx={{ p: 2, mt: 2 }}>
    {/* Search Bar */} 
<Box className="table-toolbar">

  {/* LEFT: Export Button */}
  <Box>
    <IconButton
      onClick={(e) => setDownloadAnchorEl(e.currentTarget)}
      sx={{ color: "#1976d2" }}
    >
      <DownloadIcon />
    </IconButton>

    <Menu
      anchorEl={downloadAnchorEl}
      open={Boolean(downloadAnchorEl)}
      onClose={() => setDownloadAnchorEl(null)}
    >
      <MenuItem onClick={() => { downloadCSV(); setDownloadAnchorEl(null); }}>
        Download CSV
      </MenuItem>
      <MenuItem onClick={() => { downloadExcel(); setDownloadAnchorEl(null); }}>
        Download Excel
      </MenuItem>
    </Menu>
  </Box>

  {/* RIGHT: Search */}
  <TextField
    size="small"
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    sx={{ width: 250 }}
  />
</Box>


    {/* Table */}
    <TableContainer>
      <Table size="small">
 <TableHead>
    {/* <TableRow
    sx={(theme) => ({
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.palette.grey[900]
          : theme.palette.grey[200],
    })}
  > */}
  <TableRow>


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
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedRows(filteredRows); // ✅ select all
      } else {
        setSelectedRows([]); // ❌ deselect all
      }
    }}
  />
    </TableCell>

    <TableCell>{labels.id}</TableCell>
    <TableCell>{labels.date}</TableCell>
    <TableCell>Customer</TableCell>
    <TableCell>{labels.entity}</TableCell>
    <TableCell>{labels.createdBy}</TableCell>
    <TableCell>{labels.follow1}</TableCell>
    <TableCell>{labels.follow2}</TableCell>
    <TableCell>{labels.followUpDate}</TableCell>
    <TableCell>Actions</TableCell>
  </TableRow>
</TableHead>

   <TableBody>
        {filteredRows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
            <TableRow key={row.Id} hover>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRows.some((r) => r.Id === row.Id)}
                  onChange={() => handleRowSelect(row)}
                />
              </TableCell>
              <TableCell>{row.ProjectNo}</TableCell>
              <TableCell>{row.ProjectDate?.substr(0, 10)}</TableCell>
              <TableCell>{row.CustomerName}</TableCell>
              <TableCell>{row.ProjectName}</TableCell>
              <TableCell>{row.CreatedBy}</TableCell>
              <TableCell>{row.FollowBy1}</TableCell>
              <TableCell>{row.FollowBy2}</TableCell>
              <TableCell>{row.FollowUpDate?.substr(0, 10)}</TableCell>
              <TableCell>
                <IconButton
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    setMenuRow(row);
                   }}
                 >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TableContainer>

    {/* Pagination */}
    <TablePagination
      component="div"
      count={filteredRows.length}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={(e, newPage) => setPage(newPage)}
      onRowsPerPageChange={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
    />

    {/* Action Menu */}
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={() => setAnchorEl(null)}
    >
      <MUIMenuItem
        onClick={() => {
          setAnchorEl(null);
          openViewForm(menuRow);
        }}
      >
        <VisibilityIcon fontSize="small" style={{ marginRight: 8 }} />
        View
      </MUIMenuItem>
      <MUIMenuItem
        onClick={() => {
          setAnchorEl(null);
          openEditForm(menuRow);
        }}
      >
        <EditIcon fontSize="small" style={{ marginRight: 8 }} />
        Edit
      </MUIMenuItem>
      <MUIMenuItem
        onClick={() => {
          setAnchorEl(null);
          handleDelete(menuRow.Id);
        }}
      >
        <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
        Delete
      </MUIMenuItem>
    </Menu>
  </Paper>
) : (

        /* FORM VIEW */
        <Paper className="project-form">
          <Box className="form-top-actions">
            <Button
              variant="contained"
              sx={{ background: "#1976d2" }}
              onClick={() => {
                setView("table");
                setReadOnly(false);
              }}
            >
              Back to Table
            </Button>
          </Box>

          {/* FIRST ROW */}
          <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
            <FormRow label={`${labels.id} :`} error={errors.projectNo}>
              <TextField
                fullWidth
                size="small"
                value={formData.projectNo}
                onChange={handleAmountChange("projectNo")}
                disabled={readOnly}
              />
            </FormRow>

            <FormRow label={`${labels.date} :`} error={errors.projectDate}>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={formData.projectDate}
                onChange={handleChange("projectDate")}
                disabled={readOnly}
              />
            </FormRow>
          </Box>

          <FormRow label="Customer Name :" error={errors.customerName}>
            <Select
              fullWidth
              size="small"
              value={formData.customerName}
              onChange={handleChange("customerName")}
              disabled={readOnly}
            >
              <MenuItem value="">Select</MenuItem>
              {customers.map((c) => (
                <MenuItem key={c.CustomerID} value={c.CustomerID}>
                  {c.CustomerName}
                </MenuItem>
              ))}
            </Select>
          </FormRow>

          <FormRow label={`${labels.entity} :`} error={errors.projectName}>
            <TextField
              fullWidth
              size="small"
              value={formData.projectName}
              onChange={
                isPayment
                  ? handleAmountChange("projectName")
                  : handleAlphaOnly("projectName")
              }
              disabled={readOnly}
            />
          </FormRow>

          <FormRow label={`${labels.createdBy} :`} error={errors.createdBy}>
            <Select
              fullWidth
              size="small"
              value={formData.createdBy}
              onChange={handleChange("createdBy")}
              disabled={readOnly}
            >
              <MenuItem value="">Select</MenuItem>
              {employees.map((e) => (
                <MenuItem key={e.Id} value={e.EmployeeName}>
                  {e.EmployeeName}
                </MenuItem>
              ))}
            </Select>
          </FormRow>

          <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
            <FormRow label={`${labels.follow1} :`}>
              <Select
                fullWidth
                size="small"
                value={formData.followBy1}
                onChange={handleChange("followBy1")}
                disabled={readOnly}
              >
                <MenuItem value="">Select</MenuItem>
                {employees.map((e) => (
                  <MenuItem key={e.Id} value={e.EmployeeName}>
                    {e.EmployeeName}
                  </MenuItem>
                ))}
              </Select>
            </FormRow>

            <FormRow label={`${labels.follow2} :`}>
              <Select
                fullWidth
                size="small"
                value={formData.followBy2}
                onChange={handleChange("followBy2")}
                disabled={readOnly}
              >
                <MenuItem value="">Select</MenuItem>
                {employees.map((e) => (
                  <MenuItem key={e.Id} value={e.EmployeeName}>
                    {e.EmployeeName}
                  </MenuItem>
                ))}
              </Select>
            </FormRow>
          </Box>

          <FormRow label="Notes :">
            <TextField
              fullWidth
              multiline
              rows={5}
              size="small"
              value={formData.notes}
              onChange={handleChange("notes")}
              disabled={readOnly}
            />
          </FormRow>

          <Box sx={{ display: "flex", gap: 3, mb: 2, alignItems: "center" }}>
            <FormRow label={`${labels.followUpDate} :`}>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange("followUpDate")}
                disabled={readOnly}
              />
            </FormRow>

            <FormControlLabel
              label="No Follow-up Required"
              control={
                <Checkbox
                  checked={formData.noFollowUpRequired}
                  onChange={handleChange("noFollowUpRequired")}
                  disabled={readOnly}
                />
              }
            />
          </Box>

          {/* SAVE / CANCEL / CLOSE */}
          <Box className="form-buttons">
            {!readOnly && (
              <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmit}>
                SAVE
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
        </Paper>
      )}
    </Box>
  );
};
export default ProjectFollowUpForm;