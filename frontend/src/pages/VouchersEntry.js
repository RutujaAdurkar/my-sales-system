import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import "./VouchersEntry.css";

const ACCOUNTS = [
  "Cash Account",
  "Bank Account",
  "Sales Account",
  "Purchase Account",
  "Expense Account",
];

const DR_CR_OPTIONS = ["Dr", "Cr"];

const FormRow = ({ label, children, fullWidth }) => (
  <Box className={`ve-form-row ${fullWidth ? "full-width" : ""}`}>
    <Typography className="ve-label">{label}</Typography>
    <Box className="ve-input-wrapper">{children}</Box>
  </Box>
);

const VouchersEntry = () => {
  const [voucherNo, setVoucherNo] = useState("NEW");
  const [voucherDate, setVoucherDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [srNo, setSrNo] = useState("");
  const [drCr, setDrCr] = useState("Dr");
  const [account, setAccount] = useState("Cash Account");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");

  const [voucherEntries, setVoucherEntries] = useState([]);
  const [bottomNarration, setBottomNarration] = useState("");

  const handleAddEntry = () => {
    if (!account || !amount) {
      alert("Please fill Account and Amount");
      return;
    }

    const newEntry = {
      id: Date.now(),
      srNo: voucherEntries.length + 1,
      accountName: account,
      debit: drCr === "Dr" ? parseFloat(amount) : 0,
      credit: drCr === "Cr" ? parseFloat(amount) : 0,
    };

    setVoucherEntries([...voucherEntries, newEntry]);

    // Reset entry fields
    setDrCr("Dr");
    setAccount("Cash Account");
    setAmount("");
  };

  const handleDeleteEntry = (id) => {
    setVoucherEntries(voucherEntries.filter((entry) => entry.id !== id));
  };

  const totalDebit = voucherEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = voucherEntries.reduce((sum, e) => sum + e.credit, 0);

  const handleSave = () => {
    if (voucherEntries.length === 0) {
      alert("Please add at least one entry");
      return;
    }

    console.log("Saving Voucher:", {
      voucherNo,
      voucherDate,
      entries: voucherEntries,
      narration: bottomNarration,
      totalDebit,
      totalCredit,
    });

    alert("Voucher saved successfully!");
  };

  const handleCancel = () => {
    setVoucherNo("NEW");
    setVoucherDate(new Date().toISOString().split("T")[0]);
    setSrNo("");
    setDrCr("Dr");
    setAccount("Cash Account");
    setAmount("");
    setNarration("");
    setVoucherEntries([]);
    setBottomNarration("");
  };

  return (
    <Box className="ve-container">
      <Paper className="ve-paper" elevation={2}>
        <Typography className="ve-title">Voucher Entry</Typography>

        {/* ===== TOP SECTION ===== */}
        <Box className="ve-top-section">
          <FormRow label="Voucher No">
            <TextField size="small" value={voucherNo} disabled fullWidth />
          </FormRow>

          <FormRow label="Voucher Date">
            <TextField
              size="small"
              type="date"
              value={voucherDate}
              onChange={(e) => setVoucherDate(e.target.value)}
              fullWidth
            />
          </FormRow>
        </Box>

        {/* ===== ENTRY SECTION ===== */}
        <Box className="ve-entry-section">
          <Typography className="ve-section-title">Entry Details</Typography>

          <Box className="ve-entry-grid">
            <FormRow label="Sr. No">
              <TextField
                size="small"
                value={srNo}
                onChange={(e) => setSrNo(e.target.value)}
                fullWidth
              />
            </FormRow>

            <FormRow label="Dr / Cr">
              <TextField
                select
                size="small"
                value={drCr}
                onChange={(e) => setDrCr(e.target.value)}
                fullWidth
              >
                {DR_CR_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </FormRow>

            <FormRow label="Account">
              <TextField
                select
                size="small"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                fullWidth
              >
                {ACCOUNTS.map((acc) => (
                  <MenuItem key={acc} value={acc}>
                    {acc}
                  </MenuItem>
                ))}
              </TextField>
            </FormRow>

            <FormRow label="Amount">
              <TextField
                size="small"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
              />
            </FormRow>
          </Box>

          <Box className="ve-narration-row">
            <FormRow label="Narration" fullWidth>
              <TextField
                size="small"
                multiline
                rows={2}
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                fullWidth
              />
            </FormRow>
          </Box>

          <Box className="ve-add-btn">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddEntry}
              size="small"
            >
              Add Entry
            </Button>
          </Box>
        </Box>

        {/* ===== TABLE SECTION ===== */}
        <Box className="ve-table-section">
          <Table className="ve-table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>S/No</TableCell>
                <TableCell>Account Name</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {voucherEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.srNo}</TableCell>
                  <TableCell>{entry.accountName}</TableCell>
                  <TableCell align="right">{entry.debit.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    {entry.credit.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="ve-total-row">
                <TableCell colSpan="2" align="right">
                  <strong>Total:</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{totalDebit.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{totalCredit.toFixed(2)}</strong>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* ===== BOTTOM NARRATION ===== */}
        <Box className="ve-bottom-narration">
          <FormRow label="Narration" fullWidth>
            <TextField
              size="small"
              multiline
              rows={3}
              value={bottomNarration}
              onChange={(e) => setBottomNarration(e.target.value)}
              fullWidth
            />
          </FormRow>
        </Box>

        {/* ===== FOOTER ===== */}
        <Box className="ve-footer">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            size="small"
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCancel}
            size="small"
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default VouchersEntry;
