import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,  
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  InputBase,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";

/**
 * StandardTable Component
 * 
 * Provides a consistent table structure across the application with:
 * - Title
 * - Search functionality
 * - Export and Add buttons
 * - Table with checkboxes
 * - Pagination
 * - Action menu (Edit, View, Delete)
 * 
 * @param {string} title - Page title
 * @param {array} columns - Column definitions [{field: 'name', headerName: 'Customer', width: 150}, ...]
 * @param {array} rows - Table data
 * @param {function} onAdd - Callback when Add button is clicked
 * @param {function} onEdit - Callback when Edit is clicked
 * @param {function} onView - Callback when View is clicked
 * @param {function} onDelete - Callback when Delete is clicked
 * @param {function} onExport - Callback when Export is clicked
 * @param {string} search - Search text
 * @param {function} setSearch - Search setter
 * @param {boolean} showCheckbox - Show/hide checkboxes (default: true)
 * @param {array} selectedRows - Array of selected row IDs
 * @param {function} setSelectedRows - Setter for selected rows
 */
export default function StandardTable({
  title = "List",
  columns = [],
  rows = [],
  onAdd,
  onEdit,
  onView,
  onDelete,
  onExport,
  search = "",
  setSearch,
  showCheckbox = true,
  selectedRows = [],
  setSelectedRows,
  pageSize = 10
}) {
  const [isDarkMode, setIsDarkMode] = useState(
    document.body.classList.contains("dark")
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Listen for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark"));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Filter rows based on search
  const filteredRows = rows.filter((row) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return Object.values(row).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Menu
  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Actions
  const handleEdit = () => {
    if (onEdit) onEdit(selectedRow);
    handleMenuClose();
  };

  const handleView = () => {
    if (onView) onView(selectedRow);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (onDelete) onDelete(selectedRow);
    handleMenuClose();
  };

  // Checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(paginatedRows.map((row) => row.id || row.ID || row.Id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, rowId) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, rowId]);
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    }
  };

  const allSelected =
    paginatedRows.length > 0 &&
    paginatedRows.every((row) =>
      selectedRows.includes(row.id || row.ID || row.Id)
    );

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: isDarkMode ? "#0a0a14" : "#ffffff"
      }}
    >
      {/* ===== TITLE ===== */}
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 700,
          color: isDarkMode ? "#ffffff" : "#0d47a1",
          mb: 3
        }}
      >
        {title}
      </Typography>

      {/* ===== SEARCH + BUTTONS ===== */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        gap={2}
      >
        {/* SEARCH BOX */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: 300,
            border: isDarkMode ? "1px solid #444" : "1px solid #cfd8dc",
            borderRadius: 1,
            px: 2,
            height: 40,
            backgroundColor: isDarkMode ? "#1a1a2e" : "#fafafa"
          }}
        >
          <SearchIcon sx={{ mr: 1, color: isDarkMode ? "#888" : "#607d8b" }} />
          <InputBase
            placeholder={`Search in ${title}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{ 
              fontSize: 14,
              color: isDarkMode ? "#ffffff" : "#212121",
              "& ::placeholder": {
                color: isDarkMode ? "#999" : "#999",
                opacity: 1
              }
            }}
          />
        </Box>

        {/* ACTION BUTTONS */}
        <Box display="flex" gap={2}>
          {onExport && (
            <Button
              variant="contained"
              onClick={onExport}
              sx={{
                backgroundColor: "#1976d2",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#1565c0" }
              }}
            >
              {selectedRows.length > 0
                ? `Export Selected (${selectedRows.length})`
                : "Export Selected"}
            </Button>
          )}
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{
                backgroundColor: "#1976d2",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#1565c0" }
              }}
            >
              Add {title.slice(0, -1)}
            </Button>
          )}
        </Box>
      </Box>

      {/* ===== TABLE ===== */}
      <TableContainer
        sx={{
          border: isDarkMode ? "1px solid #333333" : "1px solid #e0e0e0",
          borderRadius: 1,
          backgroundColor: isDarkMode ? "#0a0a14" : "#ffffff"
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDarkMode ? "#1e3a8a" : "#e3f2fd",
                "& th": {
                  backgroundColor: isDarkMode ? "#1e3a8a" : "#e3f2fd",
                  color: isDarkMode ? "#ffffff" : "#0d47a1",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "12px 8px"
                }
              }}
            >
              {showCheckbox && (
                <TableCell padding="checkbox" sx={{ width: 50 }}>
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 && !allSelected
                    }
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    width: col.width || "auto",
                    minWidth: col.minWidth || 80
                  }}
                >
                  {col.headerName}
                </TableCell>
              ))}
              <TableCell sx={{ width: 60, textAlign: "center" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow
                key={row.id || row.ID || row.Id || index}
                hover
                sx={{
                  backgroundColor: isDarkMode
                    ? index % 2 === 0 ? "#1a1a2e" : "#0f0f1e"
                    : index % 2 === 0 ? "#fafafa" : "#ffffff",
                  "&:hover": { 
                    backgroundColor: isDarkMode ? "#2a4a9a" : "#e3f2fd"
                  },
                  borderBottom: isDarkMode ? "1px solid #333333" : "1px solid #e0e0e0",
                  color: isDarkMode ? "#ffffff" : "#212121"
                }}
              >
                {showCheckbox && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(
                        row.id || row.ID || row.Id
                      )}
                      onChange={(e) =>
                        handleSelectRow(
                          e,
                          row.id || row.ID || row.Id
                        )
                      }
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell
                    key={`${row.id || row.ID || row.Id}-${col.field}`}
                    sx={{ padding: "10px 8px", fontSize: 13 }}
                  >
                    {row[col.field] || "-"}
                  </TableCell>
                ))}
                <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, row)}
                    sx={{ color: isDarkMode ? "#888" : "#607d8b" }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedRow === row}
                    onClose={handleMenuClose}
                  >
                    {onView && (
                      <MenuItem onClick={handleView}>View</MenuItem>
                    )}
                    {onEdit && (
                      <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    )}
                    {onDelete && (
                      <MenuItem
                        onClick={handleDelete}
                        sx={{ color: "#d32f2f" }}
                      >
                        Delete
                      </MenuItem>
                    )}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
            {paginatedRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + (showCheckbox ? 2 : 1)
                  }
                  sx={{ textAlign: "center", py: 3, color: isDarkMode ? "#666" : "#999" }}
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ===== PAGINATION ===== */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ 
          backgroundColor: isDarkMode ? "#1a1a2e" : "#fafafa",
          borderTop: isDarkMode ? "1px solid #333333" : "1px solid #e0e0e0",
          color: isDarkMode ? "#ffffff" : "#212121"
        }}
      />
    </Paper>
  );
}
