// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
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
// import MoreVertIcon from "@mui/icons-material/MoreVert";

// /* ---------- Reusable row ---------- */
// const FormRow = ({ label, children, error }) => (
//   <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
//     <Box sx={{ width: 170, fontWeight: 600 }}>{label}</Box>
//     <Box sx={{ flexGrow: 1 }}>
//       {children}
//       {error && (
//         <Box sx={{ color: "error.main", mt: 0.5, fontSize: 12 }}>
//           {error}
//         </Box>
//       )}
//     </Box>
//   </Box>
// );

// /* ---------- Initial form ---------- */
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

// const ProjectFollowUpForm = ({ mode = "project" }) => {
//   const [formData, setFormData] = useState(initialForm);
//   const [customers, setCustomers] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [rows, setRows] = useState([]);
//   const [view, setView] = useState("table");
//   const [editingId, setEditingId] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuRow, setMenuRow] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [readOnly, setReadOnly] = useState(false);

//   /* ---------- Labels ---------- */
//   const isPayment = mode === "payment";
//   const labels = {
//     id: isPayment ? "Invoice No" : "Project No",
//     date: isPayment ? "Invoice Date" : "Project Date",
//     entity: isPayment ? "Amount" : "Project Name",
//     createdBy: isPayment ? "Payment Created By" : "Project Created By",
//     follow1: "Follow By (1)",
//     follow2: "Follow By (2)",
//     followUpDate: "Follow-Up Date",
//   };

//   useEffect(() => {
//     fetchLists();
//     fetchRows();
//   }, []);

//   const fetchLists = () => {
//     axios
//       .get("http://localhost:5000/api/dropdown/customers")
//       .then((res) => setCustomers(res.data));

//     axios
//       .get("http://localhost:5000/api/dropdown/employees")
//       .then((res) => setEmployees(res.data));
//   };

//   const fetchRows = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/payment/list"
//       );
//       setRows(res.data || []);
//     } catch {
//       setRows([]);
//     }
//   };

//   const handleChange = (field) => (e) => {
//     const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
//     setFormData({ ...formData, [field]: v });
//   };

//   // const handleAlphaNumeric = (field) => (e) => {
//   //   const v = e.target.value.replace(/[^A-Za-z0-9\s-]/g, "");
//   //   setFormData({ ...formData, [field]: v });
//   // };

//   const handleAlphaOnly = (field) => (e) => {
//     const v = e.target.value.replace(/[0-9]/g, "");
//     setFormData({ ...formData, [field]: v });
//   };

//   const handleAmountChange = (field) => (e) => {
//     let v = e.target.value.replace(/[^0-9.]/g, "");
//     const dot = v.indexOf(".");
//     if (dot !== -1) {
//       const i = v.slice(0, dot).replace(/\./g, "");
//       const d = v.slice(dot + 1).replace(/\./g, "").slice(0, 2);
//       v = d ? `${i}.${d}` : i;
//     }
//     setFormData({ ...formData, [field]: v });
//   };

//   /* ---------- ADD ---------- */
//   const openAddForm = () => {
//     setFormData(initialForm);
//     setEditingId(null);
//     setReadOnly(false);
//     setView("form");
//   };

//   /* ---------- EDIT ---------- */
//   const openEditForm = (row) => {
//     setFormData({
//       projectNo: row.ProjectNo,
//       projectDate: row.ProjectDate?.substr(0, 10),
//       customerName: row.CustomerName,
//       projectName: row.ProjectName,
//       createdBy: row.CreatedBy,
//       followBy1: row.FollowBy1,
//       followBy2: row.FollowBy2,
//       notes: row.Notes,
//       followUpDate: row.FollowUpDate?.substr(0, 10),
//       noFollowUpRequired: row.NoFollowUpRequired,
//     });
//     setEditingId(row.Id);
//     setReadOnly(false);
//     setView("form");
//   };

//   /* ---------- VIEW ---------- */
//   const openViewForm = (row) => {
//     openEditForm(row);
//     setReadOnly(true);
//   };

