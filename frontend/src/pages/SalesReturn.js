import { useState, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem
} from "@mui/material";
import "./SalesReturn.css";
import axios from "axios";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function SalesReturn() {

// ===== ITEM ENTRY STATE =====
const [srNo, setSrNo] = useState(1);
const [itemCode, setItemCode] = useState("");
const [itemName, setItemName] = useState("");
const [itemDetails, setItemDetails] = useState("");

const [itemCgst, setItemCgst] = useState(0);
const [itemSgst, setItemSgst] = useState(0);
const [itemIgst, setItemIgst] = useState(0);

const [qty, setQty] = useState(0);
const [purchaseCost, setPurchaseCost] = useState(0);
const [rate, setRate] = useState(0);

const [items, setItems] = useState([]);

  // ===== BASIC FORM STATE =====
const [salesReturnNo, setSalesReturnNo] = useState("");
const [salesReturnDate, setSalesReturnDate] = useState("");
const [customer, setCustomer] = useState("");
const [docNo, setDocNo] = useState("");
const [docDate, setDocDate] = useState("");
const [narration, setNarration] = useState("");
const [invoiceCancel, setInvoiceCancel] = useState(false);

  // ===== GST STATE =====
const [packingPer, setPackingPer] = useState("");
const [packing, setPacking] = useState("");
const [freight, setFreight] = useState("");

const [cgst, setCgst] = useState(0);
const [sgst, setSgst] = useState(0);
const [igst, setIgst] = useState(0);

// ===== VALIDATION ERRORS =====
const [errors, setErrors] = useState({});

// ===== TOAST STATE =====
const [toast, setToast] = useState({
  open: false,
  message: "",
  severity: "success" // success | warning | error
});

// ===== SAVE FLAG =====
const [isSaved, setIsSaved] = useState(false);

// totals
const totalCgst = cgst || 0;
const totalSgst = sgst || 0;
const totalIgst = igst || 0;
const grandTotal = Number(totalCgst) + Number(totalSgst) + Number(totalIgst);

const validateForm = () => {
  let newErrors = {};

  if (!salesReturnDate) newErrors.salesReturnDate = "Date required";
  if (!customer) newErrors.customer = "Customer required";
  if (!docNo) newErrors.docNo = "Document No required";
  if (items.length === 0) newErrors.items = "At least one item required";

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

const handleSave = async () => {

  //  already saved
  if (isSaved) {
    showToast("This Sales Return is already saved", "warning");
    return;
  }

  if (!validateForm()) return;

  const payload = {
    salesReturnNo,
    salesReturnDate,
    customer,
    docNo,
    docDate,

    packingPer,
    packing,
    freight,

    cgst,
    sgst,
    igst,

    totalCgst,
    totalSgst,
    totalIgst,
    grandTotal,

    narration,
    invoiceCancel,

     items   // ✅ ADD THIS
  };

  try {
    await axios.post(
      "http://localhost:5000/api/sales-return/save",
      payload
    );
    showToast("Sales Return Saved Successfully", "success");
    setIsSaved(true);

  } catch (error) {
    console.error(error);
    showToast("Save Failed", "error");

  }
};

const handleCancel = () => {
  // Basic fields
  setSalesReturnNo("");
  setSalesReturnDate("");
  setCustomer("");
  setDocNo("");
  setDocDate("");

  // GST & amounts
  setPackingPer("");
  setPacking("");
  setFreight("");

  setCgst(0);
  setSgst(0);
  setIgst(0);

  // Other
  setNarration("");
  setInvoiceCancel(false);

  // OPTIONAL: scroll to top like ERP
  window.scrollTo(0, 0);

  setIsSaved(false);

};

const addItemToTable = () => {
  if (!itemCode) {
    alert("Item Code required");
    return;
  }

  if (qty <= 0) {
    alert("Quantity must be greater than 0");
    return;
  }

  if (rate <= 0) {
    alert("Rate must be greater than 0");
    return;
  }

  const amount = qty * rate;

  const newItem = {
    srNo,
    itemCode,
    itemName,
    cgst: itemCgst,
    sgst: itemSgst,
    igst: itemIgst,
    qty,
    purchaseCost,
    rate,
    amount,
    details: itemDetails
  };

  setItems(prev => [...prev, newItem]);

  // reset for next item
  setSrNo(prev => prev + 1);
  setItemCode("");
  setItemName("");
  setItemDetails("");
  setItemCgst(0);
  setItemSgst(0);
  setItemIgst(0);
  setQty(0);
  setPurchaseCost(0);
  setRate(0);
};

const showToast = (message, severity = "success") => {
  setToast({
    open: true,
    message,
    severity
  });
};

  return (
    <Box className="sr-container">
      <Paper
        className="sr-paper"
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? "#2b2b2b" : "#e6e6e6",
          color: theme.palette.text.primary
        })}
      >
        {/* ================= HEADER ================= */}
        <Typography className="sr-title">Sales Return</Typography>

        {/* ================= TOP SECTION ================= */}
        <Box className="sr-grid">
          <FormRow label="Sales Return No.">
            <TextField
              size="small"
              value={salesReturnNo}
              onChange={(e) => setSalesReturnNo(e.target.value)}
            />

          </FormRow>

          <FormRow label="Date">
            <TextField
              type="date"
              size="small"
              value={salesReturnDate}
              onChange={(e) => setSalesReturnDate(e.target.value)}
            />

          </FormRow>

          <FormRow label="Customer">
           <TextField
             select
             size="small"
             fullWidth
             value={customer}
             error={!!errors.customer}
             helperText={errors.customer}
             onChange={(e) => setCustomer(e.target.value)}
           >


              <MenuItem value="">Select</MenuItem>
              <MenuItem value="C1">Customer 1</MenuItem>
              <MenuItem value="C2">Customer 2</MenuItem>
            </TextField>
          </FormRow>

          <FormRow label="Doc Date">
            <TextField
              type="date"
              size="small"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
            />

          </FormRow>

          <FormRow label="Doc No.">
            <TextField
              size="small"
              value={docNo}
              onChange={(e) => setDocNo(e.target.value)}
            />

          </FormRow>

          {/* Checkbox */}
          <Box className="form-row checkbox-row">
            <Checkbox size="small" />
            <Typography className="checkbox-label">
              Remove Packing Charges
            </Typography>
          </Box>
        </Box>

        {/* ================= ITEM ENTRY ================= */}
        <Box className="sr-item-section">
          {/* LEFT */}
          <Box>
            <FormRow label="Sr No">
              <TextField
                 size="small"
                 value={srNo}
                 InputProps={{ readOnly: true }}
              />
            </FormRow>

            <FormRow label="Item Code">
              <TextField
                size="small"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
              />

            </FormRow>
            <FormRow label="Name">
              <TextField
                size="small"
                value={itemName}
                onChange={(e) => {
                const val = e.target.value.toUpperCase();
                if (/^[A-Z ]*$/.test(val)) setItemName(val);
                }}
              />
            </FormRow>
            <FormRow label="CGST %">
              <TextField
                size="small"
                type="number"
                value={itemCgst}
                onChange={(e) => {
                setItemCgst(Number(e.target.value) || 0);
                setItemIgst(0);
                }}
               disabled={itemIgst > 0}
              />

            </FormRow>
            <FormRow label="SGST %">
             <TextField
               size="small"
               type="number"
               value={itemSgst}
               onChange={(e) => {
               setItemSgst(Number(e.target.value) || 0);
               setItemIgst(0);
               }}
              disabled={itemIgst > 0}
             />

            </FormRow>
            <FormRow label="IGST %">
              <TextField
                size="small"
                type="number"
                value={itemIgst}
                onChange={(e) => {
                setItemIgst(Number(e.target.value) || 0);
                setItemCgst(0);
                setItemSgst(0);
                }}
               disabled={itemCgst > 0 || itemSgst > 0}
              />

            </FormRow>

            <Box className="btn-row">
              <Button variant="outlined" size="small">Pending Bills</Button>
              <Button variant="outlined" size="small">Invoices</Button>
            </Box>
          </Box>

          {/* CENTER */}
          <Box>
            <Typography className="section-label">Details</Typography>
            <TextField
              multiline
              rows={5}
              fullWidth
              value={itemDetails}
              onChange={(e) => setItemDetails(e.target.value)}
            />

          </Box>

          {/* RIGHT */}
          <Box>
            <FormRow label="Quantity">
              <TextField
                size="small"
                type="number"
                value={qty}
                error={qty <= 0}
                helperText={qty <= 0 ? "Qty > 0" : ""}
                onChange={(e) => {
                 const val = Number(e.target.value);
                 if (val >= 0) setQty(val);
                }}
              />

            </FormRow>
            <FormRow label="Purchase Cost">
              <TextField
                size="small"
                type="number"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(Number(e.target.value) || 0)}
              />

            </FormRow>
            <FormRow label="Amount">
             <TextField
               size="small"
               value={qty * rate}
               InputProps={{ readOnly: true }}
             />
            </FormRow>

            <FormRow label="Rate">
             <TextField
               size="small"
               type="number"
               value={rate}
               error={rate <= 0}
               helperText={rate <= 0 ? "Rate > 0" : ""}
               onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0) setRate(val);
               }}
               onKeyDown={(e) => e.key === "Enter" && addItemToTable()}
              />


            </FormRow>
          </Box>
        </Box>

        {/* ================= TABLE ================= */}
        <Table size="small" className="sr-table">
          <TableHead>
           <TableRow>
             <TableCell>Sr No</TableCell>
             <TableCell>Item Code</TableCell>
             <TableCell>Item Name</TableCell>
             <TableCell>CGST %</TableCell>
             <TableCell>SGST %</TableCell>
             <TableCell>IGST %</TableCell>
             <TableCell>Quantity</TableCell>
             <TableCell>Purchase Cost</TableCell>
             <TableCell>Rate</TableCell>
             <TableCell>Amount</TableCell>
             <TableCell>Details</TableCell>
           </TableRow>

          </TableHead>
         <TableBody>
           {items.map((row, index) => (
           <TableRow key={index}>
             <TableCell>{row.srNo}</TableCell>
             <TableCell>{row.itemCode}</TableCell>
             <TableCell>{row.itemName}</TableCell>
             <TableCell>{row.cgst}</TableCell>
             <TableCell>{row.sgst}</TableCell>
             <TableCell>{row.igst}</TableCell>
             <TableCell>{row.qty}</TableCell>
             <TableCell>{row.purchaseCost}</TableCell>
             <TableCell>{row.rate}</TableCell>
             <TableCell>{row.amount}</TableCell>
             <TableCell>{row.details}</TableCell>
          </TableRow>
          ))}
         </TableBody>

        </Table>

        {errors.items && (
         <Typography color="error" fontSize={12}>
           {errors.items}
         </Typography>
       )}


        {/* ================= BOTTOM ERP (WINFORMS STYLE) ================= */}
