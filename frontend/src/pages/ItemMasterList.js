import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer, 
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  TextField
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import ItemForm from "./ItemForm";

import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Checkbox from "@mui/material/Checkbox";

export default function ItemMasterList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const filteredRows = items.filter((row) => {
  const values = Object.values(row).join(" ").toLowerCase();
  return values.includes(search.toLowerCase());
});
  // FORM CONTROL
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Load table data
  const loadData = async () => {
    const res = await fetch("http://localhost:5000/api/itemmaster");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 3 DOT MENU OPEN
  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // =============================
  // DELETE RECORD
  // =============================
  const handleDelete = async () => {
    if (!selectedRow?.ID) return;

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const res = await fetch(
      `http://localhost:5000/api/itemmaster/${selectedRow.ID}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      alert("Deleted Successfully");
      loadData();
    } else {
      alert("Failed to delete");
    }

    handleMenuClose();
  };

  // =============================
  // OPEN ADD FORM
  // =============================
  const openAddForm = () => {
    setEditData(null);
    setOpenForm(true);
  };

  // =============================
  // OPEN EDIT FORM
  // =============================
  const openEditForm = () => {
    setEditData(selectedRow);
    setOpenForm(true);
    handleMenuClose();
  };

  // =============================
  // OPEN VIEW (read-only) FORM
  // =============================
  const openViewForm = () => {
    if (!selectedRow) return;
    // pass a readOnly/view flag to ItemForm; ItemForm honors editData.readOnly || editData.view
    setEditData({ ...selectedRow, readOnly: true, view: true });
    setOpenForm(true);
    handleMenuClose();
  };

  // =============================
// EXPORT FUNCTIONS
// =============================
const exportCSV = () => {
  if (!filteredRows.length) {
    alert("No data to export");
    return;
  }

  const headers = Object.keys(filteredRows[0]);
  const csvData = [
    headers.join(","),
    ...filteredRows.map(row =>
      headers.map(h => `"${row[h] ?? ""}"`).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "item_master.csv");
};

const exportExcel = () => {
  if (!filteredRows.length) {
    alert("No data to export");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(filteredRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "item_master.xlsx");
};

  // CLOSE FORM
  const closeForm = () => {
    setOpenForm(false);
    setEditData(null);
    loadData();
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
    setSelectedRows(filteredRows.map((r) => r.ID));
  } else {
    setSelectedRows([]);
  }
};

  // =============================
  // RENDER LIST OR FORM
  // =============================
  if (openForm) {
    return <ItemForm editData={editData} onClose={closeForm} />;
  }

  // =============================
  // TABLE UI
  // =============================
  return (
    <Box sx={{ width: "100%", p: 1 , mt: 10}}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Item Master</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddForm}
        >
          Add 
        </Button>
      </Box>

   <Box
     display="flex"
     justifyContent="space-between"
     alignItems="center"
     mb={2}
    > 
   {/* ⬇️ EXPORT ICON */}
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

    {/* 🔍 SEARCH */}
     <TextField
       size="small"
       placeholder="Search..."
       value={search}
       onChange={(e) => setSearch(e.target.value)}
       sx={{ width: 250 }}
     />
    </Box>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
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
             <TableCell>Article No</TableCell>
             <TableCell>Type Designation</TableCell>
             <TableCell>Master ID</TableCell>
             <TableCell>Store Location</TableCell>
             <TableCell>Net Price</TableCell>
             <TableCell>HSN Code</TableCell>
             <TableCell align="center">Action</TableCell>
           </TableRow>
          </TableHead>
        <TableBody>
         {filteredRows
           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
           .map((row) => (
            <TableRow key={row.ID} 
              hover
              selected={isSelected(row.ID)}
            >
            <TableCell padding="checkbox">
             <Checkbox
               checked={isSelected(row.ID)}
               onChange={() => handleSelectRow(row.ID)}
            />
            </TableCell>
              <TableCell>{row.ArticleNo}</TableCell>
              <TableCell>{row.TypeDesignation}</TableCell>
              <TableCell>{row.MasterId}</TableCell>
              <TableCell>{row.StoreLocation}</TableCell>
              <TableCell>{row.NetPrice}</TableCell>
              <TableCell>{row.HSNCode}</TableCell>

              <TableCell align="center">
                <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
    />
      {/* 3 DOT MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={openViewForm}>View</MenuItem>
        <MenuItem onClick={openEditForm}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}