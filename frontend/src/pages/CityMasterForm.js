import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./CityMaster.css";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description"; // CSV
import TableChartIcon from "@mui/icons-material/TableChart";   // Excel
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Stack,
  IconButton,
  Menu,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TableContainer,
  TablePagination,
  InputBase
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";


/* ================================================= */
export default function CityMaster() {
  /* ===== VIEW CONTROL ===== */
  const [view, setView] = useState("table"); // table | form
  const [readOnly, setReadOnly] = useState(false);
  const [editing, setEditing] = useState(false);
/* ===== EXPORT MENU ===== */
const [exportAnchorEl, setExportAnchorEl] = useState(null);

  /* ===== TABLE DATA ===== */
  const [rows, setRows] = useState([]);

  /* ===== STATE DROPDOWN ===== */
  const [states, setStates] = useState([]);

  /* ===== FORM ===== */
  const [form, setForm] = useState({
    cityId: "",
    cityName: "",
    areaName: "",
    state: ""
  });

  const [errors, setErrors] = useState({});

  /* ===== MENU ===== */
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  /* =================================================
     LOAD DATA
  ================================================= */
  const loadCities = async () => {
    const res = await axios.get("http://localhost:5000/api/citymaster/list");
    setRows(res.data);
  };

  useEffect(() => {
    loadCities();
    axios.get("http://localhost:5000/api/state/list")
      .then(res => setStates(res.data));
  }, []);

  /* =================================================
     FORM HELPERS
  ================================================= */
  const handleTextChange = (field) => (e) => {
    const v = e.target.value;
    if (/^[A-Za-z ]*$/.test(v)) {
      setForm(p => ({ ...p, [field]: v.toUpperCase() }));
      setErrors(p => ({ ...p, [field]: "" }));
    }
  };

  const handleNumberChange = (field) => (e) => {
    const v = e.target.value;
    if (/^\d*$/.test(v)) {
      setForm(p => ({ ...p, [field]: v }));
      setErrors(p => ({ ...p, [field]: "" }));
    }
  };

  const clearForm = () => {
    setForm({ cityId: "", cityName: "", areaName: "", state: "" });
    setErrors({});
  };

  /* =================================================
     VALIDATION
  ================================================= */
  const validateForm = () => {
    let e = {};
    if (!form.cityId) e.cityId = "Required";
    if (!form.cityName) e.cityName = "Required";
    if (!form.state) e.state = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =================================================
     SAVE
  ================================================= */

  const handleSave = async () => {
  if (!validateForm()) return;

  if (editing) {
    await axios.put(
      `http://localhost:5000/api/citymaster/update/${form.cityId}`,
      form
    );
  } else {
    await axios.post(
      "http://localhost:5000/api/citymaster/save",
      form
    );
  }

  loadCities();
  setView("table");
  clearForm();
  setEditing(false);
};

     
  /* =================================================
     DELETE
  ================================================= */
  const handleDelete = async () => {
    await axios.delete(
      `http://localhost:5000/api/citymaster/delete/${selectedRow.cityId}`
    );
    loadCities();
    setAnchorEl(null);
  };

  const handleRowSelect = (cityId) => {
  setSelected(prev =>
    prev.includes(cityId)
      ? prev.filter(id => id !== cityId)
      : [...prev, cityId]
  );
};

const handleSelectAll = (checked) => {
  if (checked) {
    setSelected(filteredRows.map(r => r.cityId));
  } else {
    setSelected([]);
  }
};
/* =================================================
   EXPORT HANDLERS
================================================= */
const openExportMenu = (e) => {
  if (selected.length === 0) {
    alert("Please select at least one row");
    return;
  }
  setExportAnchorEl(e.currentTarget);
};

const closeExportMenu = () => setExportAnchorEl(null);

/* ----- CSV EXPORT ----- */
const exportCSV = () => {
  const exportData = rows
    .filter(r => selected.includes(r.cityId))
    .map(r => ({
      "City Id": r.cityId,
      "City Name": r.cityName,
      "Area Name": r.areaName,
      "State": r.state
    }));

  const headers = Object.keys(exportData[0]).join(",");
  const csvRows = exportData.map(r =>
    Object.values(r).map(v => `"${v}"`).join(",")
  );

  const csv = [headers, ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "CityMaster.csv";
  link.click();

  closeExportMenu();
};

/* ----- EXCEL EXPORT ----- */
const exportExcel = () => {
  const exportData = rows
    .filter(r => selected.includes(r.cityId))
    .map(r => ({
      "City Id": r.cityId,
      "City Name": r.cityName,
      "Area Name": r.areaName,
      "State": r.state
    }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "CityMaster");

  XLSX.writeFile(workbook, "CityMaster.xlsx");
  closeExportMenu();
};

/* =================================================
   EXPORT SELECTED
================================================= */
const handleExport = () => {
  if (selected.length === 0) {
    alert("Please select at least one row");
    return;
  }

  const exportData = rows
    .filter(r => selected.includes(r.cityId))
    .map(r => ({
      "City Id": r.cityId,
      "City Name": r.cityName,
      "Area Name": r.areaName,
      "State": r.state
    }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "CityMaster");

  XLSX.writeFile(workbook, "CityMaster.xlsx");
};


  /* =================================================
     MENU ACTIONS
  ================================================= */
  const openMenu = (e, row) => {
    setAnchorEl(e.currentTarget);
    setSelectedRow(row);
  };

  const handleEdit = () => {
    setForm(selectedRow);
    setReadOnly(false);
    setEditing(true);  
    setView("form");
    setAnchorEl(null);
  };

  const handleView = () => {
    setForm(selectedRow);
    setReadOnly(true);
    setView("form");
    setAnchorEl(null);
  };
  
  const filteredRows = rows.filter(row =>
  Object.values(row)
    .join(" ")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  /* =================================================
     TABLE VIEW
  ================================================= */
  if (view === "table") {
    return (
     
      <Paper className="city-container">
  
   <Box className="city-header">
    <Box display="flex" alignItems="center" gap={1}>
   
    <IconButton
      color="primary"
      onClick={openExportMenu}
      disabled={selected.length === 0}
      title="Export"
    >
      <DownloadIcon />
    </IconButton>

    <Typography className="city-title">City Master</Typography>
  </Box>

  <Box display="flex" gap={2} alignItems="center">
    <Box className="search-box">
      <SearchIcon fontSize="small" sx={{ mr: 1 }} />
      <InputBase
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ fontSize: 14 }}
      />
    </Box>
    
     <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => {
        clearForm();
        setEditing(false);
        setReadOnly(false);
        setView("form");
      }}
    >
      Add
    </Button>
  </Box>
</Box>
        <TableContainer>
          <Table size="small">
<TableHead>
  <TableRow>
    <TableCell padding="checkbox">
      <Checkbox
        indeterminate={
          selected.length > 0 && selected.length < filteredRows.length
        }
        checked={
          filteredRows.length > 0 &&
          selected.length === filteredRows.length
        }
        onChange={(e) => handleSelectAll(e.target.checked)}
      />
    </TableCell>

    <TableCell>City Id</TableCell>
    <TableCell>City Name</TableCell>
    <TableCell>Area Name</TableCell>
    <TableCell>State</TableCell>
    <TableCell align="right">Actions</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {filteredRows
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map(row => (
      <TableRow key={row.cityId}>
        {/* ✅ CHECKBOX COLUMN */}
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected.includes(row.cityId)}
            onChange={() => handleRowSelect(row.cityId)}
          />
        </TableCell>

        <TableCell>{row.cityId}</TableCell>
        <TableCell>{row.cityName}</TableCell>
        <TableCell>{row.areaName}</TableCell>
        <TableCell>{row.state}</TableCell>

        <TableCell align="right">
          <IconButton onClick={(e) => openMenu(e, row)}>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ))}
</TableBody>

        </Table>
      </TableContainer>

      <TablePagination
        component="div"
  count={filteredRows.length}
  page={page}
  onPageChange={(e, newPage) => setPage(newPage)}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={(e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }}
/>
{/* ===== EXPORT MENU ===== */}
<Menu
  anchorEl={exportAnchorEl}
  open={Boolean(exportAnchorEl)}
  onClose={closeExportMenu}
>
  <MenuItem onClick={exportCSV}>
    <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
    Export CSV
  </MenuItem>

  <MenuItem onClick={exportExcel}>
    <TableChartIcon fontSize="small" sx={{ mr: 1 }} />
    Export Excel
  </MenuItem>
</Menu>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={handleView}>
            <VisibilityIcon fontSize="small" style={{ marginRight: 8 }} />
            View
          </MenuItem>
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" style={{ marginRight: 8 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
            <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
            Delete
          </MenuItem>
        </Menu>
      </Paper>
    );
  }

  /* =================================================
     FORM VIEW
  ================================================= */
  return (
    <Paper className="city-form">
     <Box className="form-header">
      <Typography fontWeight={600} mb={3}>
        City Master
      </Typography>

        <Button
        variant="outlined"
        size="small"
        onClick={() => {
        setView("table");
        setReadOnly(false);
        setEditing(false);
        clearForm();
       }}
     >
      Back to Table
    </Button>
   </Box>

      <FormRow label="City Id">
        <TextField
          size="small"
          value={form.cityId}
          onChange={handleNumberChange("cityId")}
          disabled={readOnly}
          error={!!errors.cityId}
          helperText={errors.cityId}
          fullWidth
        />
      </FormRow>

      <FormRow label="City Name">
        <TextField
          size="small"
          value={form.cityName}
          onChange={handleTextChange("cityName")}
          disabled={readOnly}
          error={!!errors.cityName}
          helperText={errors.cityName}
          fullWidth
        />
      </FormRow>

      <FormRow label="Area Name">
        <TextField
          size="small"
          value={form.areaName}
          onChange={handleTextChange("areaName")}
          disabled={readOnly}
          fullWidth
        />
      </FormRow>

      <FormRow label="State">
        <TextField
          select
          size="small"
          value={form.state}
          disabled={readOnly}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          error={!!errors.state}
          helperText={errors.state}
          fullWidth
        >
          <MenuItem value="">Select</MenuItem>
          {states.map(s => (
            <MenuItem key={s.StateId} value={s.StateName}>
              {s.StateName}
            </MenuItem>
          ))}
        </TextField>
      </FormRow>

      <Box className="form-buttons">
        {!readOnly && (
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        )}
        <Button
          variant="contained"
          color="error"
          onClick={() => setView("table")}
        >
          {readOnly ? "Close" : "Cancel"}
        </Button>
      </Box>
    </Paper>
  );
}
/* ===== REUSABLE ROW ===== */
const FormRow = ({ label, children }) => (
  <Box className="form-row">
    <Box className="form-label">{label}</Box>
    <Box style={{ flexGrow: 1 }}>{children}</Box>
  </Box>
);