<Box className="sr-bottom-win">

  {/* LEFT : Narration */}
  <Box className="sr-bottom-left">
    <Typography className="erp-label">Narration</Typography>
    <TextField
      multiline
      rows={4}
      size="small"
      className="narration-box"
      value={narration}
      onChange={(e) => setNarration(e.target.value)}
    />

    <Box className="invoice-cancel-row">
      <Checkbox
        size="small"
        checked={invoiceCancel}
        onChange={(e) => setInvoiceCancel(e.target.checked)}
      />

      <Typography className="invoice-cancel-label">
        Invoice Cancel
      </Typography>
    </Box>
  </Box>

  {/* CENTER : Packing / Freight */}
  <Box className="sr-bottom-center">
    <Box className="erp-row">
      <Typography className="erp-label">Packing Per</Typography>
      <TextField
        size="small"
        className="small-input"
        value={packingPer}
        onChange={(e) => setPackingPer(e.target.value)}
      />


      <Typography className="erp-label">Packing</Typography>
      <TextField
        size="small"
        className="small-input"
        value={packing}
        onChange={(e) => setPacking(e.target.value)}
      />

      <Typography className="erp-label">CGST</Typography>
     <TextField
       size="small"
       className="tax-input"
       type="number"
       value={cgst}
       onChange={(e) => {
       setCgst(Number(e.target.value) || 0);
       setIgst(0);
       }}
      disabled={igst > 0}
    />

      <Typography className="erp-label">SGST</Typography>
      <TextField
        size="small"
        className="tax-input"
        type="number"
        value={sgst}
        onChange={(e) => {
        setSgst(Number(e.target.value) || 0);
        setIgst(0);
        }}
       disabled={igst > 0}
      />

      <Typography className="erp-label">IGST</Typography>
      <TextField
        size="small"
        className="tax-input"
        type="number"
        value={igst}
        onChange={(e) => {
        setIgst(Number(e.target.value) || 0);
        setCgst(0);
        setSgst(0);
        }}
       disabled={cgst > 0 || sgst > 0}
      />

    </Box>

    <Box className="erp-row">
      <Typography className="erp-label">Freight</Typography>
      <TextField
        size="small"
        className="small-input"
        value={freight}
        onChange={(e) => setFreight(e.target.value)}
      />
      <Typography className="erp-label">CGST</Typography>
      <TextField size="small" className="tax-input" />

      <Typography className="erp-label">SGST</Typography>
      <TextField size="small" className="tax-input" />

      <Typography className="erp-label">IGST</Typography>
      <TextField size="small" className="tax-input" />
    </Box>
  </Box>

  {/* RIGHT : TOTALS */}
  <Box className="sr-bottom-right">
    <TotalRow label="Total CGST" value={totalCgst} />
    <TotalRow label="Total SGST" value={totalSgst} />
    <TotalRow label="Total IGST" value={totalIgst} />
    <TotalRow label="Total" value={grandTotal} bold />
  </Box>

</Box>

        {/* ================= FOOTER ================= */}
        <Box className="sr-footer">
         <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          disabled={isSaved}
          >
          {isSaved ? "Saved" : "Save"}
         </Button>


          <Button
            variant="outlined"
            size="small"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Box className="lock-row">
            <Checkbox size="small" /> Lock YES/NO
          </Box>
        </Box>
        <Snackbar
         open={toast.open}
         autoHideDuration={3000}
         onClose={() => setToast({ ...toast, open: false })}
         anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
         >
           {toast.message}
        </MuiAlert>
       </Snackbar>

      </Paper>
    </Box>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const FormRow = ({ label, children }) => (
  <Box className="form-row">
    <Typography className="form-label">{label}</Typography>
    {children}
  </Box>
);

const TotalRow = ({ label, value, bold }) => (
  <Box className="total-row">
    <Typography className={bold ? "total-label bold" : "total-label"}>
      {label}
    </Typography>
    <TextField
       size="small"
       value={value}
       InputProps={{ readOnly: true }}
     />

  </Box>
);
