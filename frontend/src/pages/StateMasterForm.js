import React, { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import Checkbox from "@mui/material/Checkbox";
import InputBase from "@mui/material/InputBase";
import * as XLSX from "xlsx";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
const [selected, setSelected] = useState([]);
const [search, setSearch] = useState("");

/* ===== EXPORT MENU ===== */
const [exportAnchorEl, setExportAnchorEl] = useState(null);

  /* ===== FORM ===== */
  const [form, setForm] = useState({
    StateId: "",
    StateName: ""
  });

  const [errors, setErrors] = useState({});

  /* ===== MENU ===== */
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

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
  const handleDelete = async () => {
    await axios.delete(
      `http://localhost:5000/api/statemaster/delete/${selectedRow.StateId}`
    );
    loadStates();
    setAnchorEl(null);
  };

  /* =====================================================
     MENU ACTIONS
  ===================================================== */
  const openMenu = (e, row) => {
    setAnchorEl(e.currentTarget);
    setSelectedRow(row);
  };

  const handleView = () => {
    setForm(selectedRow);
    setReadOnly(true);
    setView("form");
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setForm(selectedRow);
    setEditing(true); 
    setReadOnly(false);
    setView("form");
    setAnchorEl(null);
  };

  const handleRowSelect = (id) => {
  setSelected(prev =>
    prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id]
  );
};

const handleSelectAll = (checked) => {
  if (checked) {
    setSelected(filteredRows.map(r => r.StateId));
  } else {
    setSelected([]);
  }
};

const exportCSV = () => {
  if (selected.length === 0) {
    alert("Please select at least one row");
    return;
  }

  const exportData = rows
    .filter(r => selected.includes(r.StateId))
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
  if (selected.length === 0) {
    alert("Please select at least one row");
    return;
  }

  const exportData = rows
    .filter(r => selected.includes(r.StateId))
    .map(r => ({
      "State Id": r.StateId,
      "State Name": r.StateName
    }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "StateMaster");

  XLSX.writeFile(workbook, "StateMaster.xlsx");
};
  const filteredRows = rows.filter(row =>
  Object.values(row)
    .join(" ")
    .toLowerCase()
    .includes(search.toLowerCase())
);
  /* =====================================================
     TABLE VIEW
  ===================================================== */
  if (view === "table") {
    return (
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  {/* LEFT SIDE */}
  <Box display="flex" alignItems="center" gap={1}>
    <IconButton
  color="primary"
  onClick={(e) => {
    if (selected.length === 0) {
      alert("Please select at least one row");
      return;
    }
    setExportAnchorEl(e.currentTarget);
  }}
  title="Export"
>
  <DownloadIcon />
</IconButton>
    <Typography fontWeight={600}>State Master</Typography>
  </Box>

  {/* RIGHT SIDE */}
  <Box display="flex" alignItems="center" gap={2}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 1.5,
        borderRadius: 1,
        bgcolor: "action.hover"
      }}
    >
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
        setReadOnly(false);
        setView("form");
      }}
    >
      Add
    </Button>
  </Box>
</Box>
<Table>
  <TableHead>
  <TableRow>
    <TableCell padding="checkbox">
      <Checkbox
        indeterminate={
          selected.length > 0 &&
          selected.length < filteredRows.length
        }
        checked={
          filteredRows.length > 0 &&
          selected.length === filteredRows.length
        }
        onChange={(e) => handleSelectAll(e.target.checked)}
      />
    </TableCell>
    <TableCell>State Id</TableCell>
    <TableCell>State Name</TableCell>
    <TableCell align="right" />
  </TableRow>
</TableHead>
 <TableBody>
  {filteredRows.map(row => (
    <TableRow key={row.StateId}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected.includes(row.StateId)}
          onChange={() => handleRowSelect(row.StateId)}
        />
      </TableCell>

      <TableCell>{row.StateId}</TableCell>
      <TableCell>{row.StateName}</TableCell>

      <TableCell align="right">
        <IconButton onClick={(e) => openMenu(e, row)}>
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>

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


        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
        >
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

  /* =====================================================
     FORM VIEW
  ===================================================== */
  return (
    <Paper sx={{ width: 420, p: 3 }}>
       <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mb={3}
  >
    <Typography fontWeight={600}>
      State Master
    </Typography>

    <Button
      variant="outlined"
      size="small"
      sx={{
    color: "#1976d2",
    borderColor: "#1976d2",
    "&:hover": {
      backgroundColor: "#e3f2fd",
      borderColor: "#115293"
    }
  }}
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

      <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
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
      </Stack>
    </Paper>
  );
}

/* ===================================================== */
const FormRow = ({ label, children }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    <Box sx={{ width: 120, fontWeight: 500 }}>{label}</Box>
    <Box sx={{ flexGrow: 1 }}>{children}</Box>
  </Box>
);
