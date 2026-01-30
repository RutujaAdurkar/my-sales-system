# Item Master - Database Connection Update Summary

## Changes Made to Connect Frontend & Backend with Updated MSSQL Table

### Database Column Renames (SQL Schema Already Applied)
- `MenuID` → `UOM`
- `ArticleNo` → `OpeningStock` 
- `Units` → `CurrentStock`
- `Value` → `OpeningValue`
- `OpeningQty` → `DeliveryCode`
- `CustReorder` → `Make`
- `ProductInFocus` → `Details`
- `SelectionCode` → `ItemCode`
- `NetPrice` → `SalesPrice`
- `TypeSelection` → Removed (no longer in database)
- `ISBOM` column added (BIT, DEFAULT 0)

### Frontend Changes - ItemForm.js

**Updated initialFormState:**
```javascript
const initialFormState = {
  uom: "",
  statisticGroupId: "",
  openingStock: "",
  itemName: "",          // NEW
  typeDesignation: "",
  itemCode: "",          // RENAMED from selectionCode
  masterId: "",
  currentStock: "",      // RENAMED from units
  ffhw: "",
  validity: "",
  basicPrice: "",
  storeLocation: "",
  reorderLevel: "",
  minLevel: "",
  maxLevel: "",
  make: "",              // RENAMED from custReorder
  factor: "",
  hsnCode: "",
  cgst: "",
  sgst: "",
  salesPrice: "",        // RENAMED from netPrice
  openingValue: "",      // RENAMED from value
  deliveryCode: "",      // RENAMED from openingQty
  comments: "",
  substituteItem: "",
  exciseHeadNo: "",
  quotationFor: "Rs",
  transitDays: "",
  customDuty: "",
  details: "",           // RENAMED from productFocus
  igst: "",
  isBom: false,          // NEW
};
```

**Updated handleSubmit payload:**
- All form fields now map to correct database column names
- `formData.isBom` converts to 1 or 0 for ISBOM column

**New form fields added:**
- Item Name input field
- Item Code input field  
- UOM input field
- Current Stock input field
- Sales Price input field
- Opening Value input field
- Delivery Code input field
- Make input field
- Details textarea field
- Is BOM dropdown (Yes/No)

**Form fields removed/replaced:**
- Removed: Article No → Replaced with Opening Stock
- Removed: TypeSelection dropdown
- Removed: Selection Code → Replaced with Item Code
- Removed: Units dropdown → Replaced with Current Stock
- Removed: Net Price → Replaced with Sales Price
- Removed: Value → Replaced with Opening Value
- Removed: Opening Qty → Replaced with Delivery Code
- Removed: Cust. Reorder → Replaced with Make
- Removed: Product In Focus → Replaced with Details

### Backend Changes - itemModule.js

**Updated insertItem function:**
- Removed `TypeSelection` parameter
- Added `ItemName` parameter
- All parameters now match new column names:
  - `MenuID` → `UOM`
  - `ArticleNo` → `OpeningStock`
  - `Units` → `CurrentStock`
  - `Value` → `OpeningValue`
  - `OpeningQty` → `DeliveryCode`
  - `CustReorder` → `Make`
  - `ProductInFocus` → `Details`
  - `SelectionCode` → `ItemCode`
  - `NetPrice` → `SalesPrice`
  - Added: `ISBOM`

**Updated updateItem function:**
- Same updates as insertItem for consistency
- Removed `TypeSelection` from UPDATE query
- Added `ItemName` to UPDATE query

### How to Test

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test Item Creation:**
   - Navigate to Item Master page
   - Fill in all form fields with proper data
   - Click Submit
   - Data should be saved to MSSQL ItemMaster table

4. **Test Item Update:**
   - Click Edit on an existing item
   - Modify fields
   - Click Update
   - Changes should reflect in database

5. **Verify Database:**
   ```sql
   SELECT * FROM ItemMaster;
   ```

### Files Modified
1. `frontend/src/pages/ItemForm.js` - Updated form fields, initialState, and handleSubmit payload
2. `backend/modules/itemModule.js` - Updated insertItem and updateItem functions

### Notes
- All numeric values are properly converted using Number() in the payload
- ISBOM is converted from boolean to 1/0 for database storage
- null coalescing operator (??) used for null safety in backend
- TypeSelection has been completely removed from both frontend and backend

