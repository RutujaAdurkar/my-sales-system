import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./CityMaster.css";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper
} from "@mui/material";
import axios from "axios";
import StandardTable from "../components/StandardTable";


/* ================================================= */
export default function CityMaster() {
  /* ===== VIEW CONTROL ===== */
  const [view, setView] = useState("table"); // table | form
  const [readOnly, setReadOnly] = useState(false);
  const [editing, setEditing] = useState(false);

  /* ===== TABLE DATA ===== */
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

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
  const [search, setSearch] = useState("");

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
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    await axios.delete(
      `http://localhost:5000/api/citymaster/delete/${form.cityId}`
    );
    loadCities();
    setView("table");
    clearForm();
  };

  /* =================================================
     EXPORT HANDLERS
  ================================================= */
  const exportCSV = () => {
    const exportData = rows
      .filter(r => selectedRows.includes(r.cityId))
      .map(r => ({
        "City Id": r.cityId,
        "City Name": r.cityName,
        "Area Name": r.areaName,
        "State": r.state
      }));

    if (exportData.length === 0) {
      alert("No rows selected");
      return;
    }

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
  };

  const exportExcel = () => {
    const exportData = rows
      .filter(r => selectedRows.includes(r.cityId))
      .map(r => ({
        "City Id": r.cityId,
        "City Name": r.cityName,
        "Area Name": r.areaName,
        "State": r.state
      }));

    if (exportData.length === 0) {
      alert("No rows selected");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CityMaster");

    XLSX.writeFile(workbook, "CityMaster.xlsx");
  };

  const handleExport = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row");
      return;
    }
    exportExcel();
  };


  /* =================================================
     MENU ACTIONS
  ================================================= */
  const handleEdit = (row) => {
    setForm(row);
    setReadOnly(false);
    setEditing(true);  
    setView("form");
  };

  const handleView = (row) => {
    setForm(row);
    setReadOnly(true);
    setView("form");
  };

  const filteredRows = rows.filter(row =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    { field: "cityId", headerName: "City Id", width: 100 },
    { field: "cityName", headerName: "City Name", width: 150 },
    { field: "areaName", headerName: "Area Name", width: 150 },
    { field: "state", headerName: "State", width: 150 }
  ];

  /* =================================================
     TABLE VIEW
  ================================================= */
  if (view === "table") {
    return (
      <StandardTable
        title="City Master"
        columns={columns}
        rows={rows}
        search={search}
        setSearch={setSearch}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        onAdd={() => {
          clearForm();
          setEditing(false);
          setReadOnly(false);
          setView("form");
        }}
        onExport={handleExport}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        pageSize={10}
      />
    );
  }

  /* =================================================
     FORM VIEW
  ================================================= */
  return (
    <Paper className="city-form">
      <Box className="form-header">
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
          <Button variant="contained" className="save-btn" onClick={handleSave}>
            Save
          </Button>
        )}
        <Button
          variant="contained"
          className="cancel-btn"
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
