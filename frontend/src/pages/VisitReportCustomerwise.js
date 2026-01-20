import React, { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./VisitReportCustomerwise.css";

/* ---------------- DUMMY DROPDOWNS ---------------- */
const CUSTOMERS = ["TOLIA INDUSTRIES", "WHEELS INDIA LTD", "JSW STEEL"];
const SALESMEN = ["Madhav Oka", "Sudam Patil", "Shreyas P"];

/* ---------------- DUMMY TABLE DATA ---------------- */
const DATA = [
  {
    visitNo: "K343",
    visitDate: "2019-04-01",
    customer: "TOLIA INDUSTRIES",
    salesman: "Madhav Oka",
    visitWith: "",
    nextFollowUp: "2019-04-07",
    projectNo: ""
  },
  {
    visitNo: "K525",
    visitDate: "2019-04-03",
    customer: "WHEELS INDIA LTD",
    salesman: "Sudam Patil",
    visitWith: "",
    nextFollowUp: "2019-04-10",
    projectNo: ""
  },
  {
    visitNo: "K600",
    visitDate: "2019-05-01",
    customer: "JSW STEEL",
    salesman: "Shreyas P",
    visitWith: "",
    nextFollowUp: "2019-05-06",
    projectNo: ""
  }
];

const FormRow = ({ label, children, right }) => (
  <Grid container spacing={2} alignItems="center" className="form-row">
    <Grid item xs={12} md={2}>
      <Typography className="form-label">{label}</Typography>
    </Grid>

    <Grid item xs={12} md={6} className="form-field">
      {children}
      {right && <Box className="form-right">{right}</Box>}
    </Grid>
  </Grid>
);


export default function VisitReportCustomerwise() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    customer: "",
    salesman: "",
    customerAll: false,
    salesmanAll: false
  });

  const [showTable, setShowTable] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  /* ---------------- SHOW BUTTON ---------------- */
  const handleShow = () => {
    if (!filters.fromDate || !filters.toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    const from = new Date(filters.fromDate);
    const to = new Date(filters.toDate);

    const result = DATA.filter((row) => {
      const visitDate = new Date(row.visitDate);

      const dateMatch = visitDate >= from && visitDate <= to;
      const customerMatch =
        filters.customerAll || row.customer === filters.customer;
      const salesmanMatch =
        filters.salesmanAll || row.salesman === filters.salesman;

      return dateMatch && customerMatch && salesmanMatch;
    });

    setFilteredData(result);
    setShowTable(true);
  };

  /* ---------------- EXPORT TO EXCEL ---------------- */
  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visit Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "Visit_Report_Customerwise.xlsx"
    );
  };

  /* ---------------- EXPORT TO PDF ---------------- */
 const exportToPDF = () => {
  if (filteredData.length === 0) {
    alert("No data to export");
    return;
  }

  const doc = new jsPDF();

  doc.text("Visit Report - Customerwise", 14, 15);

  const tableColumn = [
    "Visit No",
    "Visit Date",
    "Customer",
    "Salesman",
    "Visit With",
    "Next Followup",
    "Project No"
  ];

  const tableRows = filteredData.map((row) => [
    row.visitNo,
    row.visitDate,
    row.customer,
    row.salesman,
    row.visitWith,
    row.nextFollowUp,
    row.projectNo
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20
  });

  doc.save("Visit_Report_Customerwise.pdf");
};

const handleClose = () => {
  setFilters({
    fromDate: "",
    toDate: "",
    customer: "",
    salesman: "",
    customerAll: false,
    salesmanAll: false
  });

  setFilteredData([]);
  setShowTable(false);
};


  return (
    <Box className="visit-report-container">
       <Paper className="visit-report-paper">

        <Typography variant="h6" className="visit-report-title">
          Visit Report - Customerwise
        </Typography>

        <FormRow label="From Date">
          <TextField
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </FormRow>

        <FormRow label="To Date">
          <TextField
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </FormRow>

        <FormRow
          label="Customer"
          right={
            <FormControlLabel
              control={
                <Checkbox
                  name="customerAll"
                  checked={filters.customerAll}
                  onChange={handleChange}
                />
              }
              label="All"
            />
          }
        >
          <TextField
            select
            name="customer"
            value={filters.customer}
            onChange={handleChange}
            fullWidth
            disabled={filters.customerAll}
          >
            {CUSTOMERS.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </FormRow>

        <FormRow
          label="Salesman"
          right={
            <FormControlLabel
              control={
                <Checkbox
                  name="salesmanAll"
                  checked={filters.salesmanAll}
                  onChange={handleChange}
                />
              }
              label="All"
            />
          }
        >
          <TextField
            select
            name="salesman"
            value={filters.salesman}
            onChange={handleChange}
            fullWidth
            disabled={filters.salesmanAll}
          >
            {SALESMEN.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </FormRow>

        {/* BUTTON BAR */}
       <Box className="button-bar">
          <Button variant="contained" onClick={handleShow}>
            Show
          </Button>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outlined" onClick={exportToPDF}>
            Export to PDF
          </Button>
          <Button variant="outlined" onClick={exportToExcel}>
            Export to Excel
          </Button>
        </Box>

        {/* TABLE */}
        {showTable && (
          <Box className="table-container">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Visit No</TableCell>
                  <TableCell>Visit Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Salesman</TableCell>
                  <TableCell>Visit With</TableCell>
                  <TableCell>Next Followup</TableCell>
                  <TableCell>Project No</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.visitNo}</TableCell>
                      <TableCell>{row.visitDate}</TableCell>
                      <TableCell>{row.customer}</TableCell>
                      <TableCell>{row.salesman}</TableCell>
                      <TableCell>{row.visitWith}</TableCell>
                      <TableCell>{row.nextFollowUp}</TableCell>
                      <TableCell>{row.projectNo}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