//   /* ---------- Validation ---------- */
//   const validate = () => {
//     const e = {};
//     if (!formData.projectNo) e.projectNo = "Required";
//     if (!formData.projectDate) e.projectDate = "Required";
//     if (!formData.customerName) e.customerName = "Required";
//     if (!formData.createdBy) e.createdBy = "Required";
//     if (!formData.projectName) e.projectName = "Required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ---------- SAVE ---------- */
//   const handleSubmit = async () => {
//     if (!validate()) return;
//     if (editingId) {
//       await axios.put(
//         `http://localhost:5000/api/payment/${editingId}`,
//         formData
//       );
//     } else {
//       await axios.post(
//         "http://localhost:5000/api/payment/save",
//         formData
//       );
//     }
//     setView("table");
//     fetchRows();
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete record?")) return;
//     await axios.delete(`http://localhost:5000/api/payment/${id}`);
//     fetchRows();
//   };

//   /* ---------- UI ---------- */
//   return (
//     <Box sx={{ p: 4 }}>
//       <Box display="flex" justifyContent="space-between">
//         <Typography fontSize={22} fontWeight="bold">
//           {isPayment ? "Payment Follow-Up Entry" : "Project Follow-Up Entry"}
//         </Typography>
//         {view === "table" && (
//           <Button variant="contained" onClick={openAddForm}>
//             Add
//           </Button>
//         )}
//       </Box>

//       {view === "table" ? (
//         <Paper sx={{ p: 2, mt: 2 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>{labels.id}</TableCell>
//                 <TableCell>{labels.date}</TableCell>
//                 <TableCell>Customer</TableCell>
//                 <TableCell>{labels.entity}</TableCell>
//                 <TableCell>{labels.createdBy}</TableCell>
//                 <TableCell>{labels.follow1}</TableCell>
//                 <TableCell>{labels.follow2}</TableCell>
//                 <TableCell>{labels.followUpDate}</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rows.map((r) => (
//                 <TableRow key={r.Id}>
//                   <TableCell>{r.ProjectNo}</TableCell>
//                   <TableCell>{r.ProjectDate?.substr(0, 10)}</TableCell>
//                   <TableCell>{r.CustomerName}</TableCell>
//                   <TableCell>{r.ProjectName}</TableCell>
//                   <TableCell>{r.CreatedBy}</TableCell>
//                   <TableCell>{r.FollowBy1}</TableCell>
//                   <TableCell>{r.FollowBy2}</TableCell>
//                   <TableCell>{r.FollowUpDate?.substr(0, 10)}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setMenuRow(r); }}>
//                       <MoreVertIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
//             <MUIMenuItem onClick={() => { setAnchorEl(null); openViewForm(menuRow); }}>View</MUIMenuItem>
//             <MUIMenuItem onClick={() => { setAnchorEl(null); openEditForm(menuRow); }}>Edit</MUIMenuItem>
//             <MUIMenuItem onClick={() => { setAnchorEl(null); handleDelete(menuRow.Id); }}>Delete</MUIMenuItem>
//           </Menu>
//         </Paper>
//       ) : (
//         <Paper sx={{ p: 3, mt: 3 }}>
//           {/* 🔴 Project No + Project Date SAME ROW */}
//           <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
//             <FormRow label={`${labels.id} :`} error={errors.projectNo}>
//               <TextField fullWidth size="small" value={formData.projectNo}
//                 onChange={handleAmountChange("projectNo")} disabled={readOnly} />
//             </FormRow>

//             <FormRow label={`${labels.date} :`} error={errors.projectDate}>
//               <TextField fullWidth size="small" type="date"
//                 value={formData.projectDate} onChange={handleChange("projectDate")}
//                 disabled={readOnly} />
//             </FormRow>
//           </Box>

//           <FormRow label="Customer Name :" error={errors.customerName}>
//             <Select fullWidth size="small" value={formData.customerName}
//               onChange={handleChange("customerName")} disabled={readOnly}>
//               <MenuItem value="">Select</MenuItem>
//               {customers.map(c => (
//                 <MenuItem key={c.CustomerID} value={c.CustomerID}>{c.CustomerName}</MenuItem>
//               ))}
//             </Select>
//           </FormRow>

//           <FormRow label={`${labels.entity} :`} error={errors.projectName}>
//             <TextField fullWidth size="small" value={formData.projectName}
//               onChange={isPayment ? handleAmountChange("projectName") : handleAlphaOnly("projectName")}
//               disabled={readOnly} />
//           </FormRow>

