import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer, 
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import ItemForm from "./ItemForm";

export default function ItemMasterList() {
  const [items, setItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // FORM CONTROL
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Load table data
  const loadData = async () => {
    const res = await fetch("http://localhost:5000/api/itemmaster");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 3 DOT MENU OPEN
  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // =============================
  // DELETE RECORD
  // =============================
  const handleDelete = async () => {
    if (!selectedRow?.ID) return;

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const res = await fetch(
      `http://localhost:5000/api/itemmaster/${selectedRow.ID}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      alert("Deleted Successfully");
      loadData();
    } else {
      alert("Failed to delete");
    }

    handleMenuClose();
  };

  // =============================
  // OPEN ADD FORM
  // =============================
  const openAddForm = () => {
    setEditData(null);
    setOpenForm(true);
  };

  // =============================
  // OPEN EDIT FORM
  // =============================
  const openEditForm = () => {
    setEditData(selectedRow);
    setOpenForm(true);
    handleMenuClose();
  };

  // =============================
  // OPEN VIEW (read-only) FORM
  // =============================
  const openViewForm = () => {
    if (!selectedRow) return;
    // pass a readOnly/view flag to ItemForm; ItemForm honors editData.readOnly || editData.view
    setEditData({ ...selectedRow, readOnly: true, view: true });
    setOpenForm(true);
    handleMenuClose();
  };

  // CLOSE FORM
  const closeForm = () => {
    setOpenForm(false);
    setEditData(null);
    loadData();
  }; 

  // =============================
  // RENDER LIST OR FORM
  // =============================
  if (openForm) {
    return <ItemForm editData={editData} onClose={closeForm} />;
  }

  // =============================
  // TABLE UI
  // =============================
  return (
    <Box sx={{ width: "100%", p: 1 , mt: 10}}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Item Master</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddForm}
        >
          Add Item
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Article No</TableCell>
              <TableCell>Type Designation</TableCell>
              <TableCell>Master ID</TableCell>
              <TableCell>Store Location</TableCell>
              <TableCell>Net Price</TableCell>
              <TableCell>HSN Code</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((row) => (
              <TableRow key={row.ID} hover>
                <TableCell>{row.ArticleNo}</TableCell>
                <TableCell>{row.TypeDesignation}</TableCell>
                <TableCell>{row.MasterId}</TableCell>
                <TableCell>{row.StoreLocation}</TableCell>
                <TableCell>{row.NetPrice}</TableCell>
                <TableCell>{row.HSNCode}</TableCell>

                <TableCell align="center">
                  <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 3 DOT MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={openViewForm}>View</MenuItem>
        <MenuItem onClick={openEditForm}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}




// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   IconButton,
//   Menu,
//   MenuItem,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography
// } from "@mui/material";

// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import AddIcon from "@mui/icons-material/Add";
// import ItemForm from "./ItemForm";

// export default function ItemMasterList() {
//   const [items, setItems] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedRow, setSelectedRow] = useState(null);

//   const [openForm, setOpenForm] = useState(false);
//   const [editData, setEditData] = useState(null);

//   const loadData = async () => {
//     const res = await fetch("http://localhost:5000/api/itemmaster");
//     const data = await res.json();
//     setItems(data);
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const handleMenuOpen = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedRow(row);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDelete = async () => {
//     if (!selectedRow?.ID) return;
//     if (!window.confirm("Are you sure you want to delete this item?")) return;

//     const res = await fetch(
//       `http://localhost:5000/api/itemmaster/${selectedRow.ID}`,
//       { method: "DELETE" }
//     );

//     if (res.ok) {
//       alert("Deleted Successfully");
//       loadData();
//     } else {
//       alert("Failed to delete");
//     }

//     handleMenuClose();
//   };

//   const openAddForm = () => {
//     setEditData(null);
//     setOpenForm(true);
//   };

//   const openEditForm = () => {
//     setEditData(selectedRow);
//     setOpenForm(true);
//     handleMenuClose();
//   };

//   const openViewForm = () => {
//     if (!selectedRow) return;
//     setEditData({ ...selectedRow, readOnly: true, view: true });
//     setOpenForm(true);
//     handleMenuClose();
//   };

//   const closeForm = () => {
//     setOpenForm(false);
//     setEditData(null);
//     loadData();
//   };

//   /* ============================
//      WHEN FORM IS OPEN — SHOW HEADER + BACK BUTTON
//      ============================ */
//   if (openForm) {
//     return (
//       <Box sx={{ width: "100%", p: 3 }}>
//         {/* TOP HEADER */}
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//           <Button
//             variant="outlined"
//             color="primary"
//             onClick={closeForm}
//             sx={{ fontWeight: 600 }}
//           >
//             ⬅ Back To Table
//           </Button>
//         </Box>

//         {/* FORM */}
//         <ItemForm editData={editData} onClose={closeForm} />
//       </Box>
//     );
//   }

//   /* ============================
//      TABLE VIEW
//      ============================ */
//   return (
//     <Box sx={{ width: "100%", p: 3 }}>
//       {/* HEADER */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//         <Typography variant="h5">Item Master</Typography>

//         <Button variant="contained" startIcon={<AddIcon />} onClick={openAddForm}>
//           Add Item
//         </Button>
//       </Box>

//       {/* TABLE */}
//       <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>Article No</TableCell>
//               <TableCell>Type Designation</TableCell>
//               <TableCell>Master ID</TableCell>
//               <TableCell>Store Location</TableCell>
//               <TableCell>Net Price</TableCell>
//               <TableCell>HSN Code</TableCell>
//               <TableCell align="center">Action</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {items.map((row) => (
//               <TableRow key={row.ID} hover>
//                 <TableCell>{row.ArticleNo}</TableCell>
//                 <TableCell>{row.TypeDesignation}</TableCell>
//                 <TableCell>{row.MasterId}</TableCell>
//                 <TableCell>{row.StoreLocation}</TableCell>
//                 <TableCell>{row.NetPrice}</TableCell>
//                 <TableCell>{row.HSNCode}</TableCell>

//                 <TableCell align="center">
//                   <IconButton onClick={(e) => handleMenuOpen(e, row)}>
//                     <MoreVertIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* 3-DOT MENU */}
//       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//         <MenuItem onClick={openViewForm}>View</MenuItem>
//         <MenuItem onClick={openEditForm}>Edit</MenuItem>
//         <MenuItem onClick={handleDelete} sx={{ color: "red" }}>Delete</MenuItem>
//       </Menu>
//     </Box>
//   );
// }
