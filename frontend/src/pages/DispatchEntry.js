import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControlLabel,
  MenuItem,
} from "@mui/material";

import "./DispatchEntry.css";

const SAMPLE_INVOICES = [
  {
    id: "4052",
    date: "2024-06-21",
    customer: "O.B.A CELL TECHNOLOGIES",
    salesman: "Mohan Mane",
    courier: "BLUE DART",
    courierName: "BLUE DART",
    docketNo: "58800231270",
    courierDate: "2024-06-21",
    email: "",
    email2: "",
  },
  {
    id: "2974",
    date: "2023-06-09",
    customer: "TATA MOTORS PASSENGER",
    salesman: "Arvind Talange",
    courier: "FIRST FLIGHT",
    courierName: "FIRST FLIGHT",
    docketNo: "",
    courierDate: "2023-06-09",
    email: "",
    email2: "",
  },
  {
    id: "2338",
    date: "2023-06-02",
    customer: "BHARAT FORCE LIMITED",
    salesman: "Arvind Talange",
    courier: "FIRST FLIGHT",
    courierName: "FIRST FLIGHT",
    docketNo: "",
    courierDate: "2021-06-02",
    email: "",
    email2: "",
  },
  {
    id: "257",
    date: "2025-04-04",
    customer: "GOOSE INDUSTRIAL",
    salesman: "Abhijit Walikar",
    courier: "SHREE MARUTI",
    courierName: "SHREE MARUTI",
    docketNo: "",
    courierDate: "2025-04-04",
    email: "",
    email2: "",
  },
];

const CUSTOMERS = [
  "O.B.A CELL TECHNOLOGIES",
  "TATA MOTORS PASSENGER",
  "BHARAT FORCE LIMITED",
  "GOOSE INDUSTRIAL",
];

const DispatchEntry = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState({});
  const [showTable, setShowTable] = useState(false);

  const handleShowInvoices = () => {
    // TODO: replace with real API fetch
    const filteredInvoices = SAMPLE_INVOICES.filter((inv) => {
      if (!showAll) {
        if (customer && inv.customer !== customer) return false;
      }
      if (fromDate && inv.date < fromDate) return false;
      if (toDate && inv.date > toDate) return false;
      return true;
    });

    setInvoices(filteredInvoices);
    setShowTable(true);
  };

  const handleToggle = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendEmail = () => {
    const selectedInvoices = invoices.filter((inv) => selected[inv.id]);
    if (selectedInvoices.length === 0) {
      alert("Please select at least one invoice to email.");
      return;
    }
    alert(
      `Sending email for ${selectedInvoices.length} invoice(s): ${selectedInvoices
        .map((inv) => inv.id)
        .join(", ")}`
    );
  };

  return (
    <Box className="de-container">
      <Paper className="de-paper" elevation={2}>
        <Typography className="de-title">Dispatch Entry</Typography>

        <Box className="de-filter-row">
          <Box className="de-filter-field">
            <Typography className="de-label">From</Typography>
            <TextField
              size="small"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Box>

          <Box className="de-filter-field">
            <Typography className="de-label">To</Typography>
            <TextField
              size="small"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Box>

          <Box className="de-filter-field de-buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={handleShowInvoices}
              size="small"
            >
              Show Invoices
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => {
                setFromDate("");
                setToDate("");
                setCustomer("");
                setShowAll(true);
                setInvoices([]);
                setSelected({});
                setShowTable(false);
              }}
            >
              Close
            </Button>
          </Box>
        </Box>

        <Box className="de-filter-row de-filter-row--secondary">
          <Box className="de-filter-field">
            <Typography className="de-label">Customer Name</Typography>
            <TextField
              select
              size="small"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              disabled={showAll}
            >
              <MenuItem value="">Select</MenuItem>
              {CUSTOMERS.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box className="de-filter-field de-checkbox-field">
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                />
              }
              label="All"
              className="de-checkbox"
            />
          </Box>
        </Box>

        {showTable ? (
          <>
            <Table className="de-table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Send Email</TableCell>
                  <TableCell>Invoice</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Salesman</TableCell>
                  <TableCell>Courier</TableCell>
                  <TableCell>Courier Name</TableCell>
                  <TableCell>Docket No</TableCell>
                  <TableCell>Courier Date</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} hover>
                    <TableCell>
                      <Checkbox
                        checked={!!selected[inv.id]}
                        onChange={() => handleToggle(inv.id)}
                      />
                    </TableCell>
                    <TableCell>{inv.id}</TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell>{inv.customer}</TableCell>
                    <TableCell>{inv.salesman}</TableCell>
                    <TableCell>{inv.courier}</TableCell>
                    <TableCell>{inv.courierName}</TableCell>
                    <TableCell>{inv.docketNo}</TableCell>
                    <TableCell>{inv.courierDate}</TableCell>
                    <TableCell>{inv.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box className="de-actions">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendEmail}
                size="small"
              >
                Send Email
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ mt: 2, color: "text.secondary" }}>
            Click "Show Invoices" to view results.
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DispatchEntry;
