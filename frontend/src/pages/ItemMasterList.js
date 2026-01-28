import React, { useEffect, useState } from "react";
import "./ItemMaster.css";
import {
  Box,
  Button
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ItemForm from "./ItemForm";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import StandardTable from "../components/StandardTable";

export default function ItemMasterList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
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

  // =============================
  // DELETE RECORD
  // =============================
  const handleDelete = async (row) => {
    if (!row?.ID) return;

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const res = await fetch(
      `http://localhost:5000/api/itemmaster/${row.ID}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      alert("Deleted Successfully");
      loadData();
    } else {
      alert("Failed to delete");
    }
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
  const openEditForm = (row) => {
    setEditData(row);
    setOpenForm(true);
  };

  // =============================
  // OPEN VIEW (read-only) FORM
  // =============================
  const openViewForm = (row) => {
    if (!row) return;
    setEditData({ ...row, readOnly: true, view: true });
    setOpenForm(true);
  };

  // =============================
  // EXPORT FUNCTIONS
  // =============================
  const exportCSV = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row");
      return;
    }

    const exportData = items.filter(r => selectedRows.includes(r.ID));
    const headers = Object.keys(exportData[0]);
    const csvData = [
      headers.join(","),
      ...exportData.map(row =>
        headers.map(h => `"${row[h] ?? ""}"`).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "item_master.csv");
  };

  const exportExcel = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row");
      return;
    }

    const exportData = items.filter(r => selectedRows.includes(r.ID));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

    XLSX.writeFile(workbook, "item_master.xlsx");
  };

  // CLOSE FORM
  const closeForm = () => {
    setOpenForm(false);
    setEditData(null);
    loadData();
  };

  const handleExport = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row");
      return;
    }
    exportExcel();
  };

  const filteredRows = items.filter((row) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return Object.values(row).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    { field: "ArticleNo", headerName: "Article No", width: 120 },
    { field: "TypeDesignation", headerName: "Type Designation", width: 150 },
    { field: "MasterId", headerName: "Master ID", width: 100 },
    { field: "StoreLocation", headerName: "Store Location", width: 150 },
    { field: "NetPrice", headerName: "Net Price", width: 100 },
    { field: "HSNCode", headerName: "HSN Code", width: 120 }
  ];

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
    <StandardTable
      title="Item Master"
      columns={columns}
      rows={items}
      search={search}
      setSearch={setSearch}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      onAdd={openAddForm}
      onExport={handleExport}
      onEdit={openEditForm}
      onView={openViewForm}
      onDelete={handleDelete}
      pageSize={10}
    />
  );
}