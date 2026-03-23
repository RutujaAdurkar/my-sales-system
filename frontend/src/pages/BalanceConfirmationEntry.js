import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import "./BalanceConfirmationEntry.css";
import axios from "axios";

const SAMPLE_CUSTOMERS = [
  "Customer 1",
  "Customer 2",
  "Customer 3",
];

const FormRow = ({ label, children, fullWidth }) => (
  <Box className={`bce-form-row ${fullWidth ? "full-width" : ""}`}>
    <Typography className="bce-label">{label}</Typography>
    <Box className="bce-input-wrapper">{children}</Box>
  </Box>
);

const BalanceConfirmationEntry = () => {
  const [formData, setFormData] = useState({
    letterNo: "NEW",
    date: new Date().toISOString().split("T")[0],
    customer: "",
    balanceAsOn: "",
    subject: "",
    attn: "",
    designation: "",
    details: "",
  });

  const [customers, setCustomers] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // TODO: Fetch customers from API
    setCustomers(SAMPLE_CUSTOMERS);
  }, []);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.customer) {
      alert("Please select a customer");
      return;
    }
    if (!formData.balanceAsOn) {
      alert("Please enter Balance As On date");
      return;
    }

    try {
      // TODO: Replace with actual API endpoint
      console.log("Saving Balance Confirmation:", formData);
      alert("Balance Confirmation saved successfully!");
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving Balance Confirmation");
    }
  };

  const handleCancel = () => {
    setFormData({
      letterNo: "NEW",
      date: new Date().toISOString().split("T")[0],
      customer: "",
      balanceAsOn: "",
      subject: "",
      attn: "",
      designation: "",
      details: "",
    });
    setIsSaved(false);
    window.scrollTo(0, 0);
  };

  return (
    <Box className="bce-container">
      <Paper className="bce-paper" elevation={2}>
        <Typography className="bce-title">Balance Confirmation (New)</Typography>

        {/* ===== TOP ROW ===== */}
        <Box className="bce-top-section">
          <FormRow label="Letter No">
            <TextField
              size="small"
              value={formData.letterNo}
              disabled
              fullWidth
            />
          </FormRow>

          <FormRow label="Date">
            <TextField
              size="small"
              type="date"
              value={formData.date}
              onChange={handleChange("date")}
              fullWidth
            />
          </FormRow>
        </Box>

        {/* ===== MIDDLE SECTION ===== */}
        <Box className="bce-middle-section">
          <FormRow label="Customer" fullWidth>
            <TextField
              select
              size="small"
              value={formData.customer}
              onChange={handleChange("customer")}
              fullWidth
            >
              <MenuItem value="">Select Customer</MenuItem>
              {customers.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </FormRow>

          <FormRow label="Balance As On" fullWidth>
            <TextField
              size="small"
              type="date"
              value={formData.balanceAsOn}
              onChange={handleChange("balanceAsOn")}
              fullWidth
            />
          </FormRow>

          <FormRow label="Subject" fullWidth>
            <TextField
              size="small"
              multiline
              rows={2}
              value={formData.subject}
              onChange={handleChange("subject")}
              fullWidth
            />
          </FormRow>

          <FormRow label="Attn" fullWidth>
            <TextField
              size="small"
              multiline
              rows={2}
              value={formData.attn}
              onChange={handleChange("attn")}
              fullWidth
            />
          </FormRow>

          <FormRow label="Designation" fullWidth>
            <TextField
              size="small"
              multiline
              rows={2}
              value={formData.designation}
              onChange={handleChange("designation")}
              fullWidth
            />
          </FormRow>

          <FormRow label="Details" fullWidth>
            <TextField
              size="small"
              multiline
              rows={6}
              value={formData.details}
              onChange={handleChange("details")}
              fullWidth
              placeholder="Enter balance confirmation details..."
            />
          </FormRow>
        </Box>

        {/* ===== FOOTER ===== */}
        <Box className="bce-footer">
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

export default BalanceConfirmationEntry;
