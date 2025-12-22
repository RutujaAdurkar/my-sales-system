// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Grid,
//   TextField,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   IconButton,
//   Menu,
//   MenuItem as MUIMenuItem,
//   Paper,
// } from "@mui/material";
// import MoreVertIcon from '@mui/icons-material/MoreVert';

// const labelStyle = {
//   width: 200,
//   paddingRight: 10,
//   textAlign: "left",
//   fontWeight: 700,
// };

// const initialForm = {
//   projectNo: "",
//   projectDate: "",
//   customerName: "",
//   projectName: "",
//   createdBy: "",
//   followBy1: "",
//   followBy2: "",
//   notes: "",
//   followUpDate: "",
//   noFollowUpRequired: false,
// };

// const PaymentFollowUpForm = () => {
//   const [formData, setFormData] = useState(initialForm);
//   const [customers, setCustomers] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [followTeam1Members, setFollowTeam1Members] = useState([]);
//   const [followTeam2Members, setFollowTeam2Members] = useState([]);

//   // list / view state
//   const [rows, setRows] = useState([]);
//   const [view, setView] = useState('table'); // 'table' | 'form'
//   const [, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   // menu state for 3-dot actions
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuRow, setMenuRow] = useState(null);

//   useEffect(() => {
//     fetchLists();
//     fetchRows();
//   }, []);

//   const fetchLists = () => {
//     axios.get("http://localhost:5000/api/dropdown/customers")
//       .then((res) => setCustomers(res.data))
//       .catch((err) => console.log(err));

//     axios.get("http://localhost:5000/api/dropdown/employees")
//       .then((res) => {
//         setEmployees(res.data);
//         // Follow up lists should use the same Employees table
//         setFollowTeam1Members(res.data);
//         setFollowTeam2Members(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//         setFollowTeam1Members([]);
//         setFollowTeam2Members([]);
//       });

//     // FollowTeam1 now uses Employees table; no separate fetch needed.

//     // FollowTeam2 now uses Employees table; no separate fetch needed.
//   }; 

