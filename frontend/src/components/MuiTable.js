import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function MuiTable({ rows, columns, onAdd }) {
  return (
    <div style={{ height: 500, width: "100%", background:"white" }}>
      <Button variant="contained" onClick={onAdd} sx={{ mb: 2 }}>
        Add
      </Button>

      <DataGrid rows={rows} columns={columns} pageSize={10} checkboxSelection/>
    </div>
  );
}
