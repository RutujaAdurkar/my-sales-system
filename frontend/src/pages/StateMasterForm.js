import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./StateMaster.css";
import {
  Box,
  TextField,
  Button,
  Paper
} from "@mui/material";
import axios from "axios";
import StandardTable from "../components/StandardTable";

/* ===================================================== */
export default function StateMaster() {
  // 👈 exportCSV must be inside here

  /* ===== VIEW CONTROL ===== */
  const [view, setView] = useState("table"); // table | form
  const [readOnly, setReadOnly] = useState(false);
  const [editing, setEditing] = useState(false);

  /* ===== TABLE DATA ===== */
  const [rows, setRows] = useState([]);

  /* ===== SELECTION & SEARCH ===== */
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");

  /* ===== FORM ===== */
  const [form, setForm] = useState({
    StateId: "",
    StateName: ""
  });

  const [errors, setErrors] = useState({});

  /* =====================================================
     LOAD STATES
  ===================================================== */
  const loadStates = async () => {
    const res = await axios.get("http://localhost:5000/api/statemaster/list");
    setRows(res.data);
  };

  useEffect(() => {
    loadStates();
  }, []);

  /* =====================================================
     INPUT HANDLERS
  ===================================================== */
  const handleNumberChange = (field) => (e) => {
    const v = e.target.value;
    if (/^\d*$/.test(v)) {
      setForm(p => ({ ...p, [field]: v }));
      setErrors(p => ({ ...p, [field]: "" }));
    }
  };

  const handleTextChange = (field) => (e) => {
    const v = e.target.value.toUpperCase();
    if (/^[A-Z ]*$/.test(v)) {
      setForm(p => ({ ...p, [field]: v }));
      setErrors(p => ({ ...p, [field]: "" }));
    }
  };

  const clearForm = () => {
    setForm({ StateId: "", StateName: "" });
    setErrors({});
  };

  /* =====================================================
     VALIDATION
  ===================================================== */
  const validateForm = () => {
    let e = {};
    if (!form.StateName) e.StateName = "State Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =====================================================
     SAVE / UPDATE
  ===================================================== */
  const handleSave = async () => {
  if (!validateForm()) return;

  try {
    if (editing) {
      // ✅ UPDATE
      await axios.put(
        `http://localhost:5000/api/statemaster/update/${form.StateId}`,
        { stateName: form.StateName }
      );
    } else {
      // ✅ NEW SAVE
      await axios.post(
        "http://localhost:5000/api/statemaster/save",
        { stateName: form.StateName }
      );
    }

    loadStates();
    setView("table");
    setEditing(false);
    clearForm();

  } catch (err) {
    if (err.response?.status === 409) {
      setErrors({ StateName: "State already exists" });
    }
  }
};

  /* =====================================================
     DELETE
  ===================================================== */
  const handleDelete = async (row) => {
    if (!window.confirm("Are you sure you want to delete this state?")) return;
    await axios.delete(
      `http://localhost:5000/api/statemaster/delete/${row.StateId}`
    );
    loadStates();
    setView("table");
  };

  /* =====================================================
     MENU ACTIONS
  ===================================================== */
  const handleView = (row) => {
    setForm(row);
    setReadOnly(true);
    setView("form");
  };

  const handleEdit = (row) => {
    setForm(row);
    setEditing(true); 
    setReadOnly(false);
    setView("form");
  };

  const exportCSV = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row");
      return;
    }

    const exportData = rows
      .filter(r => selectedRows.includes(r.StateId))
      .map(r => ({
        "State Id": r.StateId,
        "State Name": r.StateName
      }));

    if (exportData.length === 0) return;

    const headers = Object.keys(exportData[0]).join(",");
    const csvRows = exportData.map(row =>
      Object.values(row).map(v => `"${v}"`).join(",")
    );

    const csv = [headers, ...csvRows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "StateMaster.csv";
    link.click();
  };

  const exportExcel = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row");
      return;
    }

    const exportData = rows
      .filter(r => selectedRows.includes(r.StateId))
      .map(r => ({
        "State Id": r.StateId,
        "State Name": r.StateName
      }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StateMaster");

    XLSX.writeFile(workbook, "StateMaster.xlsx");
  };

  const handleExport = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row");
      return;
    }
    exportExcel();
  };

  const filteredRows = rows.filter(row =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    { field: "StateId", headerName: "State Id", width: 100 },
    { field: "StateName", headerName: "State Name", width: 200 }
  ];
  /* =====================================================
     TABLE VIEW
  ===================================================== */
  if (view === "table") {
    return (
      <StandardTable
        title="State Master"
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

  /* =====================================================
     FORM VIEW
  ===================================================== */
  return (
    <Paper className="state-form">
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

      <FormRow label="State Id :">
        <TextField
          size="small"
          value={form.StateId}
          onChange={handleNumberChange("StateId")}
          disabled={readOnly}
          error={!!errors.StateId}
          helperText={errors.StateId}
          fullWidth
        />
      </FormRow>

      <FormRow label="State Name :">
        <TextField
          size="small"
          value={form.StateName}
          onChange={handleTextChange("StateName")}
          disabled={readOnly}
          error={!!errors.StateName}
          helperText={errors.StateName}
          fullWidth
        />
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

/* ===================================================== */
const FormRow = ({ label, children }) => (
  <Box className="form-row">
    <Box className="form-label">{label}</Box>
    <Box style={{ flexGrow: 1 }}>{children}</Box>
  </Box>
);