//           <FormRow label={`${labels.createdBy} :`} error={errors.createdBy}>
//             <Select fullWidth size="small" value={formData.createdBy}
//               onChange={handleChange("createdBy")} disabled={readOnly}>
//               <MenuItem value="">Select</MenuItem>
//               {employees.map(e => (
//                 <MenuItem key={e.Id} value={e.EmployeeName}>{e.EmployeeName}</MenuItem>
//               ))}
//             </Select>
//           </FormRow>

// {/* Follow By (1) + Follow By (2) SAME ROW */}
// <Box sx={{ display: "flex", gap: 3, mb: 2 }}>

//   <FormRow label={`${labels.follow1} :`}>
//     <Select
//       fullWidth
//       size="small"
//       value={formData.followBy1}
//       onChange={handleChange("followBy1")}
//       disabled={readOnly}
//     >
//       <MenuItem value="">Select</MenuItem>
//       {employees.map((e) => (
//         <MenuItem key={e.Id} value={e.EmployeeName}>
//           {e.EmployeeName}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormRow>

//   <FormRow label={`${labels.follow2} :`}>
//     <Select
//       fullWidth
//       size="small"
//       value={formData.followBy2}
//       onChange={handleChange("followBy2")}
//       disabled={readOnly}
//     >
//       <MenuItem value="">Select</MenuItem>
//       {employees.map((e) => (
//         <MenuItem key={e.Id} value={e.EmployeeName}>
//           {e.EmployeeName}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormRow>

// </Box>


//           <FormRow label="Notes :">
//             <TextField fullWidth multiline rows={5} size="small"
//               value={formData.notes} onChange={handleChange("notes")} disabled={readOnly} />
//           </FormRow>

//           {/* Follow-Up Date + No Follow-up Required SAME ROW */}
// <Box sx={{ display: "flex", gap: 3, mb: 2, alignItems: "center" }}>

//   <FormRow label={`${labels.followUpDate} :`}>
//     <TextField
//       fullWidth
//       size="small"
//       type="date"
//       InputLabelProps={{ shrink: true }}
//       value={formData.followUpDate}
//       onChange={handleChange("followUpDate")}
//       disabled={readOnly}
//     />
//   </FormRow>

//   <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
//     <FormControlLabel
//       label="No Follow-up Required"
//       control={
//         <Checkbox
//           checked={formData.noFollowUpRequired}
//           onChange={handleChange("noFollowUpRequired")}
//           disabled={readOnly}
//         />
//       }
//     />
//   </Box>

// </Box>


//           {/* <Box sx={{ textAlign: "center", mt: 2 }}>
//             {!readOnly && <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmit}>SAVE</Button>}
//             <Button variant="outlined" color="error" onClick={() => setView("table")}>
//               {readOnly ? "CLOSE" : "CANCEL"}
//             </Button>
//           </Box> */}
//           <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>

//   {/* SAVE BUTTON (Only visible when adding or editing) */}
//   {!readOnly && (
//     <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmit}>
//       SAVE
//     </Button>
//   )}

//   {/* BACK TO TABLE BUTTON */}
//   <Button
//     variant="outlined"
//     sx={{ mr: 2 }}
//     onClick={() => {
//       setView("table");   // 👈 GO BACK TO TABLE
//       setReadOnly(false); // 👈 Reset readonly mode
//     }}
//   >
//     Back to Table
//   </Button>

//   {/* CANCEL / CLOSE depends on view mode */}
//   {!readOnly && (
//     <Button variant="outlined" color="error" onClick={() => { setView("table"); setReadOnly(false); }}>
//       CANCEL
//     </Button>
//   )}

//   {readOnly && (
//     <Button variant="outlined" color="error" onClick={() => { setView("table"); setReadOnly(false); }}>
//       CLOSE
//     </Button>
//   )}

// </Box>

//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default ProjectFollowUpForm;


import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  //Typography,
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

/* ---------- Reusable Label + Input Row ---------- */
const FormRow = ({ label, children, error }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
    <Box sx={{ width: 170, fontWeight: 600 }}>{label}</Box>
    <Box sx={{ flexGrow: 1 }}>
      {children}
      {error && (
        <Box sx={{ color: "error.main", mt: 0.5, fontSize: 12 }}>{error}</Box>
      )}
    </Box>
  </Box>
);

/* ---------- Form Initial Values ---------- */
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

