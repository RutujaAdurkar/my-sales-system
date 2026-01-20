import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem
} from "@mui/material";

import "./PaymentFollowupReport.css";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

/* ---------------- CUSTOMER DROPDOWN DATA ---------------- */
const CUSTOMER_LIST = [
  "ALL",
  "2K TECHNOLOGIES",
  "AURANGABAD ELECTRICALS LTD",
  "B.K. ENGINEERS",
  "BARAMATI SPECIAL STEELS LTD",
  "CONSOLIDATED HOISTS PVT LTD",
  "THERMAX LTD"
];

export default function PaymentFollowupReport() {
  const [showTable, setShowTable] = useState(false);

const [alertOpen, setAlertOpen] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: "2019-04-01",
    toDate: "2026-01-13",
    customer: "ALL",
    all: true
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "all" && checked ? { customer: "ALL" } : {})
    }));
  };

  //const handleShow = () => setShowTable(true);

  const handleShow = () => {
  // check if all fields are empty
  const isNothingFilled =
    !filters.fromDate &&
    !filters.toDate &&
    (!filters.customer || filters.customer === "ALL");

  if (isNothingFilled) {
    setShowTable(false);
    setAlertOpen(true);
    return;
  }

  setShowTable(true);
};

  const handleClose = () => {
    setShowTable(false);
    setFilters({
      fromDate: "",
      toDate: "",
      customer: "ALL",
      all: false
    });
  };

  return (
    <Box className="page-container">
      <Paper className="report-form">
        {/* -------- ROW 1 : DATES -------- */}
        <Box className="form-row">
          <label>From Date</label>
          <TextField
            type="date"
            size="small"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleChange}
          />

          <label>To Date</label>
          <TextField
            type="date"
            size="small"
            name="toDate"
            value={filters.toDate}
            onChange={handleChange}
          />
        </Box>

        {/* -------- ROW 2 : CUSTOMER -------- */}
        <Box className="form-row">
          <label>Customer</label>

          <TextField
            select
            size="small"
            name="customer"
            value={filters.customer}
            onChange={handleChange}
            disabled={filters.all}
            style={{ width: 320 }}
          >
            {CUSTOMER_LIST.map((cust) => (
              <MenuItem key={cust} value={cust}>
                {cust}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                name="all"
                checked={filters.all}
                onChange={handleChange}
              />
            }
            label="ALL"
          />
        </Box>

        {/* -------- ROW 3 : BUTTONS -------- */}
        <Box className="form-row buttons-row">
          <Button variant="outlined" onClick={handleShow}>
            Show
          </Button>
          <Button variant="outlined">Print</Button>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Paper>

      {/* -------- TABLE -------- */}
      {showTable && (
        <Paper className="table-wrapper">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Project Date</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Salesman</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Attention</TableCell>
                <TableCell>Application No</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>01-04-2019</TableCell>
                <TableCell>AURANGABAD ELECTRICALS LTD</TableCell>
                <TableCell>Shreyas P</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>0</TableCell>
                <TableCell>Mail sent</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
    
      )}
      <Snackbar
  open={alertOpen}
  autoHideDuration={3000}
  onClose={() => setAlertOpen(false)}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <MuiAlert
    onClose={() => setAlertOpen(false)}
    severity="warning"
    variant="filled"
  >
    Please select at least one filter before clicking Show
  </MuiAlert>
</Snackbar>

    </Box>
  );
}
