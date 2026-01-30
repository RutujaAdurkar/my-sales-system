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
  statisticGroupId: "",
  openingStock: "",
  itemName: "",
  typeDesignation: "",
  itemCode: "",
  masterId: "",
  currentStock: "",
  ffhw: "",
  validity: "",
  basicPrice: "",
  storeLocation: "",
  reorderLevel: "",
  minLevel: "",
  maxLevel: "",
  make: "",
  factor: "",
  hsnCode: "",
  cgst: "",
  sgst: "",
  salesPrice: "",
  openingValue: "",
  deliveryCode: "",
  comments: "",
  substituteItem: "",
  exciseHeadNo: "",
  quotationFor: "Rs",
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
      statisticGroupId: editData.StatisticGroupId || "",
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
      storeLocation: editData.StoreLocation || "",
      deliveryCode: editData.DeliveryCode?.toString() || "",
      reorderLevel: editData.ReorderLevel?.toString() || "",
      minLevel: editData.MinLevel?.toString() || "",
      maxLevel: editData.MaxLevel?.toString() || "",
      make: editData.Make || "",
      factor: editData.Factor?.toString() || "",
      hsnCode: editData.HSNCode?.toString() || "",
      cgst: editData.CGST?.toString() || "",
      sgst: editData.SGST?.toString() || "",
      currentStock: editData.CurrentStock?.toString() || "",
      salesPrice: editData.SalesPrice?.toString() || "",
      openingValue: editData.OpeningValue?.toString() || "",
      comments: editData.Comments || "",
      substituteItem: editData.SubstituteItem || "",
      exciseHeadNo: editData.ExciseHeadNo || "",
      quotationFor: editData.QuotationFor || "Rs",
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
    if (/^\d*$/.test(v)) {
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

    // All fields are required
    if (v === "" || v === null || v === undefined || (typeof v === "string" && v.trim() === "")) {
      setErrors(prev => ({ ...prev, [field]: "Required" }));
      return false;
    }

    switch (field) {
      case "statisticGroupId":
      case "masterId":
      case "openingStock":
      case "itemName":
      case "itemCode":
      case "typeDesignation":
      case "quotationFor":
        // already checked for empty above
        break;

      case "basicPrice":
      case "salesPrice":
      case "openingValue":
      case "deliveryCode":
      case "reorderLevel":
      case "minLevel":
      case "maxLevel":
      case "make":
      case "transitDays":
      case "customDuty":
      case "factor":
      case "currentStock":
        if (v === "" || v === null || v === undefined) break; // allow empty unless required
        if (v.toString().trim() === "") break;
        if (!/^\d+(\.\d+)?$/.test(v)) msg = "Must be a non-negative number";
        break;

      case "hsnCode":
        if (v === "" || v === null || v === undefined) break;
        if (!/^\d+$/.test(v)) msg = "Must be numeric";
        break;

      case "cgst":
      case "sgst":
      case "igst":
        if (v === "" || v === null || v === undefined) break;
        if (!/^\d+(\.\d+)?$/.test(v)) msg = "Must be a number";
        else if (Number(v) < 0 || Number(v) > 100) msg = "Enter 0 - 100";
        break;

      case "validity":
        if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) msg = "Invalid date";
        break;

      case "itemCode":
      case "exciseHeadNo":
      case "storeLocation":
      case "ffhw":
        // allow alphanumeric; nothing to do here unless specific rule needed
        break;

      case "comments":
        if (v && v.length > 500) msg = "Max 500 chars";
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
  "statisticGroupId",
  "openingStock",
  "itemName",
  "itemCode",
  "typeDesignation",
  "masterId",
  "currentStock",
  "basicPrice",
  "salesPrice",
  "openingValue",
  "storeLocation",
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
  const numericFields = [
    "basicPrice","salesPrice","openingValue",
    "deliveryCode","reorderLevel",
    "minLevel","maxLevel","make",
    "transitDays","customDuty","factor","currentStock","uom"
  ];

  numericFields.forEach((f) => {
    const v = formData[f];
    if (v !== "" && v !== null && v !== undefined) {
      if (!/^\d+(\.\d+)?$/.test(v)) {
        newErrors[f] = "Must be a non-negative number";
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
  UOM: formData.uom || 1,
  StatisticGroupId: formData.statisticGroupId,
  OpeningStock: formData.openingStock,
  ItemName: formData.itemName,
  TypeDesignation: formData.typeDesignation,
  ItemCode: formData.itemCode,
  MasterId: formData.masterId,
  CurrentStock: Number(formData.currentStock),
  FF_HW: formData.ffhw,
  SalesPrice: Number(formData.salesPrice),
  DateOfValidity: formData.validity,
  BasicPrice: Number(formData.basicPrice),
  OpeningValue: Number(formData.openingValue),
  StoreLocation: formData.storeLocation,
  DeliveryCode: Number(formData.deliveryCode),
  ReorderLevel: Number(formData.reorderLevel),
  MinLevel: Number(formData.minLevel),
  MaxLevel: Number(formData.maxLevel),
  Make: formData.make,
  Factor: Number(formData.factor),
  HSNCode: Number(formData.hsnCode),
  CGST: Number(formData.cgst),
  SGST: Number(formData.sgst),
  IGST: Number(formData.igst),
  Comments: formData.comments,
  SubstituteItem: formData.substituteItem,
  ExciseHeadNo: formData.exciseHeadNo,
  QuotationFor: formData.quotationFor,
  TransitDays: Number(formData.transitDays),
  CustomDuty: Number(formData.customDuty),
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

    const data = await res.json();

    if (res.ok) {
      alert(recordId ? "✔ Item updated successfully!" : "✔ Item saved successfully!");
       
      if (onClose) onClose();
      else setFormData(initialFormState);
    } else {
      alert("❌ Failed: " + (data.error || "Unknown error"));
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
  className="form-paper"
  // sx={{
  //   width: "100%",
  //   overflow: "visible",
  //   minHeight: "auto"
  // }}
>

          <FormRow label="Statistic Group Id:">
            <Select
              fullWidth
              size="small"
              value={formData.statisticGroupId || ""}
              onChange={handleChange("statisticGroupId")}
              onBlur={() => validateField("statisticGroupId")}
              error={!!errors.statisticGroupId}
              sx={{ backgroundColor: 'background.paper' }}
              displayEmpty
              disabled={readOnly}
            >
              <MenuItem value="">
                <em>Select Group</em>
              </MenuItem>
              {statisticGroups.map((g) => (
                 <MenuItem key={g.GroupId} value={g.GroupId}>
                   {g.GroupName}
                 </MenuItem>
              ))}
            </Select>
            {errors.statisticGroupId && (
              <Box sx={{ color: 'error.main', fontSize: '12px', mt: 0.5 }}>{errors.statisticGroupId}</Box>
            )}
          </FormRow>

        {/* MAIN 3-COLUMN FORM */}
     <Box className="form-columns">
          {/* <Grid container spacing={2}>
             <Grid item xs={12} lg={4}> */}
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
                      value={formData.storeLocation ?? ""}
                      onChange={handleAlphaNumeric("storeLocation")}
                      onBlur={() => validateField("storeLocation")}
                      error={!!errors.storeLocation}
                      helperText={errors.storeLocation}
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
                      onChange={handleNumberChange("make")}
                      onBlur={() => validateField("make")}
                      error={!!errors.make}
                      helperText={errors.make}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Factor:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.factor ?? ""}
                      onChange={handleDecimalChange("factor")}
                      onBlur={() => validateField("factor")}
                      error={!!errors.factor}
                      helperText={errors.factor}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="HSN Code:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.hsnCode ?? ""}
                      onChange={handleNumberChange("hsnCode")}
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
                  <FormRow label="UOM:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.uom ?? ""}
                      onChange={handleNumberChange("uom")}
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
                      value={formData.exciseHeadNo ?? ""}
                      onChange={handleAlphaNumeric("exciseHeadNo")}
                      onBlur={() => validateField("exciseHeadNo")}
                      error={!!errors.exciseHeadNo}
                      helperText={errors.exciseHeadNo}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Quotation For:">
                    <Select
                      fullWidth
                      size="small"
                      value={formData.quotationFor ?? ""}
                      onChange={handleChange("quotationFor")}
                      onBlur={() => validateField("quotationFor")}
                      error={!!errors.quotationFor}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    >
                      <MenuItem value="Rs">Rs</MenuItem>
                      <MenuItem value="Euro">Euro</MenuItem>
                      <MenuItem value="Both">Both</MenuItem>
                    </Select>
                    {errors.quotationFor && (
                      <Box sx={{ color: 'error.main', fontSize: '12px', mt: 0.5 }}>{errors.quotationFor}</Box>
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