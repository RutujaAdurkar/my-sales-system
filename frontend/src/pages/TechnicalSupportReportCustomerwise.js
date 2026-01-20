import React, { useState } from "react";
import "./TechnicalSupportReportCustomerwise.css";
import {
  Box,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
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


/* ---------------- DUMMY DROPDOWNS ---------------- */
const CUSTOMERS = [
  "RK TECHNOLOGIES",
  "COMSTAR AUTOMOTIVE",
  "FM SAMPLE A/C DELHI"
];

/* ---------------- TABLE DATA ---------------- */
const DATA = [
  {
    no: 170,
    date: "2019-04-01",
    customer: "COMSTAR AUTOMOTIVE",
    salesman: "Vinayak Surve",
    visitWith: "",
    followup: "2019-04-02",
    project: "",
    notes: "Call from Mr. Sel"
  },
  {
    no: 171,
    date: "2019-04-02",
    customer: "FM SAMPLE A/C DELHI",
    salesman: "Sham Gupta",
    visitWith: "",
    followup: "2019-04-02",
    project: "",
    notes: "Call from Mr. Sha"
  }
];

export default function TechnicalSupportReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [allCustomer, setAllCustomer] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
 

  const isFilterSelected = () => {
  return fromDate || toDate || customer || allCustomer;
};

  /* ================= EXCEL EXPORT ================= */
  // const exportExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(DATA);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Tech Support Report");

  //   const excelBuffer = XLSX.write(wb, {
  //     bookType: "xlsx",
  //     type: "array"
  //   });

  //   const file = new Blob([excelBuffer], {
  //     type:
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //   });

  //   saveAs(file, "TechnicalSupportReport.xlsx");
  // };

  const exportExcel = () => {
  if (!isFilterSelected()) {
    setErrorMsg("Please select at least one filter before exporting.");
    return;
  }

  setErrorMsg("");

  const ws = XLSX.utils.json_to_sheet(DATA);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tech Support Report");

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array"
  });

  saveAs(
    new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }),
    "TechnicalSupportReport.xlsx"
  );
};

  /* ================= PDF EXPORT ================= */
  // const exportPDF = () => {
  //   const doc = new jsPDF();

  //   doc.text("Technical Support Report", 14, 15);

  //   autoTable(doc, {
  //     startY: 20,
  //     head: [[
  //       "Tech No",
  //       "Date",
  //       "Customer",
  //       "Salesman",
  //       "Visit With",
  //       "Follow-up",
  //       "Project",
  //       "Notes"
  //     ]],
  //     body: DATA.map(row => [
  //       row.no,
  //       row.date,
  //       row.customer,
  //       row.salesman,
  //       row.visitWith,
  //       row.followup,
  //       row.project,
  //       row.notes
  //     ])
  //   });

  //   doc.save("TechnicalSupportReport.pdf");
  // };

  const exportPDF = () => {
  if (!isFilterSelected()) {
    setErrorMsg("Please select at least one filter before exporting.");
    return;
  }

  setErrorMsg("");

  const doc = new jsPDF();
  doc.text("Technical Support Report", 14, 15);

  autoTable(doc, {
    startY: 20,
    head: [[
      "Tech No",
      "Date",
      "Customer",
      "Salesman",
      "Visit With",
      "Follow-up",
      "Project",
      "Notes"
    ]],
    body: DATA.map(row => [
      row.no,
      row.date,
      row.customer,
      row.salesman,
      row.visitWith,
      row.followup,
      row.project,
      row.notes
    ])
  });

  doc.save("TechnicalSupportReport.pdf");
};


  const handleShow = () => {
  if (!isFilterSelected()) {
    setErrorMsg("Please select at least one filter before proceeding.");
    setShowTable(false);
    return;
  }

  setErrorMsg("");
  setShowTable(true);
};


  return (
    <Box className="tsr-page">
      <Paper className="report-paper">

        {/* ===== DATE ROW ===== */}
        <Box className="form-row">
          <label>From</label>
          <TextField type="date" size="small" value={fromDate}
            onChange={(e) => setFromDate(e.target.value)} />

          <label>To</label>
          <TextField type="date" size="small" value={toDate}
            onChange={(e) => setToDate(e.target.value)} />
        </Box>

        {/* ===== CUSTOMER ROW ===== */}
        <Box className="form-row">
          <label>Customer</label>
          <TextField
            select
            size="small"
            disabled={allCustomer}
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          >
            {CUSTOMERS.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                checked={allCustomer}
                onChange={(e) => setAllCustomer(e.target.checked)}
              />
            }
            label="ALL"
          />
        </Box>

        {/* ===== SHOW / PRINT / CLOSE ===== */}
        <Box className="action-row">
          <Button variant="contained" onClick={handleShow}>
            Show
          </Button>


          <Button variant="outlined" onClick={() => window.print()}>
            Print
          </Button>

          <Button variant="outlined" color="error" onClick={() => setShowTable(false)}>
            Close
          </Button>
        </Box>

        {/* ===== EXPORT BUTTONS (BELOW) ===== */}
        <Box className="export-row">
          <Button variant="outlined" onClick={exportPDF}>
            Export To PDF
          </Button>

          <Button variant="outlined" onClick={exportExcel}>
            Export To Excel
          </Button>
        </Box>

        {/* ===== VALIDATION ERROR MESSAGE ===== */}
{errorMsg && (
  <Box className="error-msg">
    {errorMsg}
  </Box>
)}



        {/* ===== TABLE ===== */}
        {showTable && (
          <Box className="table-wrapper">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tech Support No</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Salesman</TableCell>
                  <TableCell>Visit With</TableCell>
                  <TableCell>Follow-up</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {DATA.map(row => (
                  <TableRow key={row.no}>
                    <TableCell>{row.no}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.salesman}</TableCell>
                    <TableCell>{row.visitWith}</TableCell>
                    <TableCell>{row.followup}</TableCell>
                    <TableCell>{row.project}</TableCell>
                    <TableCell>{row.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

      </Paper>
    </Box>
  );
}
