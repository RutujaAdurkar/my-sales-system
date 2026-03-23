import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const salesmanOptions = ["Karthikeyan", "Rahul", "Meena", "Sanjay"];
const industryOptions = ["Automotive", "Pharma", "Electronics", "Textiles"];

const CreateExcelEmail = () => {
  const [salesman, setSalesman] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [allSalesman, setAllSalesman] = useState(false);
  const [allIndustry, setAllIndustry] = useState(false);

  const selectedSalesman = useMemo(() => {
    if (allSalesman) return "ALL";
    return salesman || "(not selected)";
  }, [allSalesman, salesman]);

  const selectedIndustry = useMemo(() => {
    if (allIndustry) return "ALL";
    return industryType || "(not selected)";
  }, [allIndustry, industryType]);

  const handleCreateExcel = () => {
    const data = [
      {
        Salesman: selectedSalesman,
        IndustryType: selectedIndustry,
        "Created At": new Date().toLocaleString(),
      },
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Emails");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "excel_for_emails.xlsx");
  };

  return (
    <Box sx={{ maxWidth: 850, margin: "0 auto" }}>
      <Paper sx={{ p: 3 }} elevation={2}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Create Excel File for Emails
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="salesman-label">Salesman</InputLabel>
              <Select
                labelId="salesman-label"
                value={salesman}
                label="Salesman"
                onChange={(e) => setSalesman(e.target.value)}
                disabled={allSalesman}
              >
                {salesmanOptions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allSalesman}
                  onChange={(e) => setAllSalesman(e.target.checked)}
                />
              }
              label="ALL"
              sx={{ mt: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="industry-label">Industry Type</InputLabel>
              <Select
                labelId="industry-label"
                value={industryType}
                label="Industry Type"
                onChange={(e) => setIndustryType(e.target.value)}
                disabled={allIndustry}
              >
                {industryOptions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allIndustry}
                  onChange={(e) => setAllIndustry(e.target.checked)}
                />
              }
              label="ALL"
              sx={{ mt: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Selected: Salesman: {selectedSalesman} | Industry: {selectedIndustry}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCreateExcel} sx={{ mr: 2 }}>
              Create Excel File
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => {
              setSalesman("");
              setIndustryType("");
              setAllSalesman(false);
              setAllIndustry(false);
            }}>
              Close
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CreateExcelEmail;
