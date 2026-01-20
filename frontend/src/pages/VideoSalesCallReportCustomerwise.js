import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
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


import "./VideoSalesCallReportCustomerwise.css";
/* ---------------- DUMMY DATA ---------------- */
const CUSTOMERS = [
  "2K TECHNOLOGIES - Sekhar",
  "3 MADHURA HANDLING",
  "3DCAD (I) PVT LTD",
  "A. V. TECHNOMATION"
];

const DATA = [
  {
    no: 8,
    date: "07-08-2020",
    customer: "3 MADHURA HANDLING",
    salesman: "Mohan Mane",
    videoWith: "Abhijit Dongre",
    nextDate: "07-08-2020",
    notes: "",
    contact: "Deepak",
    designation: "",
    email: "mark@...",
    mobile: "8553197146"
  },
  {
    no: 3,
    date: "10-07-2020",
    customer: "3DCAD (I) PVT LTD",
    salesman: "Mohan Mane",
    videoWith: "Abhijit Dongre",
    nextDate: "10-07-2020",
    notes: "",
    contact: "",
    designation: "",
    email: "",
    mobile: ""
  }
];

export default function VideoSalesCallReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [allCustomer, setAllCustomer] = useState(false);

  const [showTable, setShowTable] = useState(false);

  const isFromToValid = () => {
  return fromDate !== "" && toDate !== "";
};

 const handleClose = () => {
  setFromDate("");
  setToDate("");
  setCustomer("");
  setAllCustomer(false);
  setShowTable(false);  
};


const handleExportExcel = () => {
  if (!isFromToValid()) {
    alert("Please select From and To dates before exporting");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(DATA);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "VideoSalesCallReport");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const fileData = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  saveAs(fileData, "Video_Sales_Call_Report.xlsx");
};

 
const handleExportPDF = () => {
  if (!isFromToValid()) {
    alert("Please select From and To dates before exporting");
    return;
  }

  const doc = new jsPDF("landscape");
  doc.text("Video Sales Call Report - Customerwise", 14, 15);

  const tableColumn = [
    "Sales Call No",
    "Sales Call Date",
    "Customer",
    "Salesman",
    "Video Call With",
    "Next Followup Date",
    "Notes",
    "Contact Person",
    "Designation",
    "Email",
    "Mobile"
  ];

  const tableRows = DATA.map((row) => [
    row.no,
    row.date,
    row.customer,
    row.salesman,
    row.videoWith,
    row.nextDate,
    row.notes,
    row.contact,
    row.designation,
    row.email,
    row.mobile
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 22,
    styles: { fontSize: 8 }
  });

  doc.save("Video_Sales_Call_Report.pdf");
};

const isAnyFieldFilled = () => {
  return (
    fromDate !== "" ||
    toDate !== "" ||
    customer !== "" ||
    allCustomer === true
  );
};


const handleShow = () => {
  if (!isFromToValid()) {
    alert("Please select both From and To dates");
    setShowTable(false);
    return;
  }
  setShowTable(true);
};

  return (
    <Box className="page-container">
      <Paper className="report-paper">

        {/* ---------- HEADER ---------- */}
        <Typography className="report-title">
          Video Sales Call Report - Customerwise
        </Typography>

        {/* ===== FORM SECTION ===== */}
<Box className="form-section">

  {/* FROM */}
  <Box className="form-row-horizontal">
    <Box className="form-label-left">From</Box>
    <TextField
      type="date"
      size="small"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      className="form-field"
    />
  </Box>

  {/* TO */}
  <Box className="form-row-horizontal">
    <Box className="form-label-left">To</Box>
    <TextField
      type="date"
      size="small"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      className="form-field"
    />
  </Box>

  {/* CUSTOMER + ALL */}
  <Box className="form-row-horizontal">
    <Box className="form-label-left">Customer</Box>

    <Box className="customer-horizontal">
      <TextField
        select
        size="small"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        disabled={allCustomer}
        className="customer-select"
      >
        {CUSTOMERS.map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </TextField>

      <Box className="all-horizontal">
        <Checkbox
          checked={allCustomer}
          onChange={(e) => setAllCustomer(e.target.checked)}
        />
        <span>All</span>
      </Box>
    </Box>
  </Box>

  {/* BUTTONS */}
  <Box className="button-row">
   
<Button variant="contained" onClick={handleShow}>
  Show
</Button>


    <Button variant="outlined">Print</Button>

<Button
  variant="outlined"
  onClick={handleExportExcel}
  disabled={!isFromToValid()}
>
  Export To Excel
</Button>

<Button
  variant="outlined"
  onClick={handleExportExcel}
  disabled={!isAnyFieldFilled()}
>
  Export To Excel
</Button>
 
    <Button variant="outlined" color="error" onClick={handleClose}>Close</Button>
  </Box>

</Box>
        {/* ---------- TABLE ---------- */}
        {showTable && (
          <Box className="table-wrapper">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Sales Call No</TableCell>
                  <TableCell>Sales Call Date</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Salesman</TableCell>
                  <TableCell>Video Call with</TableCell>
                  <TableCell>Next Followup Date</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile Number</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {DATA.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{row.no}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.salesman}</TableCell>
                    <TableCell>{row.videoWith}</TableCell>
                    <TableCell>{row.nextDate}</TableCell>
                    <TableCell>{row.notes}</TableCell>
                    <TableCell>{row.contact}</TableCell>
                    <TableCell>{row.designation}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.mobile}</TableCell>
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
