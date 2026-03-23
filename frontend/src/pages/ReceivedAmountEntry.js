import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import "./ReceivedAmountEntry.css";

const SAMPLE_INVOICES = [
  {
    id: "2333",
    date: "2023-06-02",
    customerName: "BHARAT FOR",
    total: 9263,
    receivedAmount: 0,
  },
  {
    id: "1",
    date: "2022-08-17",
    customerName: "3A INDUSTRIA",
    total: 295000,
    receivedAmount: 295000,
  },
  {
    id: "2",
    date: "2022-09-10",
    customerName: "3S POWER SY",
    total: 59000,
    receivedAmount: 0,
  },
  {
    id: "3",
    date: "2022-09-12",
    customerName: "3M INDIA",
    total: 2961.8,
    receivedAmount: 2961.8,
  },
  {
    id: "4",
    date: "2022-09-12",
    customerName: "3M INDIA",
    total: 2961.8,
    receivedAmount: 3000,
  },
  {
    id: "5",
    date: "2022-09-12",
    customerName: "3M INDIA",
    total: 2961.8,
    receivedAmount: 0,
  },
  {
    id: "6",
    date: "2022-09-12",
    customerName: "3M INDIA",
    total: 2961.8,
    receivedAmount: 0,
  },
  {
    id: "7",
    date: "2022-09-12",
    customerName: "3M INDIA",
    total: 2961.8,
    receivedAmount: 0,
  },
  {
    id: "8",
    date: "2022-09-12",
    customerName: "A T E HUBER",
    total: 5050.4,
    receivedAmount: 0,
  },
  {
    id: "9",
    date: "2022-09-14",
    customerName: "2K TECHNOLO",
    total: 55000,
    receivedAmount: 0,
  },
];

const ReceivedAmountEntry = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handleShowInvoices = () => {
    const filteredInvoices = SAMPLE_INVOICES.filter((inv) => {
      if (fromDate && inv.date < fromDate) return false;
      if (toDate && inv.date > toDate) return false;
      return true;
    });

    setInvoices(filteredInvoices);
    setShowTable(true);
  };

  const handleClose = () => {
    setFromDate("");
    setToDate("");
    setInvoices([]);
    setShowTable(false);
  };

  return (
    <Box className="rae-container">
      <Paper className="rae-paper" elevation={2}>
        <Typography className="rae-title">Received Amount Entry</Typography>

        <Box className="rae-filter-row">
          <Box className="rae-filter-field">
            <Typography className="rae-label">From</Typography>
            <TextField
              size="small"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Box>

          <Box className="rae-filter-field">
            <Typography className="rae-label">To</Typography>
            <TextField
              size="small"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Box>

          <Box className="rae-filter-field rae-buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={handleShowInvoices}
              size="small"
            >
              Show
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleClose}
            >
              Close
            </Button>
          </Box>
        </Box>

        {showTable ? (
          <>
            <Table className="rae-table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Invoice No</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Received Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} hover>
                    <TableCell>{inv.id}</TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell>{inv.customerName}</TableCell>
                    <TableCell>{inv.total}</TableCell>
                    <TableCell>{inv.receivedAmount}</TableCell>
                  </TableRow>
                ))}
                {invoices.length > 0 && (
                  <TableRow className="rae-total-row">
                    <TableCell colSpan="3" align="right">
                      <strong>Total:</strong>
                    </TableCell>
                    <TableCell>
                      <strong>
                        {invoices
                          .reduce((sum, inv) => sum + inv.total, 0)
                          .toFixed(2)}
                      </strong>
                    </TableCell>
                    <TableCell>
                      <strong>
                        {invoices
                          .reduce((sum, inv) => sum + inv.receivedAmount, 0)
                          .toFixed(2)}
                      </strong>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        ) : (
          <Box sx={{ mt: 2, color: "text.secondary" }}>
            Enter date range and click "Show" to view invoices.
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ReceivedAmountEntry;
