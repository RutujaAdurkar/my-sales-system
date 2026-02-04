import React, { useState, useEffect } from "react";
import "./ItemMaster.css";
import {
  Box,
  Grid,
  TextField,
  MenuItem, 
  Select,
  Paper,
  Button,

} from "@mui/material";

const FormRow = ({ label, children }) => (
  <Box className="form-row">
    <Box className="form-label">{label}</Box>
    <Box style={{ flexGrow: 1 }}>{children}</Box>
  </Box>
);

const initialFormState = {
  uom: "",
  groupId: "",
  openingStock: "",
  itemName: "",
  typeDesignation: "",
  itemCode: "",
  masterId: "",
  currentStock: "",
  ffhw: "",
  validity: "",
  basicPrice: "",
  location: "",
  reorderLevel: "",
  minLevel: "",
  maxLevel: "",
  make: "",
  stockFactor: "",
  hsnCode: "",
  cgst: "",
  sgst: "",
  salesPrice: "",
  openingValue: "",
  deliveryCode: "",
  comments: "",
  substituteItem: "",
  quotationCurrency: "Rs",
  transitDays: "",
  customDuty: "",
  details: "",
  igst: "",
  isBom: false,
};

// ✅ ItemForm can work alone OR receive editData + onClose from list page
const ItemForm = ({ editData = null, onClose }) => {
  const [formData, setFormData] = useState(
    JSON.parse(localStorage.getItem("draftItemForm")) || initialFormState
  );

  // dropdown lists
  const [statisticGroups, setStatisticGroups] = useState([]);
  const [masters, setMasters] = useState([]);
  const [productFocusOptions, setProductFocusOptions] = useState([]);
  const [substituteItems, setSubstituteItems] = useState([]);
  const [typeSelections, setTypeSelections] = useState([]);
  const [errors, setErrors] = useState({});
  // read-only view mode (for "View" action)
  const [readOnly, setReadOnly] = useState(false);

  // ------------------------------------------------
  // LOAD DROPDOWN OPTIONS FROM BACKEND
  // ------------------------------------------------
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [sgRes, mRes, pfRes, subRes, tsRes] = await Promise.all([
          fetch("http://localhost:5000/api/dropdowns/statistic-groups"),
          fetch("http://localhost:5000/api/dropdowns/masters"),
          fetch("http://localhost:5000/api/dropdowns/product-focus"),
          fetch("http://localhost:5000/api/dropdowns/substitute-items"),
          fetch("http://localhost:5000/api/dropdowns/type-selections") ,

        ]);

        const [sgData, mData, pfData, subData, tsData] = await Promise.all([
          sgRes.json(),
          mRes.json(),
          pfRes.json(),
          subRes.json(),
          tsRes.json()
        ]);

        setStatisticGroups(sgData || []);
        setMasters(mData || []);
        setProductFocusOptions(pfData || []);
        setSubstituteItems(subData || []);
        setTypeSelections(tsData);
      } catch (err) {
        console.error("❌ Lookup fetch error:", err);
      }
    };

    loadLookups();
  }, []);

  // ------------------------------------------------
  // LOAD VALUES IN EDIT MODE (when editData is passed)
  // ------------------------------------------------
  useEffect(() => {
    if (!editData) {
      setReadOnly(false);
      return;
    }

    // Map DB field names to form fields (adjust if your column names differ)
    const mapped = {
      uom: editData.UOM || "",
      groupId: editData.GroupId || "",
      openingStock: editData.OpeningStock || "",
      itemName: editData.ItemName || "",
      typeDesignation: editData.TypeDesignation || "",
      itemCode: editData.ItemCode || "",
      masterId: editData.MasterId || "",
      ffhw: editData.FF_HW || "",
      validity: editData.DateOfValidity
        ? editData.DateOfValidity.slice(0, 10)
        : "",
      basicPrice: editData.BasicPrice?.toString() || "",
      location: editData.Location || "",
      deliveryCode: editData.DeliveryCode?.toString() || "",
      reorderLevel: editData.ReorderLevel?.toString() || "",
      minLevel: editData.MinLevel?.toString() || "",
      maxLevel: editData.MaxLevel?.toString() || "",
      make: editData.Make || "",
      stockFactor: editData.StockFactor?.toString() || "",
      hsnCode: editData.HSNCode || "",
      cgst: editData.CGST?.toString() || "",
      sgst: editData.SGST?.toString() || "",
      currentStock: editData.CurrentStock?.toString() || "",
      salesPrice: editData.SalesPrice?.toString() || "",
      openingValue: editData.OpeningValue?.toString() || "",
      comments: editData.Comments || "",
      substituteItem: editData.SubstituteItem || "",
      quotationCurrency: editData.QuotationCurrency || "Rs",
      transitDays: editData.TransitDays?.toString() || "",
      customDuty: editData.CustomDuty?.toString() || "",
      details: editData.Details || "",
      igst: editData.IGST?.toString() || "",
      isBom: editData.ISBOM === 1 || false,
    };

    setFormData({ ...initialFormState, ...mapped });
    // if editData carries a view/readOnly flag, honor it
    setReadOnly(!!(editData.readOnly || editData.view));
  }, [editData]);

  // ------------------------------------------------
  // INPUT HANDLERS (same validation as before)
  // ------------------------------------------------
  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleNumberChange = (field) => (e) => {
    const v = e.target.value;
    if (/^\d*$/.test(v) || v === "") {
      setFormData({ ...formData, [field]: v });
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleDecimalChange = (field) => (e) => {
    const v = e.target.value;
    if (/^\d*\.?\d*$/.test(v)) {
      setFormData({ ...formData, [field]: v });
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleTextChange = (field) => (e) => {
    const v = e.target.value;
    if (/^[A-Za-z ]*$/.test(v)) {
      setFormData({ ...formData, [field]: v });
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAlphaNumeric = (field) => (e) => {
    const v = e.target.value;
    if (/^[A-Za-z0-9\s-]*$/.test(v)) {
      setFormData({ ...formData, [field]: v });
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

// ------------------------------------------------
  // VALIDATION (all fields)
  // ------------------------------------------------
  const validateField = (field) => {
    let msg = "";
    const v = formData[field];

    // Required check for fields listed in requiredFields
    if (requiredFields.includes(field)) {
      if (v === "" || v === null || v === undefined || (typeof v === "string" && v.trim() === "")) {
        setErrors(prev => ({ ...prev, [field]: "Required" }));
        return false;
      }
    }

    // Type-specific validation
    switch (field) {
      // Integer fields
      case "groupId":
      case "masterId":
      case "deliveryCode":
      case "transitDays":
        if (v !== "" && v !== null && v !== undefined) {
          if (!/^\d+$/.test(v.toString())) msg = "Must be an integer";
        }
        break;

      // Decimal fields
      case "openingStock":
      case "currentStock":
      case "salesPrice":
      case "basicPrice":
      case "openingValue":
      case "reorderLevel":
      case "minLevel":
      case "maxLevel":
      case "stockFactor":
      case "customDuty":
        if (v !== "" && v !== null && v !== undefined) {
          if (!/^\d+(\.\d+)?$/.test(v.toString())) msg = "Must be a non-negative number";
        }
        break;

      // Tax percent 0-100
      case "cgst":
      case "sgst":
      case "igst":
        if (v !== "" && v !== null && v !== undefined) {
          if (!/^\d+(\.\d+)?$/.test(v.toString())) msg = "Must be a number";
          else if (Number(v) < 0 || Number(v) > 100) msg = "Enter 0 - 100";
        }
        break;

      // Date
      case "validity":
        if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) msg = "Invalid date";
        break;

      // String length checks (NVARCHAR limits from DB schema)
      case "itemName":
        if (v && v.length > 100) msg = "Max 100 chars";
        break;
      case "itemCode":
        if (v && v.length > 20) msg = "Max 20 chars";
        break;
      case "location":
        if (v && v.length > 50) msg = "Max 50 chars";
        break;
      case "make":
        if (v && v.length > 50) msg = "Max 50 chars";
        break;
      case "hsnCode":
        if (v && v.length > 15) msg = "Max 15 chars";
        break;
      case "comments":
        if (v && v.length > 500) msg = "Max 500 chars";
        break;
      case "substituteItem":
        if (v && v.length > 20) msg = "Max 20 chars";
        break;
      case "details":
        if (v && v.length > 400) msg = "Max 400 chars";
        break;
      case "quotationCurrency":
        if (v && v.length > 3) msg = "Max 3 chars";
        break;
      case "ffhw":
        if (v && v.length > 4) msg = "Max 4 chars";
        break;

      default:
        break;
    }

    // min/max cross-check
    if ((field === "minLevel" || field === "maxLevel") && formData.minLevel !== "" && formData.maxLevel !== "") {
      if (Number(formData.minLevel) > Number(formData.maxLevel)) {
        setErrors(prev => ({ ...prev, minLevel: "Min should be <= Max", maxLevel: "Max should be >= Min" }));
        return false;
      } else {
        setErrors(prev => ({ ...prev, minLevel: "", maxLevel: "" }));
      }
    }

    setErrors(prev => ({ ...prev, [field]: msg }));
    return !msg;
  };
  
const requiredFields = [
  "groupId",
  "openingStock",
  "itemName",
  "itemCode",
  "typeDesignation",
  "masterId",
  "currentStock",
  "basicPrice",
  "salesPrice",
  "openingValue",
  "location",
  "deliveryCode",
  "reorderLevel",
  "minLevel",
  "maxLevel",
  "make"
];

  const validateForm = () => {
  let newErrors = {};

  // REQUIRED FIELD CHECK
  requiredFields.forEach((f) => {
    const v = formData[f];
    if (v === "" || v === null || v === undefined) {
      newErrors[f] = "Required";
    }
  });

  // NUMERIC FIELDS
  const decimalFields = [
    "openingStock","currentStock","salesPrice","basicPrice","openingValue",
    "reorderLevel","minLevel","maxLevel","stockFactor","customDuty",
    "cgst","sgst","igst"
  ];

  decimalFields.forEach((f) => {
    const v = formData[f];
    if (v !== "" && v !== null && v !== undefined) {
      if (!/^\d+(\.\d+)?$/.test(v.toString())) {
        newErrors[f] = "Must be a non-negative number";
      }
    }
  });

  const integerFields = ["groupId","masterId","deliveryCode","transitDays"];
  integerFields.forEach((f) => {
    const v = formData[f];
    if (v !== "" && v !== null && v !== undefined) {
      if (!/^\d+$/.test(v.toString())) {
        newErrors[f] = "Must be an integer";
      }
    }
  });

  // TAX %
  ["cgst","sgst","igst"].forEach((f) => {
    const v = formData[f];
    if (v !== "" && v !== null && v !== undefined) {
      if (!/^\d+(\.\d+)?$/.test(v)) {
        newErrors[f] = "Must be a number";
      } else if (Number(v) < 0 || Number(v) > 100) {
        newErrors[f] = "Enter 0 - 100";
      }
    }
  });

  // DATE
  if (formData.validity && !/^\d{4}-\d{2}-\d{2}$/.test(formData.validity)) {
    newErrors.validity = "Invalid date";
  }

  // STRING LENGTH LIMITS (DB NVARCHAR sizes)
  const stringLimits = {
    itemName: 100,
    itemCode: 20,
    location: 50,
    make: 50,
    hsnCode: 15,
    comments: 500,
    substituteItem: 20,
    details: 400,
    quotationCurrency: 3,
    ffhw: 4,
    uom: 6
  };

  Object.keys(stringLimits).forEach((k) => {
    const v = formData[k];
    const max = stringLimits[k];
    if (v && v.length > max) newErrors[k] = `Max ${max} chars`;
  });

  // MIN / MAX CHECK
  if (
    formData.minLevel !== "" &&
    formData.maxLevel !== "" &&
    Number(formData.minLevel) > Number(formData.maxLevel)
  ) {
    newErrors.minLevel = "Min should be <= Max";
    newErrors.maxLevel = "Max should be >= Min";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


const handleSubmit = async () => {
  if (!validateForm()) {
    alert("Please fill all required fields!");
    return;
  }

  const payload = {
  ID: editData?.ID || 0,
  UOM: formData.uom || "",
  GroupId: formData.groupId ? parseInt(formData.groupId) : 0,
  OpeningStock: formData.openingStock ? parseFloat(formData.openingStock) : 0,
  ItemName: formData.itemName,
  TypeDesignation: formData.typeDesignation,
  ItemCode: formData.itemCode,
  MasterId: formData.masterId ? parseInt(formData.masterId) : 0,
  CurrentStock: formData.currentStock ? parseFloat(formData.currentStock) : 0,
  FF_HW: formData.ffhw,
  SalesPrice: formData.salesPrice ? parseFloat(formData.salesPrice) : 0,
  DateOfValidity: formData.validity,
  BasicPrice: formData.basicPrice ? parseFloat(formData.basicPrice) : 0,
  OpeningValue: formData.openingValue ? parseFloat(formData.openingValue) : 0,
  Location: formData.location,
  DeliveryCode: formData.deliveryCode || "",
  ReorderLevel: formData.reorderLevel ? parseFloat(formData.reorderLevel) : 0,
  MinLevel: formData.minLevel ? parseFloat(formData.minLevel) : 0,
  MaxLevel: formData.maxLevel ? parseFloat(formData.maxLevel) : 0,
  Make: formData.make,
  StockFactor: formData.stockFactor ? parseFloat(formData.stockFactor) : 0,
  HSNCode: formData.hsnCode,
  CGST: formData.cgst ? parseFloat(formData.cgst) : 0,
  SGST: formData.sgst ? parseFloat(formData.sgst) : 0,
  IGST: formData.igst ? parseFloat(formData.igst) : 0,
  Comments: formData.comments,
  SubstituteItem: formData.substituteItem,
  QuotationCurrency: formData.quotationCurrency,
  TransitDays: formData.transitDays ? parseInt(formData.transitDays) : 0,
  CustomDuty: formData.customDuty ? parseFloat(formData.customDuty) : 0,
  Details: formData.details,
  ISBOM: formData.isBom ? 1 : 0
};

  const recordId = editData?.ItemID || editData?.ID;

  const url = recordId
    ? `http://localhost:5000/api/itemmaster/${recordId}`
    : "http://localhost:5000/api/itemmaster";

  const method = recordId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let dataText = "";
    try {
      dataText = await res.text();
    } catch (e) {
      // ignore
    }

    let data;
    try {
      data = dataText ? JSON.parse(dataText) : null;
    } catch (e) {
      data = null;
    }

    if (res.ok) {
      alert(recordId ? "✔ Item updated successfully!" : "✔ Item saved successfully!");
      if (onClose) onClose();
      else setFormData(initialFormState);
    } else {
      console.error("Save failed", res.status, dataText, data);
      const serverMsg = (data && (data.error || data.message)) || dataText || "Unknown error";
      alert("Failed: " + serverMsg);
    }
  } catch (err) {
    console.error("❌ API Error:", err);
    alert("❌ API Error");
  }
};

  // ------------------------------------------------
  // CANCEL → close in modal OR clear when used alone
  // ------------------------------------------------
  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else if (window.confirm("Clear all fields?")) {
      setFormData(initialFormState);
    }
  };

  // ------------------------------------------------
  // FORM UI (3 equal-height columns)
  // ------------------------------------------------
return (  
  <Box className="item-form-wrapper">
    {onClose && (
      <Box className="back-btn-wrapper">
        <Button 
        variant="contained" 
        size="small" 
        sx={{ background: "#1976d2" }}
        onClick={onClose}
        >
          Back to Table
        </Button>
      </Box>
    )}

       <Paper
         className="form-paper">
          <FormRow label="Group Id:">
            <Select
              fullWidth
              size="small"
              value={formData.groupId || ""}
              onChange={handleChange("groupId")}
              onBlur={() => validateField("groupId")}
              error={!!errors.groupId}
              sx={{ backgroundColor: 'background.paper' }}
              displayEmpty
              disabled={readOnly}
            >
              <MenuItem value="">
                <em>Select Group</em>
              </MenuItem>
              {statisticGroups.map((g) => (
                 <MenuItem key={g.GroupId} value={g.GroupId}>
                   {g.GroupCode}
                 </MenuItem>
              ))}
            </Select>
            {errors.groupId && (
              <Box sx={{ color: 'error.main', fontSize: '12px', mt: 0.5 }}>{errors.groupId}</Box>
            )}
          </FormRow>

        {/* MAIN 3-COLUMN FORM */}
            <Box className="form-columns">
                <Box className="form-column">
                  <FormRow label="Opening Stock:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.openingStock ?? ""}
                      onChange={handleAlphaNumeric("openingStock")}
                      onBlur={() => validateField("openingStock")}
                      error={!!errors.openingStock}
                      helperText={errors.openingStock}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Item Name:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.itemName ?? ""}
                      onChange={handleTextChange("itemName")}
                      onBlur={() => validateField("itemName")}
                      error={!!errors.itemName}
                      helperText={errors.itemName}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Item Code:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.itemCode ?? ""}
                      onChange={handleAlphaNumeric("itemCode")}
                      onBlur={() => validateField("itemCode")}
                      error={!!errors.itemCode}
                      helperText={errors.itemCode}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Type Designation:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.typeDesignation ?? ""}
                      onChange={handleTextChange("typeDesignation")}
                      onBlur={() => validateField("typeDesignation")}
                      error={!!errors.typeDesignation}
                      helperText={errors.typeDesignation}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  {/* Master Id dropdown */}
                  <FormRow label="Master Id:">
                    <Select
                      fullWidth
                      size="small"
                      value={formData.masterId || ""}
                      onChange={handleChange("masterId")}
                      onBlur={() => validateField("masterId")}
                      error={!!errors.masterId}
                      sx={{ backgroundColor: 'background.paper' }}
                      displayEmpty
                      disabled={readOnly}
                    >
                      <MenuItem value="">
                        <em>Select Master</em>
                      </MenuItem>
                    {masters.map((m) => (
                      <MenuItem key={m.Id} value={m.Id}>
                        {m.MasterIdName}
                     </MenuItem>
                    ))}
                    </Select>
                    {errors.masterId && (
                      <Box sx={{ color: 'error.main', fontSize: '12px', mt: 0.5 }}>{errors.masterId}</Box>
                    )}
                  </FormRow>

                  <FormRow label="FF_HW:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.ffhw ?? ""}
                      onChange={handleTextChange("ffhw")}
                      onBlur={() => validateField("ffhw")}
                      error={!!errors.ffhw}
                      helperText={errors.ffhw}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Date of validity:">
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      value={formData.validity ?? ""}
                      onChange={handleChange("validity")}
                      onBlur={() => validateField("validity")}
                      error={!!errors.validity}
                      helperText={errors.validity}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Basic Price:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.basicPrice ?? ""}
                      onChange={handleDecimalChange("basicPrice")}
                      onBlur={() => validateField("basicPrice")}
                      error={!!errors.basicPrice}
                      helperText={errors.basicPrice}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Store Location:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.location ?? ""}
                      onChange={handleAlphaNumeric("location")}
                      onBlur={() => validateField("location")}
                      error={!!errors.location}
                      helperText={errors.location}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Delivery Code:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.deliveryCode ?? ""}
                      onChange={handleNumberChange("deliveryCode")}
                      onBlur={() => validateField("deliveryCode")}
                      error={!!errors.deliveryCode}
                      helperText={errors.deliveryCode}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  {/* 🔹 Comments in Column 1 (your choice A) */}
                  <FormRow label="Comments:">
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      value={formData.comments ?? ""}
                      onChange={handleChange("comments")}
                      onBlur={() => validateField("comments")}
                      error={!!errors.comments}
                      helperText={errors.comments}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>
                </Box>

              {/* COLUMN 2 */}
                 <Box className="form-column">
                  <FormRow label="Reorder Level:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.reorderLevel ?? ""}
                      onChange={handleNumberChange("reorderLevel")}
                      onBlur={() => validateField("reorderLevel")}
                      error={!!errors.reorderLevel}
                      helperText={errors.reorderLevel}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Min. Level:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.minLevel ?? ""}
                      onChange={handleNumberChange("minLevel")}
                      onBlur={() => validateField("minLevel")}
                      error={!!errors.minLevel}
                      helperText={errors.minLevel}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Max. Level:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.maxLevel ?? ""}
                      onChange={handleNumberChange("maxLevel")}
                      onBlur={() => validateField("maxLevel")}
                      error={!!errors.maxLevel}
                      helperText={errors.maxLevel}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Make:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.make ?? ""}
                      onChange={handleAlphaNumeric("make")}
                      onBlur={() => validateField("make")}
                      error={!!errors.make}
                      helperText={errors.make}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Stock Factor:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.stockFactor ?? ""}
                      onChange={handleDecimalChange("stockFactor")}
                      onBlur={() => validateField("stockFactor")}
                      error={!!errors.stockFactor}
                      helperText={errors.stockFactor}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="HSN Code:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.hsnCode ?? ""}
                      onChange={handleAlphaNumeric("hsnCode")}
                      onBlur={() => validateField("hsnCode")}
                      error={!!errors.hsnCode}
                      helperText={errors.hsnCode}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="CGST:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.cgst ?? ""}
                      onChange={handleDecimalChange("cgst")}
                      onBlur={() => validateField("cgst")}
                      error={!!errors.cgst}
                      helperText={errors.cgst}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="SGST:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.sgst ?? ""}
                      onChange={handleDecimalChange("sgst")}
                      onBlur={() => validateField("sgst")}
                      error={!!errors.sgst}
                      helperText={errors.sgst}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                <FormRow label="Details:">
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    value={formData.details ?? ""}
                    onChange={handleTextChange("details")}
                    onBlur={() => validateField("details")}
                    error={!!errors.details}
                    helperText={errors.details}
                    sx={{ backgroundColor: 'background.paper' }}
                    disabled={readOnly}
                  />
                </FormRow>

                  <FormRow label="IGST:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.igst ?? ""}
                      onChange={handleDecimalChange("igst")}
                      onBlur={() => validateField("igst")}
                      error={!!errors.igst}
                      helperText={errors.igst}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>
                </Box>

              {/* COLUMN 3 */}
                 <Box className="form-column">
                  <FormRow label="Transit Days:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.transitDays ?? ""}
                      onChange={handleNumberChange("transitDays")}
                      onBlur={() => validateField("transitDays")}
                      error={!!errors.transitDays}
                      helperText={errors.transitDays}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Custom Duty:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.customDuty ?? ""}
                      onChange={handleDecimalChange("customDuty")}
                      onBlur={() => validateField("customDuty")}
                      error={!!errors.customDuty}
                      helperText={errors.customDuty}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="UOM:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.uom ?? ""}
                      onChange={handleAlphaNumeric("uom")}
                      onBlur={() => validateField("uom")}
                      error={!!errors.uom}
                      helperText={errors.uom}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Current Stock:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.currentStock ?? ""}
                      onChange={handleNumberChange("currentStock")}
                      onBlur={() => validateField("currentStock")}
                      error={!!errors.currentStock}
                      helperText={errors.currentStock}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Sales Price:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.salesPrice ?? ""}
                      onChange={handleDecimalChange("salesPrice")}
                      onBlur={() => validateField("salesPrice")}
                      error={!!errors.salesPrice}
                      helperText={errors.salesPrice}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Opening Value:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.openingValue ?? ""}
                      onChange={handleDecimalChange("openingValue")}
                      onBlur={() => validateField("openingValue")}
                      error={!!errors.openingValue}
                      helperText={errors.openingValue}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  {/* Substitute Item dropdown */}
                  <FormRow label="Substitute Item:">
                    <Select
                      fullWidth
                      size="small"
                      value={formData.substituteItem || ""}
                      onChange={handleChange("substituteItem")}
                      onBlur={() => validateField("substituteItem")}
                      error={!!errors.substituteItem}
                      sx={{ backgroundColor: 'background.paper' }}
                      displayEmpty
                      disabled={readOnly}
                    >
                      <MenuItem value="">
                        <em>Select Substitute</em>
                      </MenuItem>
                      {substituteItems.map((s) => (
                        <MenuItem key={s.Id} value={s.ItemCode}>
                           {s.ItemCode}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.substituteItem && (
                      <Box sx={{ color: 'error.main', fontSize: '12px', mt: 0.5 }}>
                        {errors.substituteItem}
                      </Box>
                    )}
                  </FormRow>

                  <FormRow label="Excise Head No:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.hsnCode ?? ""}
                      onChange={handleAlphaNumeric("hsnCode")}
                      onBlur={() => validateField("hsnCode")}
                      error={!!errors.hsnCode}
                      helperText={errors.hsnCode}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Quotation Currency:">
                    <Select
                      fullWidth
                      size="small"
                      value={formData.quotationCurrency ?? ""}
                      onChange={handleChange("quotationCurrency")}
                      onBlur={() => validateField("quotationCurrency")}
                      error={!!errors.quotationCurrency}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    >
                      <MenuItem value="Rs">Rs</MenuItem>
                      <MenuItem value="Euro">Euro</MenuItem>
                      <MenuItem value="Both">Both</MenuItem>
                    </Select>
                    {errors.quotationCurrency && (
                      <Box sx={{ color: 'error.main', fontSize: '12px', mt: 0.5 }}>{errors.quotationCurrency}</Box>
                    )}
                  </FormRow>

                  <FormRow label="Is BOM:">
                    <Select
                      fullWidth
                      size="small"
                      value={formData.isBom ? "1" : "0"}
                      onChange={(e) => setFormData({...formData, isBom: e.target.value === "1"})}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    >
                      <MenuItem value="0">No</MenuItem>
                      <MenuItem value="1">Yes</MenuItem>
                    </Select>
                  </FormRow>
                </Box>
               </Box>
                
      
        {/* BUTTONS */}
          <Box className="form-buttons">
            {!readOnly && (
              <Button variant="contained" className="save-btn" sx={{ width: 120 }} onClick={handleSubmit}>
                {editData ? "Update" : "Submit"}
              </Button>
            )}

          <Button
            variant="contained"
            className="cancel-btn"
            onClick={handleCancel}
          >

         {readOnly ? "Close" : "Cancel"}
        </Button>
          </Box>
      </Paper>
    </Box>
  );
};
export default ItemForm; 