//   const fetchRows = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('http://localhost:5000/api/payment/list');
//       setRows(res.data || []);
//     } catch (err) {
//       console.error(err);
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field) => (event) => {
//     const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
//     setFormData({ ...formData, [field]: value });
//   };

//   const openAddForm = () => {
//     setFormData(initialForm);
//     setEditingId(null);
//     setView('form');
//   };

//   const openEditForm = (row) => {
//     // map database fields to form and try to match dropdown values
//     // customer: stored value might be CustomerID or CustomerName, prefer ID for Select
//     let customerVal = row.CustomerName || '';
//     if (customers && customers.length && customerVal) {
//       const byId = customers.find(c => String(c.CustomerID) === String(customerVal));
//       if (byId) customerVal = byId.CustomerID;
//       else {
//         const byName = customers.find(c => String(c.CustomerName) === String(customerVal));
//         if (byName) customerVal = byName.CustomerID;
//       }
//     }

//     const mapListValue = (list, value) => {
//       if (!value) return '';
//       const byName = list.find(e => String(e.EmployeeName) === String(value));
//       if (byName) return byName.EmployeeName;
//       const byId = list.find(e => String(e.Id) === String(value));
//       if (byId) return byId.EmployeeName;
//       return value; // fallback
//     };

//     setFormData({
//       projectNo: row.ProjectNo || '',
//       projectDate: row.ProjectDate ? String(row.ProjectDate).substr(0,10) : '',
//       customerName: customerVal || '',
//       projectName: row.ProjectName || '',
//       createdBy: mapListValue(employees, row.CreatedBy),
//       followBy1: mapListValue(employees, row.FollowBy1),
//       followBy2: mapListValue(employees, row.FollowBy2),
//       notes: row.Notes || '',
//       followUpDate: row.FollowUpDate ? String(row.FollowUpDate).substr(0,10) : '',
//       noFollowUpRequired: !!row.NoFollowUpRequired,
//     });
//     setEditingId(row.Id || row.id || null);
//     setView('form');
//   };

//   const handleSubmit = async () => {
//     try {
//       if (editingId) {
//         await axios.put(`http://localhost:5000/api/payment/${editingId}`, formData);
//         alert('Updated successfully');
//       } else {
//         await axios.post('http://localhost:5000/api/payment/save', formData);
//         alert('Saved successfully');
//       }
//       setView('table');
//       setEditingId(null);
//       fetchRows();
//     } catch (err) {
//       console.error('handleSubmit error:', err);
//       const details = {
//         status: err?.response?.status,
//         data: err?.response?.data,
//         message: err?.message,
//         toJSON: err?.toJSON && err.toJSON(),
//       };
//       console.error('Server error details:', details);
//       alert(`Save failed:\n${JSON.stringify(details, null, 2)}`);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this record?')) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/payment/${id}`);
//       fetchRows();
//     } catch (err) {
//       console.error(err);
//       alert('Error deleting');
//     }
//   };

//   const handleMenuOpen = (e, row) => {
//     setAnchorEl(e.currentTarget);
//     setMenuRow(row);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setMenuRow(null);
//   };

//   return (
//     <Box sx={{ p: 4 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography fontSize={22} fontWeight="bold">Project Follow-Up Entry</Typography>
//         {view === 'table' && (
//           <Button variant="contained" onClick={openAddForm}>Add</Button>
//         )}
//       </Box>

//       {view === 'table' ? (
//         <Paper sx={{ p: 2 }}>
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Project No</TableCell>
//                 <TableCell>Project Date</TableCell>
//                 <TableCell>Customer</TableCell>
//                 <TableCell>Project Name</TableCell>
//                 <TableCell>Created By</TableCell>
//                 <TableCell>Follow By (1)</TableCell>
//                 <TableCell>Follow By (2)</TableCell>
//                 <TableCell>Follow-up Date</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rows.map((row, idx) => (
//                 <TableRow key={row.Id || row.id || idx}>
//                   <TableCell>{row.ProjectNo}</TableCell>
//                   <TableCell>{row.ProjectDate ? row.ProjectDate.toString().substr(0,10) : ''}</TableCell>
//                   <TableCell>{
//                     // If CustomerID was stored, try to map to customer name
//                     customers.find(c => String(c.CustomerID) === String(row.CustomerName))?.CustomerName || row.CustomerName
//                   }</TableCell>
//                   <TableCell>{row.ProjectName}</TableCell>
//                   <TableCell>{row.CreatedBy}</TableCell>
//                   <TableCell>{
//                     (employees.find(e => String(e.EmployeeName) === String(row.FollowBy1))?.EmployeeName) ||
//                     (employees.find(e => String(e.Id) === String(row.FollowBy1))?.EmployeeName) ||
//                     row.FollowBy1 || ''
//                   }</TableCell>
//                   <TableCell>{
//                     (employees.find(e => String(e.EmployeeName) === String(row.FollowBy2))?.EmployeeName) ||
//                     (employees.find(e => String(e.Id) === String(row.FollowBy2))?.EmployeeName) ||
//                     row.FollowBy2 || ''
//                   }</TableCell>
//                   <TableCell>{row.FollowUpDate ? row.FollowUpDate.toString().substr(0,10) : ''}</TableCell>
//                   <TableCell>
//                     <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
//                       <MoreVertIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//             <MUIMenuItem onClick={() => { handleMenuClose(); openEditForm(menuRow); }}>Edit</MUIMenuItem>
//             <MUIMenuItem onClick={() => { handleMenuClose(); handleDelete(menuRow?.Id || menuRow?.id); }}>Delete</MUIMenuItem>
//           </Menu>
//         </Paper>
//       ) : (
//         // Form view
//         <Grid container spacing={3} alignItems="center">
//           {/* LEFT COLUMN */}
//           <Grid item xs={12} sm={7}>
//             <Box display="flex" alignItems="center" mb={2}>
//               <label style={labelStyle}>Project No :</label>
//               <TextField size="small" fullWidth value={formData.projectNo} onChange={handleChange('projectNo')} />
//             </Box>

//             <Box display="flex" alignItems="center" mb={2}>
//               <label style={labelStyle}>Project Date :</label>
//               <TextField type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={formData.projectDate} onChange={handleChange('projectDate')} />
//             </Box>

//             <Box display="flex" alignItems="center" mb={2}>
//               <label style={labelStyle}>Customer Name :</label>
//               <Select fullWidth size="small" displayEmpty value={formData.customerName} onChange={handleChange('customerName')}>
//                 <MenuItem value="">Select Customer</MenuItem>
//                 {customers.map((row) => (
//                   <MenuItem key={row.CustomerID} value={row.CustomerID}>{row.CustomerName}</MenuItem>
//                 ))}
//               </Select>
//             </Box>

//             <Box display="flex" alignItems="center" mb={2}>
//               <label style={labelStyle}>Project Name :</label>
//               <TextField size="small" fullWidth value={formData.projectName} onChange={handleChange('projectName')} />
//             </Box>
//           </Grid>

//           {/* RIGHT COLUMN */}
//           <Grid item xs={12} sm={5}>
//             <Box display="flex" alignItems="center" mb={2}>
//               <label style={labelStyle}>Project Created By :</label>
//               <Select fullWidth size="small" displayEmpty value={formData.createdBy} onChange={handleChange('createdBy')}>
//                 <MenuItem value="">Select Employee</MenuItem>
//                 {employees.map((e) => (<MenuItem key={e.Id} value={e.EmployeeName}>{e.EmployeeName}</MenuItem>))}
//               </Select>
//             </Box>

//             <Box display="flex" alignItems="center" mb={2}>
//               <label style={labelStyle}>Follow up By (1) :</label>
//               <Select fullWidth size="small" displayEmpty value={formData.followBy1} onChange={handleChange('followBy1')}>
//                 <MenuItem value="">Select</MenuItem>
//                 {followTeam1Members.map((e) => (<MenuItem key={e.Id} value={e.EmployeeName}>{e.EmployeeName}</MenuItem>))}
//               </Select>
//             </Box>

//             <Box display="flex" alignItems="center" mb={2}>
//               <label style={labelStyle}>Follow up By (2) :</label>
//               <Select fullWidth size="small" displayEmpty value={formData.followBy2} onChange={handleChange('followBy2')}>
//                 <MenuItem value="">Select</MenuItem>
//                 {followTeam2Members.map((e) => (<MenuItem key={e.Id} value={e.EmployeeName}>{e.EmployeeName}</MenuItem>))}
//               </Select>
//             </Box>
//           </Grid>

//           {/* NOTES */}
//           <Grid item xs={12}>
//             <Box display="flex" alignItems="flex-start" mb={2}>
//               <label style={{ ...labelStyle, paddingTop: 8 }}>Notes :</label>
//               <TextField fullWidth multiline rows={10} size="small" sx={{ minHeight: 220 }} value={formData.notes} onChange={handleChange('notes')} />
//             </Box>
//           </Grid>

//           {/* FOLLOW-UP */}
//           <Grid item xs={12}>
//             <Box display="flex" alignItems="center">
//               <div style={{ width: 200 }} />

//               <label style={{ width: 170, textAlign: "right", paddingRight: 10 }}>Follow-up Date :</label>

//               <TextField type="date" size="small" InputLabelProps={{ shrink: true }} value={formData.followUpDate} onChange={handleChange('followUpDate')} />

//               <FormControlLabel sx={{ ml: 3 }} control={<Checkbox checked={formData.noFollowUpRequired} onChange={(e) => setFormData({ ...formData, noFollowUpRequired: e.target.checked })} />} label="No Follow-up Required" />
//             </Box>
//           </Grid>

//           {/* BUTTONS */}
//           <Grid item xs={12}>
//             <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmit}>SAVE</Button>
//             <Button variant="outlined" color="error" onClick={() => { setView('table'); setEditingId(null); }}>CANCEL</Button>
//           </Grid>

//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default PaymentFollowUpForm;



import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem as MUIMenuItem,
  Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const labelStyle = {
  fontWeight: 600,
  marginBottom: 5,
  display: "block",
};

const initialForm = {
  projectNo: "",
  projectDate: "",
  customerName: "",
  projectName: "",
  createdBy: "",
  followBy1: "",
  followBy2: "",
  notes: "",
  followUpDate: "",
  noFollowUpRequired: false,
};

const PaymentFollowUpForm = () => {
  const [formData, setFormData] = useState(initialForm);

  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [rows, setRows] = useState([]);
  const [view, setView] = useState("table");
  const [editingId, setEditingId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);

  useEffect(() => {
    fetchLists();
    fetchRows();
  }, []);

  const fetchLists = () => {
    axios.get("http://localhost:5000/api/dropdown/customers")
      .then((res) => setCustomers(res.data));

    axios.get("http://localhost:5000/api/dropdown/employees")
      .then((res) => setEmployees(res.data));
  };

  const fetchRows = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payment/list");
      setRows(res.data || []);
    } catch {
      setRows([]);
    }
  };

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const openAddForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setView("form");
  };

  const openEditForm = (row) => {
    setFormData({
      projectNo: row.ProjectNo,
      projectDate: row.ProjectDate?.substr(0, 10),
      customerName: row.CustomerName,
      projectName: row.ProjectName,
      createdBy: row.CreatedBy,
      followBy1: row.FollowBy1,
      followBy2: row.FollowBy2,
      notes: row.Notes,
      followUpDate: row.FollowUpDate?.substr(0, 10),
      noFollowUpRequired: row.NoFollowUpRequired,
    });

    setEditingId(row.Id);
    setView("form");
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/payment/${editingId}`,
          formData
        );
        alert("Updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/payment/save", formData);
        alert("Saved successfully");
      }

      setView("table");
      fetchRows();
    } catch {
      alert("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await axios.delete(`http://localhost:5000/api/payment/${id}`);
    fetchRows();
  };

  const handleMenuOpen = (e, row) => {
    setAnchorEl(e.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize={22} fontWeight="bold">
          Project Follow-Up Entry
        </Typography>

        {view === "table" && (
          <Button variant="contained" onClick={openAddForm}>
            Add
          </Button>
        )}
      </Box>

      {/* TABLE VIEW */}
      {view === "table" ? (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project No</TableCell>
                <TableCell>Project Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Follow By 1</TableCell>
                <TableCell>Follow By 2</TableCell>
                <TableCell>Follow-Up Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.Id}>
                  <TableCell>{row.ProjectNo}</TableCell>
                  <TableCell>{row.ProjectDate?.substr(0, 10)}</TableCell>
                  <TableCell>{row.CustomerName}</TableCell>
                  <TableCell>{row.ProjectName}</TableCell>
                  <TableCell>{row.CreatedBy}</TableCell>
                  <TableCell>{row.FollowBy1}</TableCell>
                  <TableCell>{row.FollowBy2}</TableCell>
                  <TableCell>{row.FollowUpDate?.substr(0, 10)}</TableCell>

                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MUIMenuItem onClick={() => { handleMenuClose(); openEditForm(menuRow); }}>Edit</MUIMenuItem>
            <MUIMenuItem onClick={() => { handleMenuClose(); handleDelete(menuRow.Id); }}>Delete</MUIMenuItem>
          </Menu>
        </Paper>
      ) : (

        // FORM VIEW one-column
        <Grid container spacing={3} mt={3}>

          <Grid item xs={12}>
            <label style={labelStyle}>Project No :</label>
            <TextField fullWidth size="small" value={formData.projectNo} onChange={handleChange("projectNo")} />
          </Grid>

          <Grid item xs={12}>
            <label style={labelStyle}>Project Date :</label>
            <TextField fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} value={formData.projectDate} onChange={handleChange("projectDate")} />
          </Grid>

          <Grid item xs={12}>
            <label style={labelStyle}>Customer Name :</label>
            <Select displayEmpty fullWidth size="small" value={formData.customerName} onChange={handleChange("customerName")}>
              <MenuItem value="">Select Customer</MenuItem>
              {customers.map((c) => (
                <MenuItem key={c.CustomerID} value={c.CustomerID}>{c.CustomerName}</MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <label style={labelStyle}>Project Name :</label>
            <TextField fullWidth size="small" value={formData.projectName} onChange={handleChange("projectName")} />
          </Grid>

          <Grid item xs={12}>
            <label style={labelStyle}>Project Created By :</label>
            <Select displayEmpty fullWidth size="small" value={formData.createdBy} onChange={handleChange("createdBy")}>
              <MenuItem value="">Select Employee</MenuItem>
              {employees.map((e) => (
                <MenuItem key={e.Id} value={e.EmployeeName}>{e.EmployeeName}</MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <label style={labelStyle}>Follow Up By (1) :</label>
            <Select displayEmpty fullWidth size="small" value={formData.followBy1} onChange={handleChange("followBy1")}>
              <MenuItem value="">Select</MenuItem>
              {employees.map((e) => (
                <MenuItem key={e.Id} value={e.EmployeeName}>{e.EmployeeName}</MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <label style={labelStyle}>Follow Up By (2) :</label>
            <Select displayEmpty fullWidth size="small" value={formData.followBy2} onChange={handleChange("followBy2")}>
              <MenuItem value="">Select</MenuItem>
              {employees.map((e) => (
                <MenuItem key={e.Id} value={e.EmployeeName}>{e.EmployeeName}</MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <label style={labelStyle}>Notes :</label>
            <TextField fullWidth multiline rows={10} size="small" value={formData.notes} onChange={handleChange("notes")} />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2}>
              <label style={labelStyle}>Follow-up Date :</label>
              <TextField size="small" type="date" InputLabelProps={{ shrink: true }} value={formData.followUpDate} onChange={handleChange("followUpDate")} />

              <FormControlLabel
                label="No Follow-up Required"
                control={
                  <Checkbox
                    checked={formData.noFollowUpRequired}
                    onChange={handleChange("noFollowUpRequired")}
                  />
                }
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmit}>SAVE</Button>
            <Button variant="outlined" color="error" onClick={() => setView("table")}>
              CANCEL
            </Button>
          </Grid>

        </Grid>
      )}
    </Box>
  );
};

export default PaymentFollowUpForm;
