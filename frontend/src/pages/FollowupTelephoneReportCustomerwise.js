import React, { useState } from "react";
import {
  Paper,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer
} from "@mui/material";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


import "./FollowupTelephoneReportCustomerwise.css";

/* ================= MASTER DATA ================= */
const CUSTOMERS = [
  "CHITALE AGRO INDUSTRIES PVT. LTD.",
  "THENUK ENTERPRISES",
  "ISARO AUTOMATION SYSTEMS (PVT) LTD"
];

const SALESMEN = [
  "Shreyas Shinde",
  "Mohan Mane",
  "Harshal Kulkarni"
];

const DATA = [
  {
    followupNo: "62485",
    followupDate: "2019-04-01",
    customer: "CHITALE AGRO INDUSTRIES PVT. LTD.",
    salesman: "Shreyas Shinde",
    quotationNo: "0",
    nextDate: "2019-04-01",
    projectNo: ""
  },
  {
    followupNo: "62486",
    followupDate: "2019-04-02",
    customer: "THENUK ENTERPRISES",
    salesman: "Mohan Mane",
    quotationNo: "0",
    nextDate: "2019-04-02",
    projectNo: ""
  }
];

export default function FollowupTelephoneReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [salesman, setSalesman] = useState("");
  const [allCustomer, setAllCustomer] = useState(true);
  const [allSalesman, setAllSalesman] = useState(true);

  const [rows, setRows] = useState([]);
  const [showTable, setShowTable] = useState(false);

  /* ================= SHOW ================= */
  const handleShow = () => {
    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    const filtered = DATA.filter(r => {
      const dateOk = r.followupDate >= fromDate && r.followupDate <= toDate;
      const custOk = allCustomer || r.customer === customer;
      const salesOk = allSalesman || r.salesman === salesman;
      return dateOk && custOk && salesOk;
    });

    setRows(filtered);
    setShowTable(true);
  };

  /* ================= CLOSE ================= */
  const handleClose = () => {
    setFromDate("");
    setToDate("");
    setCustomer("");
    setSalesman("");
    setAllCustomer(true);
    setAllSalesman(true);
    setRows([]);
    setShowTable(false);
  };

  /* ================= EXPORT ================= */
  const exportPDF = () => {
    const doc = new jsPDF("l");
    doc.text("Followup / Telephone Report - Customerwise", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [[
        "Followup No",
        "Followup Date",
        "Customer",
        "Salesman",
        "Quotation No",
        "Next Followup Date",
        "Project Number"
      ]],
      body: rows.map(r => [
        r.followupNo,
        r.followupDate,
        r.customer,
        r.salesman,
        r.quotationNo,
        r.nextDate,
        r.projectNo
      ])
    });

    doc.save("Followup_Report.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "Followup_Report.xlsx");
  };

  return (
    <Paper className="followup-container">
      {/* ================= FORM ================= */}
      <div className="form-row">
        <div className="form-label">From Date</div>
        <TextField type="date" size="small" value={fromDate}
          onChange={e => setFromDate(e.target.value)} />
      </div>

      <div className="form-row">
        <div className="form-label">To Date</div>
        <TextField type="date" size="small" value={toDate}
          onChange={e => setToDate(e.target.value)} />
      </div>

      <div className="form-row">
        <div className="form-label">Customer</div>
        <div className="form-field">
          <TextField
            select
            size="small"
            disabled={allCustomer}
            value={customer}
            onChange={e => setCustomer(e.target.value)}
            sx={{ width: 340 }}
          >
            {CUSTOMERS.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
          <Checkbox
            checked={allCustomer}
            onChange={e => setAllCustomer(e.target.checked)}
          />
          <Typography>ALL</Typography>
        </div>
      </div>

      <div className="form-row">
        <div className="form-label">Salesman</div>
        <div className="form-field">
          <TextField
            select
            size="small"
            disabled={allSalesman}
            value={salesman}
            onChange={e => setSalesman(e.target.value)}
            sx={{ width: 340 }}
          >
            {SALESMEN.map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
          <Checkbox
            checked={allSalesman}
            onChange={e => setAllSalesman(e.target.checked)}
          />
          <Typography>ALL</Typography>
        </div>
      </div>

      {/* ================= BUTTONS ================= */}
      <div className="button-bar">
        <Button variant="contained" onClick={handleShow}>Show</Button>
        <Button variant="outlined" onClick={exportPDF}>Export PDF</Button>
        <Button variant="outlined" onClick={exportExcel}>Export Excel</Button>
        <Button variant="outlined" color="error" onClick={handleClose}>Close</Button>
      </div>

      {/* ================= TABLE ================= */}
      {showTable ? (
        <TableContainer className="table-container">
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Followup No</TableCell>
                <TableCell>Followup Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Salesman</TableCell>
                <TableCell>Quotation No</TableCell>
                <TableCell>Next Followup Date</TableCell>
                <TableCell>Project Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.followupNo}</TableCell>
                  <TableCell>{r.followupDate}</TableCell>
                  <TableCell>{r.customer}</TableCell>
                  <TableCell>{r.salesman}</TableCell>
                  <TableCell>{r.quotationNo}</TableCell>
                  <TableCell>{r.nextDate}</TableCell>
                  <TableCell>{r.projectNo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="empty-text">
          No data loaded. Fill filters and click Show.
        </div>
      )}
    </Paper>
  );
}
