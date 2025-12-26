import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem as MUIMenuItem
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';


const FormRow = ({ label, children, error }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
    <Box sx={{ width: 170, fontWeight: 600 }}>{label}</Box>
    <Box sx={{ flexGrow: 1 }}>
      {children}
      {error && <Box sx={{ color: 'error.main', mt: 0.5, fontSize: 12 }}>{error}</Box>}
    </Box>
  </Box>
);

const ApplicationReportEntry = ({ initialData = null, editingIdFromProps = null, onSaved = () => {}, onCancel = () => {} }) => {

  const [customers, setCustomers] = useState([]);
  const [attentionList, setAttentionList] = useState([]);

  const [formData, setFormData] = useState({
    reportNo: "",
    date: "",
    customer: "",
    quotationNo: "",
    duration: "",
    machineName: "",
    contactPerson: "",
    oemsInvolved: "",
    partNumber: "",
    quantity: "",
    application: "",
    ifmSolution: "",
    kindAttention: ""
  });

  const [errors, setErrors] = useState({});

  const [file, setFile] = useState(null);

  // table / form view state
  const [rows, setRows] = useState([]);
  const [view, setView] = useState('table'); // 'table' | 'form'
  const [editingId, setEditingId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const menuRowRef = useRef(null);

  // read-only view state for "View" action
  const [readOnly, setReadOnly] = useState(false);

  // helper to extract id from row regardless of casing
  const getRowId = (r) => {
    if (!r) return null;
    return r.Id ?? r.id ?? r.ID ?? null;
  }; 

  const handleChange = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value });

  // Allow only letters (no digits)
  const handleAlphaOnly = (field) => (e) => {
    const value = e.target.value.replace(/[^A-Za-z\s\-']/g, "");
    setFormData({ ...formData, [field]: value });
  };

  // Allow alphanumeric (letters, digits, spaces, hyphen)
  // const handleAlphaNumeric = (field) => (e) => {
  //   const value = e.target.value.replace(/[^A-Za-z0-9\s-]/g, "");
  //   setFormData({ ...formData, [field]: value });
  // };

  // Numeric only (integers)
  const handleNumericOnly = (field) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, [field]: value });
  };

  /* FETCH DROPDOWN DATA FROM API */
  useEffect(() => {
    loadDropdownData();
    fetchRows();
  }, []);

  const loadDropdownData = async () => {
    try {
      const custRes = await fetch("http://localhost:5000/api/appDropdowns/customers");
      const custData = await custRes.json();
      setCustomers(custData);

      const attRes = await fetch("http://localhost:5000/api/appDropdowns/attention");
      const attData = await attRes.json();
      setAttentionList(attData);
    } catch (err) {
      console.error("Dropdown fetch failed", err);
    }
  };

  // support being opened with initial data (from parent wrapper for edit)
  useEffect(() => {
    if (initialData) {
      setFormData({
        reportNo: initialData.ReportNo || '',
        date: initialData.Date || '',
        customer: initialData.Customer || '',
        quotationNo: initialData.QuotationNo || '',
        duration: initialData.Duration || '',
        machineName: initialData.MachineName || '',
        contactPerson: initialData.ContactPerson || '',
        oemsInvolved: initialData.OEMsInvolved || '',
        partNumber: initialData.PartNumber || '',
        quantity: initialData.Quantity || '',
        application: initialData.ApplicationText || '',
        ifmSolution: initialData.IFMSolution || '',
        kindAttention: initialData.KindAttention || ''
      });
      setFile(null);
      setEditingId(initialData.Id || null);
      setView('form');
    }
  }, [initialData]);

  useEffect(() => {
    // if parent provides an editing id, fetch that record and open form
    if (editingIdFromProps) {
      (async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/appReport/${editingIdFromProps}`);
          if (res.ok) {
            const r = await res.json();
            if (r) {
              setFormData({
                reportNo: r.ReportNo || '',
                date: r.Date || '',
                customer: r.Customer || '',
                quotationNo: r.QuotationNo || '',
                duration: r.Duration || '',
                machineName: r.MachineName || '',
                contactPerson: r.ContactPerson || '',
                oemsInvolved: r.OEMsInvolved || '',
                partNumber: r.PartNumber || '',
                quantity: r.Quantity || '',
                application: r.ApplicationText || '',
                ifmSolution: r.IFMSolution || '',
                kindAttention: r.KindAttention || ''
              });
              setEditingId(r.Id || editingIdFromProps);
              setView('form');
            }
          }
        } catch (err) {
          console.error('Failed to fetch record for editing', err);
        }
      })();
    }
  }, [editingIdFromProps]);

  const fetchRows = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/appReport');
      const data = await res.json();
      // normalize id property so downstream code can rely on `Id`
      const normalized = (data || []).map(r => ({ ...r, Id: r.Id ?? r.id ?? r.ID ?? r.ID }));
      setRows(normalized);
    } catch (err) {
      console.error('Failed to fetch rows', err);
      setRows([]);
    }
  }; 

  const openAddForm = () => {
    setFormData({
      reportNo: "",
      date: "",
      customer: "",
      quotationNo: "",
      duration: "",
      machineName: "",
      contactPerson: "",
      oemsInvolved: "",
      partNumber: "",
      quantity: "",
      application: "",
      ifmSolution: "",
      kindAttention: ""
    });
    setFile(null);
    setEditingId(null);
    setReadOnly(false);
    setView('form');
  };

  const openEditForm = (row) => {
    setFormData({
      reportNo: row.ReportNo || '',
      date: row.Date || '',
      customer: row.Customer || '',
      quotationNo: row.QuotationNo || '',
      duration: row.Duration || '',
      machineName: row.MachineName || '',
      contactPerson: row.ContactPerson || '',
      oemsInvolved: row.OEMsInvolved || '',
      partNumber: row.PartNumber || '',
      quantity: row.Quantity || '',
      application: row.ApplicationText || '',
      ifmSolution: row.IFMSolution || '',
      kindAttention: row.KindAttention || ''
    });
    setEditingId(getRowId(row));
    setReadOnly(false);
    setView('form');
  };

  const openViewForm = (row) => {
    setFormData({
      reportNo: row.ReportNo || '',
      date: row.Date || '',
      customer: row.Customer || '',
      quotationNo: row.QuotationNo || '',
      duration: row.Duration || '',
      machineName: row.MachineName || '',
      contactPerson: row.ContactPerson || '',
      oemsInvolved: row.OEMsInvolved || '',
      partNumber: row.PartNumber || '',
      quantity: row.Quantity || '',
      application: row.ApplicationText || '',
      ifmSolution: row.IFMSolution || '',
      kindAttention: row.KindAttention || ''
    });
    setEditingId(getRowId(row));
    setReadOnly(true);
    setView('form');
  }; 

  const handleMenuOpen = (e, row) => {
    const idAttr = e.currentTarget.getAttribute('data-row-id');
    console.log('Menu open for row:', row, 'idAttr:', idAttr);
    setAnchorEl(e.currentTarget);
    const selected = row || (idAttr ? rows.find(r => String(r.Id || r.id) === String(idAttr)) : null);
    if (!selected) console.warn('handleMenuOpen: could not resolve row from arguments; idAttr=', idAttr);
    setMenuRow(selected);
    menuRowRef.current = selected;
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
    menuRowRef.current = null;
  };

  const handleDelete = async (id) => {
    console.log('handleDelete id:', id);
    if (!id) { alert('Invalid record id'); return; }
    if (!window.confirm('Delete this record?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/appReport/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchRows();
      } else {
        const text = await res.text();
        console.error('Delete failed response:', res.status, text);
        alert('Delete failed');
      }
    } catch (err) {
      console.error('Delete error', err);
      alert('Delete failed');
    }
  };


  /* ------------------------------------------------
     SUBMIT FORM DATA TO BACKEND API
  ------------------------------------------------ */
  const validate = () => {
    const newErr = {};
    if (!formData.reportNo || String(formData.reportNo).trim() === "") newErr.reportNo = 'Report No is required.';
    if (!formData.date) newErr.date = 'Date is required.';
    if (!formData.customer) newErr.customer = 'Customer is required.';
    if (!formData.machineName || String(formData.machineName).trim() === "") newErr.machineName = 'Machine / Application name is required.';

    if (!formData.quantity && formData.quantity !== 0) newErr.quantity = 'Quantity is required.';
    else if (formData.quantity && !/^\d+$/.test(String(formData.quantity))) newErr.quantity = 'Enter a valid integer quantity.';

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) { alert('Please fix validation errors before saving.'); return; }

    try {
      // If editing an existing record, call PUT with JSON (no file upload here)
      if (editingId !== null && editingId !== undefined) {
        const idToUse = editingId;
        if (!idToUse && idToUse !== 0) { alert('Invalid record id for update'); return; }
        const res = await fetch(`http://localhost:5000/api/appReport/${idToUse}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          alert('✔ Updated successfully');
          setEditingId(null);
          setView('table');
          fetchRows();
          try { onSaved(); } catch (e) {}
          return;
        } else {
          const text = await res.text();
          console.error('Update failed:', res.status, text);
          alert('❌ Update failed');
          return;
        }
      }

      // CREATE (POST) flow — allow file upload
      const formDataToSend = new FormData();
      if (file) formDataToSend.append('diagram_file', file);
      Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));

      const res = await fetch('http://localhost:5000/api/appReport', {
        method: 'POST',
        body: formDataToSend
      });

      if (res.ok) {
        alert('✔ Report Saved Successfully');
        // reset and go back to list
        setFormData({
          reportNo: "",
          date: "",
          customer: "",
          quotationNo: "",
          duration: "",
          machineName: "",
          contactPerson: "",
          oemsInvolved: "",
          partNumber: "",
          quantity: "",
          application: "",
          ifmSolution: "",
          kindAttention: ""
        });
        setFile(null);
        setView('table');
        fetchRows();
        try { onSaved(); } catch (e) {}
      } else {
        const text = await res.text();
        console.error('Save failed:', res.status, text);
        alert('❌ Failed to save');
      }
    } catch (err) {
      console.error('Backend error:', err);
      alert('❌ Backend error occurred');
    }
  };


  return (
    <Box sx={{ width: '95%', mx: 'auto', mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box sx={{ fontSize: 20, fontWeight: 600 }}>Application Report Entry</Box>
        {view === 'table' ? (
          <Button variant="contained" onClick={openAddForm}>Add</Button>
        ) : (
          <Button variant="outlined" onClick={() => { setView('table'); setEditingId(null); setReadOnly(false); }}>Back to List</Button>
        )}
      </Box> 

      {view === 'table' ? (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Report No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Quotation No</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={row.Id || idx}>
                  <TableCell>{row.ReportNo}</TableCell>
                  <TableCell>{row.Date ? row.Date.toString().substr(0,10) : ''}</TableCell>
                  <TableCell>{row.Customer}</TableCell>
                  <TableCell>{row.QuotationNo}</TableCell>
                  <TableCell>{row.Quantity}</TableCell>
                  <TableCell>
                    <IconButton size="small" data-row-id={row.Id || row.id} onClick={(e) => handleMenuOpen(e, row)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MUIMenuItem onClick={() => { const rowToView = menuRowRef.current || menuRow; const id = getRowId(rowToView); handleMenuClose(); if (rowToView && id != null) openViewForm(rowToView); else alert('No record selected for view'); }}>View</MUIMenuItem>
            <MUIMenuItem onClick={() => { const rowToEdit = menuRowRef.current || menuRow; const id = getRowId(rowToEdit); console.log('Edit clicked, captured id:', id, 'row:', rowToEdit); handleMenuClose(); if (rowToEdit && id != null) openEditForm(rowToEdit); else alert('No record selected for edit'); }}>Edit</MUIMenuItem>
            <MUIMenuItem onClick={() => { const rowToDelete = menuRowRef.current || menuRow; const id = getRowId(rowToDelete); console.log('Delete clicked, captured id:', id, 'row:', rowToDelete); handleMenuClose(); if (id != null) handleDelete(id); else alert('No record selected for delete'); }}>Delete</MUIMenuItem>
          </Menu>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Grid container spacing={4}>

        {/* LEFT COLUMN */}
        <Grid item xs={12} sm={6}>

          <FormRow label="Application Report No:" error={errors.reportNo}>
            <TextField size="small" fullWidth
              value={formData.reportNo}
              onChange={handleNumericOnly("reportNo")}
              error={!!errors.reportNo}
              helperText={errors.reportNo || ""}
              inputProps={{ maxLength: 30 }}
              disabled={readOnly}
            />
          </FormRow>

          {/* CUSTOMER DROPDOWN */}
          <FormRow label="Customer:" error={errors.customer}>
            <TextField
              select
              size="small"
              fullWidth
              value={formData.customer}
              onChange={handleChange("customer")}
              error={!!errors.customer}
              helperText={errors.customer || ""}
              disabled={readOnly}
            >
              <MenuItem value="">Select Customer</MenuItem>
              {customers.map(c => (
                <MenuItem key={c.CustomerID} value={c.CustomerName}>
                  {c.CustomerName}
                </MenuItem>
              ))}
            </TextField>
          </FormRow>

          <FormRow label="Machine / Application Name:" error={errors.machineName}>
            <TextField size="small" fullWidth
              value={formData.machineName}
              onChange={handleAlphaOnly("machineName")}
              error={!!errors.machineName}
              helperText={errors.machineName || ""}
              disabled={readOnly}
            />
          </FormRow>

          {/* KIND ATTENTION DROPDOWN */}
          <FormRow label="Kind Attention:">
            <TextField
              select
              size="small"
              fullWidth
              value={formData.kindAttention}
              onChange={handleChange("kindAttention")}
              disabled={readOnly}
            >
              <MenuItem value="">Select Person</MenuItem>
              {attentionList.map(p => (
                <MenuItem key={p.PersonID} value={p.PersonName}>
                  {p.PersonName}
                </MenuItem>
              ))}
            </TextField>
          </FormRow>

          <FormRow label="OEMs Involved:">
            <TextField size="small" fullWidth multiline rows={2}
              value={formData.oemsInvolved}
              onChange={handleChange("oemsInvolved")}
              disabled={readOnly}
            />
          </FormRow>

          <FormRow label="Quantity:" error={errors.quantity}>
            <TextField size="small" fullWidth
              value={formData.quantity}
              onChange={handleNumericOnly("quantity")}
              error={!!errors.quantity}
              helperText={errors.quantity || ""}
              inputProps={{ inputMode: 'numeric', pattern: '\\d+' }}
              disabled={readOnly}
            />
          </FormRow>

          <FormRow label="Application:">
            <TextField size="small" fullWidth multiline rows={3}
              value={formData.application}
              onChange={handleChange("application")}
              disabled={readOnly}
            />
          </FormRow>
        </Grid>



        {/* RIGHT COLUMN */}
        <Grid item xs={12} sm={6}>

          <FormRow label="Date:">
            <TextField size="small" fullWidth type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange("date")}
              disabled={readOnly}
            />
          </FormRow>

          <FormRow label="Quotation No:">
            <TextField size="small" fullWidth
              value={formData.quotationNo}
              onChange={handleNumericOnly("quotationNo")}
              inputProps={{ maxLength: 30 }}
              disabled={readOnly}
            />
          </FormRow>

          <FormRow label="Duration:">
            <TextField size="small" fullWidth
              value={formData.duration}
              onChange={handleChange("duration")}
              disabled={readOnly}
            />
          </FormRow>

          {/* FILE UPLOAD */}
          <FormRow label="Diagram File:">
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button variant="outlined" component="label" sx={{ width: 130 }} disabled={readOnly}>
                Select File
                <input
                  type="file"
                  hidden
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Button>

              {file && <span>{file.name}</span>}

              {file && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => window.open(URL.createObjectURL(file))}
                  disabled={readOnly}
                >
                  View
                </Button>
              )}
            </Box>
          </FormRow>

          <FormRow label="Part Number:">
            <TextField size="small" fullWidth multiline rows={2}
              value={formData.partNumber}
              onChange={handleNumericOnly("partNumber")}
              inputProps={{ maxLength: 50 }}
              disabled={readOnly}
            />
          </FormRow>

          <FormRow label="IFM Solution:">
            <TextField size="small" fullWidth multiline rows={3}
              value={formData.ifmSolution}
              onChange={handleChange("ifmSolution")}
              disabled={readOnly}
            />
          </FormRow>

        </Grid>


        {/* BUTTON ROW */}
        <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
          {!readOnly && (
            <Button variant="contained" sx={{ mr: 2, width: 120 }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          )}
          <Button variant="outlined" color="error" sx={{ width: 120 }} onClick={() => { setView('table'); setEditingId(null); setReadOnly(false); }}>
            {readOnly ? 'Close' : 'Cancel'}
          </Button>
        </Grid>

      </Grid>
        </Paper>
      )}

    </Box>
  );
};

export default ApplicationReportEntry;