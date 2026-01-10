import React, { useState, useEffect } from "react";
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
  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, gap: 2 }}>
    <Box sx={{ width: { xs: '90px', sm: '110px' }, fontWeight: 600, fontSize: "13px" }}>
      {label}
    </Box>
    <Box sx={{ flexGrow: 1 }}>{children}</Box>
  </Box>
);

// initial form state (for reset)
const initialFormState = {
  statisticGroupId: "",
  articleNo: "",
  typeDesignation: "",
  masterId: "",
  ffhw: "",
  validity: "",
  basicPrice: "",
  storeLocation: "",
  openingQty: "",
  reorderLevel: "",
  minLevel: "",
  maxLevel: "",
  custReorder: "",
  factor: "",
  hsnCode: "",
  cgst: "",
  sgst: "",
  typeSelection: "Component",
  selectionCode: "",
  units: "Nos",
  netPrice: "",
  value: "",
  comments: "",
  substituteItem: "",
  exciseHeadNo: "",
  quotationFor: "Rs",
  transitDays: "",
  customDuty: "",
  productFocus: "",
  igst: "",
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
      statisticGroupId: editData.StatisticGroupId || "",
      articleNo: editData.ArticleNo || "",
      typeDesignation: editData.TypeDesignation || "",
      masterId: editData.MasterId || "",
      ffhw: editData.FF_HW || "",
      validity: editData.DateOfValidity
        ? editData.DateOfValidity.slice(0, 10)
        : "",
      basicPrice: editData.BasicPrice?.toString() || "",
      storeLocation: editData.StoreLocation || "",
      openingQty: editData.OpeningQty?.toString() || "",
      reorderLevel: editData.ReorderLevel?.toString() || "",
      minLevel: editData.MinLevel?.toString() || "",
      maxLevel: editData.MaxLevel?.toString() || "",
      custReorder: editData.CustReorder?.toString() || "",
      factor: editData.Factor?.toString() || "",
      hsnCode: editData.HSNCode?.toString() || "",
      cgst: editData.CGST?.toString() || "",
      sgst: editData.SGST?.toString() || "",
      typeSelection: editData.TypeSelection || "Component",
      selectionCode: editData.SelectionCode || "",
      units: editData.Units || "Nos",
      netPrice: editData.NetPrice?.toString() || "",
      value: editData.Value?.toString() || "",
      comments: editData.Comments || "",
      substituteItem: editData.SubstituteItem || "",
      exciseHeadNo: editData.ExciseHeadNo || "",
      quotationFor: editData.QuotationFor || "Rs",
      transitDays: editData.TransitDays?.toString() || "",
      customDuty: editData.CustomDuty?.toString() || "",
      productFocus: editData.ProductInFocus || "",
      igst: editData.IGST?.toString() || "",
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
      case "articleNo":
      case "typeDesignation":
      case "typeSelection":
      case "units":
      case "quotationFor":
        // already checked for empty above
        break;

      case "basicPrice":
      case "netPrice":
      case "value":
      case "openingQty":
      case "reorderLevel":
      case "minLevel":
      case "maxLevel":
      case "custReorder":
      case "transitDays":
      case "customDuty":
      case "factor":
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

      case "selectionCode":
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
  "articleNo",
  "typeDesignation",
  "masterId",
  "typeSelection",
  "units",
  "basicPrice",
  "netPrice",
  "value",
  "storeLocation",
  "openingQty",
  "reorderLevel",
  "minLevel",
  "maxLevel",
  "productFocus"
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
    "basicPrice","netPrice","value",
    "openingQty","reorderLevel",
    "minLevel","maxLevel","custReorder",
    "transitDays","customDuty","factor"
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
  MenuID: 1,
  StatisticGroupId: formData.statisticGroupId,
  ArticleNo: formData.articleNo,
  TypeSelection: formData.typeSelection,
  TypeDesignation: formData.typeDesignation,
  SelectionCode: formData.selectionCode,
  MasterId: formData.masterId,
  Units: formData.units,
  FF_HW: formData.ffhw,
  NetPrice: Number(formData.netPrice),
  DateOfValidity: formData.validity,
  BasicPrice: Number(formData.basicPrice),
  Value: Number(formData.value),
  StoreLocation: formData.storeLocation,
  OpeningQty: Number(formData.openingQty),
  ReorderLevel: Number(formData.reorderLevel),
  MinLevel: Number(formData.minLevel),
  MaxLevel: Number(formData.maxLevel),
  CustReorder: Number(formData.custReorder),
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
  ProductInFocus: formData.productFocus   // FIXED
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
  <Box sx={{ width: "100%", p: 2 }}>
    {/* 🔙 Back To Table Button */}
    {onClose && (
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
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
      sx={{
        borderRadius: 2,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        bgcolor: "background.paper",
      }}
    >
      {/* ... existing form code ... */}

      

      <Grid container spacing={2} columns={12}>
        {/* Statistic Group Id DROPDOWN (full width row) */}
        <Grid item xs={12}>
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
        </Grid>

        {/* MAIN 3-COLUMN FORM */}
        <Grid item xs={12} >
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.default',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid
              container
              spacing={2}
              columns={12}
              sx={{ display: "flex", alignItems: "stretch" }}
            >
              {/* COLUMN 1 */}
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Box>
                  <FormRow label="Article No:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.articleNo ?? ""}
                      onChange={handleAlphaNumeric("articleNo")}
                      onBlur={() => validateField("articleNo")}
                      error={!!errors.articleNo}
                      helperText={errors.articleNo}
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

                  <FormRow label="Opening Qty:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.openingQty ?? ""}
                      onChange={handleNumberChange("openingQty")}
                      onBlur={() => validateField("openingQty")}
                      error={!!errors.openingQty}
                      helperText={errors.openingQty}
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

                <Box sx={{ flexGrow: 1 }} />
              </Grid>

              {/* COLUMN 2 */}
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Box>
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

                  <FormRow label="Cust. Reorder:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.custReorder ?? ""}
                      onChange={handleNumberChange("custReorder")}
                      onBlur={() => validateField("custReorder")}
                      error={!!errors.custReorder}
                      helperText={errors.custReorder}
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

                <FormRow label="Product In Focus:">
                  <Select
                    fullWidth
                    size="small"
                    value={formData.productFocus ?? ""}
                    onChange={handleChange("productFocus")}
                    displayEmpty
                    disabled={readOnly}
                  >

                 <MenuItem value="">
                   <em>Select Focus</em>
                 </MenuItem>

                {productFocusOptions.map((p) => (
                  <MenuItem
                    key={p.ItemCode}
                     value={p.ItemCode}   // number
                  >
                   {p.ItemCode}
                  </MenuItem>
               ))}
              </Select>
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

                <Box sx={{ flexGrow: 1 }} />
              </Grid>

              {/* COLUMN 3 */}
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Box>
                  <FormRow label="Type Selection:">
                    <Select
                      fullWidth
                      size="small"
                      value={formData.typeSelection ?? ""}
                      onChange={handleChange("typeSelection")}
                      displayEmpty
                      disabled={readOnly}
                    >
                    <MenuItem value="" >
                      <em>Select Type</em>
                    </MenuItem>

                    {typeSelections.map((t) => (
                       <MenuItem key={t.TypeId} value={t.TypeName}>
                          {t.TypeName}
                       </MenuItem>
                    ))}
                    </Select>
                    {errors.typeSelection && (
                      <Box sx={{ color: 'error.main', fontSize: '12px', mt: 0.5 }}>{errors.typeSelection}</Box>
                    )}
                  </FormRow>

                  <FormRow label="Selection Code:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.selectionCode ?? ""}
                      onChange={handleAlphaNumeric("selectionCode")}
                      onBlur={() => validateField("selectionCode")}
                      error={!!errors.selectionCode}
                      helperText={errors.selectionCode}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Units:">
                    <Select
                      fullWidth
                      size="small"
                      value={formData.units ?? ""}
                      onChange={handleChange("units")}
                      onBlur={() => validateField("units")}
                      error={!!errors.units}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    >
                      <MenuItem value="Nos">Nos</MenuItem>
                      <MenuItem value="Set">Set</MenuItem>
                      <MenuItem value="Kg">Kg</MenuItem>
                    </Select>
                    {errors.units && (
                      <Box sx={{ color: 'error.main', fontSize: '12px', mt: 0.5 }}>{errors.units}
                      </Box>
                    )}
                  </FormRow>

                  <FormRow label="Net Price:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.netPrice ?? ""}
                      onChange={handleDecimalChange("netPrice")}
                      onBlur={() => validateField("netPrice")}
                      error={!!errors.netPrice}
                      helperText={errors.netPrice}
                      sx={{ backgroundColor: 'background.paper' }}
                      disabled={readOnly}
                    />
                  </FormRow>

                  <FormRow label="Value:">
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.value ?? ""}
                      onChange={handleDecimalChange("value")}
                      onBlur={() => validateField("value")}
                      error={!!errors.value}
                      helperText={errors.value}
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
                </Box>

                <Box sx={{ flexGrow: 1 }} />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* BUTTONS */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 3 }}>
            {!readOnly && (
              <Button variant="contained" sx={{ width: 120 }} onClick={handleSubmit}>
                {editData ? "Update" : "Submit"}
              </Button>
            )}

            <Button
             variant="contained"
             color="error"
             sx={{
             width: 120,
             bgcolor: "#d32f2f",        // Red
             color: "#fff",
             "&:hover": {
             bgcolor: "#b71c1c",      // Darker red on hover
             },
            }}
           onClick={handleCancel}
          >
         {readOnly ? "Close" : "Cancel"}
        </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
    </Box>
  );
};

export default ItemForm;