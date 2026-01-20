import React, { useState } from "react";
import "./WildCardSearch.css";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

/* ---------------- SEARCH OPTIONS ---------------- */
const SEARCH_BY = [
  { value: "accountName", label: "Account Name" },
  { value: "city", label: "City" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" }
];

/* ---------------- DUMMY DATA ---------------- */
const DATA = [
  {
    salesPerson: "Rupesh",
    accountName: "WABCO INDIA LIMITED",
    address: "Plant II, Chennai",
    city: "Chennai",
    email: "karthikeyan@wabco.com",
    name: "Senthil",
    phone: "97999887"
  },
  {
    salesPerson: "Logesh",
    accountName: "ABC BEARINGS LTD",
    address: "Plot 10, Pune",
    city: "Pune",
    email: "sales@abc.com",
    name: "Ravi",
    phone: "88887777"
  }
];

export default function WildCardSearch() {
  const [searchBy, setSearchBy] = useState("accountName");
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState([]);
  const [showTable, setShowTable] = useState(false);

  /* ---------------- SHOW ---------------- */
  const handleSearch = () => {
    const filtered = DATA.filter(row =>
      row[searchBy]
        ?.toLowerCase()
        .includes(searchText.trim().toLowerCase())
    );

    setRows(filtered);
    setShowTable(true);
  };

  /* ---------------- CLEAR ---------------- */
  const handleClear = () => {
    setSearchText("");
    setRows([]);
    setShowTable(false);
  };

  return (
    <Box p={2} className="wildcard-container">
      <Paper className="wildcard-paper">
        <Typography className="wildcard-title">
          Wild Card Search
        </Typography>

        {/* SEARCH BY */}
        <Box className="wildcard-form-row">
          <Box className="wildcard-label">Search By</Box>
          <Box className="wildcard-field">
            <TextField
              select
              fullWidth
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              {SEARCH_BY.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        {/* SEARCH TEXT */}
        <Box className="wildcard-form-row">
          <Box className="wildcard-label">Search Text</Box>
          <Box className="wildcard-field">
            <TextField
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Box>
        </Box>

        {/* BUTTONS */}
        <Box className="wildcard-button-row">
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!searchText.trim()}
          >
            Show
          </Button>

          <Button variant="outlined" onClick={handleClear}>
            Clear
          </Button>
        </Box>

        {/* TABLE */}
        {showTable && (
          <>
            <Table size="small" className="wildcard-table">
              <TableHead>
                <TableRow>
                  <TableCell>SalesPerson Name</TableCell>
                  <TableCell>Account Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="wildcard-empty">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.salesPerson}</TableCell>
                      <TableCell>{row.accountName}</TableCell>
                      <TableCell>{row.address}</TableCell>
                      <TableCell>{row.city}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <Typography className="wildcard-footer">
              Total Matches: {rows.length}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}