const ProjectFollowUpForm = ({ mode = "project" }) => {
  const [formData, setFormData] = useState(initialForm);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [rows, setRows] = useState([]);
  const [view, setView] = useState("table");
  const [editingId, setEditingId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [errors, setErrors] = useState({});
  const [readOnly, setReadOnly] = useState(false);

  const isPayment = mode === "payment";
  const labels = {
    id: isPayment ? "Invoice No" : "Project No",
    date: isPayment ? "Invoice Date" : "Project Date",
    entity: isPayment ? "Amount" : "Project Name",
    createdBy: isPayment ? "Payment Created By" : "Project Created By",
    follow1: "Follow By (1)",
    follow2: "Follow By (2)",
    followUpDate: "Follow-Up Date",
  };

  useEffect(() => {
    fetchLists();
    fetchRows();
  }, []);

  const fetchLists = () => {
    axios.get("http://localhost:5000/api/dropdown/customers").then((res) => setCustomers(res.data));
    axios.get("http://localhost:5000/api/dropdown/employees").then((res) => setEmployees(res.data));
  };

  const fetchRows = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payment/list");
      setRows(res.data || []);
    } catch {
      setRows([]);
    }
  };

  const handleChange = (field) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: v });
  };

  const handleAlphaOnly = (field) => (e) => {
    const v = e.target.value.replace(/[0-9]/g, "");
    setFormData({ ...formData, [field]: v });
  };

  const handleAmountChange = (field) => (e) => {
    let v = e.target.value.replace(/[^0-9.]/g, "");
    const d = v.indexOf(".");
    if (d !== -1) {
      const int = v.slice(0, d).replace(/\./g, "");
      const dec = v.slice(d + 1).replace(/\./g, "").slice(0, 2);
      v = dec ? `${int}.${dec}` : int;
    }
    setFormData({ ...formData, [field]: v });
  };

  const openAddForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setReadOnly(false);
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
    setReadOnly(false);
    setView("form");
  };

  const openViewForm = (row) => {
    openEditForm(row);
    setReadOnly(true);
  };

  const validate = () => {
    const e = {};
    if (!formData.projectNo) e.projectNo = "Required";
    if (!formData.projectDate) e.projectDate = "Required";
    if (!formData.customerName) e.customerName = "Required";
    if (!formData.createdBy) e.createdBy = "Required";
    if (!formData.projectName) e.projectName = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (editingId) {
      await axios.put(`http://localhost:5000/api/payment/${editingId}`, formData);
    } else {
      await axios.post("http://localhost:5000/api/payment/save", formData);
    }
    setView("table");
    fetchRows();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete record?")) return;
    await axios.delete(`http://localhost:5000/api/payment/${id}`);
    fetchRows();
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* <Box display="flex" justifyContent="space-between">
        <Typography fontSize={22} fontWeight="bold">
          {isPayment ? "Payment Follow-Up Entry" : "Project Follow-Up Entry"}
        </Typography>
        {view === "table" && (
          <Button variant="contained" onClick={openAddForm}>Add</Button>
        )} */}
        <Box display="flex" justifyContent="flex-end">   {/* removed title - only right buttons */}
           {view === "table" && (
        <Button variant="contained" onClick={openAddForm}>
           Add
        </Button>
    )}
      </Box>

      {view === "table" ? (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{labels.id}</TableCell>
                <TableCell>{labels.date}</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>{labels.entity}</TableCell>
                <TableCell>{labels.createdBy}</TableCell>
                <TableCell>{labels.follow1}</TableCell>
                <TableCell>{labels.follow2}</TableCell>
                <TableCell>{labels.followUpDate}</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.Id}>
                  <TableCell>{r.ProjectNo}</TableCell>
                  <TableCell>{r.ProjectDate?.substr(0, 10)}</TableCell>
                  <TableCell>{r.CustomerName}</TableCell>
                  <TableCell>{r.ProjectName}</TableCell>
                  <TableCell>{r.CreatedBy}</TableCell>
                  <TableCell>{r.FollowBy1}</TableCell>
                  <TableCell>{r.FollowBy2}</TableCell>
                  <TableCell>{r.FollowUpDate?.substr(0, 10)}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setMenuRow(r); }}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
            <MUIMenuItem onClick={() => { setAnchorEl(null); openViewForm(menuRow); }}>View</MUIMenuItem>
            <MUIMenuItem onClick={() => { setAnchorEl(null); openEditForm(menuRow); }}>Edit</MUIMenuItem>
            <MUIMenuItem onClick={() => { setAnchorEl(null); handleDelete(menuRow.Id); }}>Delete</MUIMenuItem>
          </Menu>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, mt: 2 }}>
          {/* TOP-RIGHT — BACK BUTTON */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setView("table");
                setReadOnly(false);
              }}
            >
              Back to Table
            </Button>
          </Box>

          {/* FIRST ROW — ProjectNo + Date */}
          <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
            <FormRow label={`${labels.id} :`} error={errors.projectNo}>
              <TextField
                fullWidth
                size="small"
                value={formData.projectNo}
                onChange={handleAmountChange("projectNo")}
                disabled={readOnly}
              />
            </FormRow>

            <FormRow label={`${labels.date} :`} error={errors.projectDate}>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={formData.projectDate}
                onChange={handleChange("projectDate")}
                disabled={readOnly}
              />
            </FormRow>
          </Box>

          <FormRow label="Customer Name :" error={errors.customerName}>
            <Select
              fullWidth
              size="small"
              value={formData.customerName}
              onChange={handleChange("customerName")}
              disabled={readOnly}
            >
              <MenuItem value="">Select</MenuItem>
              {customers.map((c) => (
                <MenuItem key={c.CustomerID} value={c.CustomerID}>{c.CustomerName}</MenuItem>
              ))}
            </Select>
          </FormRow>

          <FormRow label={`${labels.entity} :`} error={errors.projectName}>
            <TextField
              fullWidth
              size="small"
              value={formData.projectName}
              onChange={
                isPayment
                  ? handleAmountChange("projectName")
                  : handleAlphaOnly("projectName")
              }
              disabled={readOnly}
            />
          </FormRow>

          <FormRow label={`${labels.createdBy} :`} error={errors.createdBy}>
            <Select
              fullWidth
              size="small"
              value={formData.createdBy}
              onChange={handleChange("createdBy")}
              disabled={readOnly}
            >
              <MenuItem value="">Select</MenuItem>
              {employees.map((e) => (
                <MenuItem key={e.Id} value={e.EmployeeName}>{e.EmployeeName}</MenuItem>
              ))}
            </Select>
          </FormRow>

          {/* Follow 1 + Follow 2 SAME ROW */}
          <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
            <FormRow label={`${labels.follow1} :`}>
              <Select
                fullWidth
                size="small"
                value={formData.followBy1}
                onChange={handleChange("followBy1")}
                disabled={readOnly}
              >
                <MenuItem value="">Select</MenuItem>
                {employees.map((e) => (
                  <MenuItem key={e.Id} value={e.EmployeeName}>{e.EmployeeName}</MenuItem>
                ))}
              </Select>
            </FormRow>

            <FormRow label={`${labels.follow2} :`}>
              <Select
                fullWidth
                size="small"
                value={formData.followBy2}
                onChange={handleChange("followBy2")}
                disabled={readOnly}
              >
                <MenuItem value="">Select</MenuItem>
                {employees.map((e) => (
                  <MenuItem key={e.Id} value={e.EmployeeName}>{e.EmployeeName}</MenuItem>
                ))}
              </Select>
            </FormRow>
          </Box>

          <FormRow label="Notes :">
            <TextField
              fullWidth
              multiline
              rows={5}
              size="small"
              value={formData.notes}
              onChange={handleChange("notes")}
              disabled={readOnly}
            />
          </FormRow>

          {/* Follow Up + No Follow Same Row */}
          <Box sx={{ display: "flex", gap: 3, mb: 2, alignItems: "center" }}>
            <FormRow label={`${labels.followUpDate} :`}>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange("followUpDate")}
                disabled={readOnly}
              />
            </FormRow>

            <FormControlLabel
              label="No Follow-up Required"
              control={
                <Checkbox
                  checked={formData.noFollowUpRequired}
                  onChange={handleChange("noFollowUpRequired")}
                  disabled={readOnly}
                />
              }
            />
          </Box>

          {/* SAVE / CANCEL BUTTONS AT BOTTOM */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            {!readOnly && (
              <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmit}>
                SAVE
              </Button>
            )}

            {!readOnly ? (
              <Button variant="outlined" color="error" onClick={() => { setView("table"); setReadOnly(false); }}>
                CANCEL
              </Button>
            ) : (
              <Button variant="outlined" color="error" onClick={() => { setView("table"); setReadOnly(false); }}>
                CLOSE
              </Button>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ProjectFollowUpForm;
