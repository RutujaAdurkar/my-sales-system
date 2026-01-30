# Quick Reference: Field Mapping

## Frontend Form Field → Database Column Mapping

| Frontend Field | Form State Key | Database Column | Type | Example |
|---|---|---|---|---|
| UOM | `uom` | UOM | INT | 1 |
| Statistic Group Id | `statisticGroupId` | StatisticGroupId | VARCHAR(50) | "GRP001" |
| Opening Stock | `openingStock` | OpeningStock | VARCHAR(50) | "SKU-001" |
| Item Name | `itemName` | ItemName | VARCHAR(100) | "Capacitor 10µF" |
| Type Designation | `typeDesignation` | TypeDesignation | VARCHAR(100) | "Electronic" |
| Item Code | `itemCode` | ItemCode | VARCHAR(20) | "IC-001" |
| Master Id | `masterId` | MasterId | VARCHAR(50) | "M001" |
| Current Stock | `currentStock` | CurrentStock | INT | 150 |
| FF_HW | `ffhw` | FF_HW | VARCHAR(50) | "Hardware" |
| Sales Price | `salesPrice` | SalesPrice | DECIMAL(18,2) | 25.50 |
| Date of Validity | `validity` | DateOfValidity | DATE | 2025-12-31 |
| Basic Price | `basicPrice` | BasicPrice | DECIMAL(18,2) | 20.00 |
| Opening Value | `openingValue` | OpeningValue | DECIMAL(18,2) | 3000.00 |
| Store Location | `storeLocation` | StoreLocation | VARCHAR(100) | "Shelf A1" |
| Delivery Code | `deliveryCode` | DeliveryCode | INT | 1 |
| Reorder Level | `reorderLevel` | ReorderLevel | INT | 50 |
| Min Level | `minLevel` | MinLevel | INT | 10 |
| Max Level | `maxLevel` | MaxLevel | INT | 500 |
| Make | `make` | Make | VARCHAR(100) | "Sony" |
| Factor | `factor` | Factor | DECIMAL(10,2) | 1.5 |
| HSN Code | `hsnCode` | HSNCode | VARCHAR(50) | "8542" |
| CGST | `cgst` | CGST | DECIMAL(10,2) | 9 |
| SGST | `sgst` | SGST | DECIMAL(10,2) | 9 |
| IGST | `igst` | IGST | DECIMAL(10,2) | 18 |
| Comments | `comments` | Comments | VARCHAR(MAX) | "Good quality" |
| Substitute Item | `substituteItem` | SubstituteItem | VARCHAR(100) | "IC-002" |
| Excise Head No | `exciseHeadNo` | ExciseHeadNo | VARCHAR(50) | "EX001" |
| Quotation For | `quotationFor` | QuotationFor | VARCHAR(20) | "Rs" |
| Transit Days | `transitDays` | TransitDays | INT | 5 |
| Custom Duty | `customDuty` | CustomDuty | DECIMAL(10,2) | 5.00 |
| Details | `details` | Details | VARCHAR(MAX) | "Product details here" |
| Is BOM | `isBom` | ISBOM | BIT | 0 or 1 |

## API Endpoints

### Get All Items
```
GET /api/itemmaster
```
Response: Array of ItemMaster records

### Create Item
```
POST /api/itemmaster
Content-Type: application/json

{
  "UOM": 1,
  "StatisticGroupId": "GRP001",
  "OpeningStock": "SKU-001",
  "ItemName": "Capacitor 10µF",
  "TypeDesignation": "Electronic",
  "ItemCode": "IC-001",
  "MasterId": "M001",
  "CurrentStock": 150,
  "FF_HW": "Hardware",
  "SalesPrice": 25.50,
  "DateOfValidity": "2025-12-31",
  "BasicPrice": 20.00,
  "OpeningValue": 3000.00,
  "StoreLocation": "Shelf A1",
  "DeliveryCode": 1,
  "ReorderLevel": 50,
  "MinLevel": 10,
  "MaxLevel": 500,
  "Make": "Sony",
  "Factor": 1.5,
  "HSNCode": "8542",
  "CGST": 9,
  "SGST": 9,
  "IGST": 18,
  "Comments": "Good quality",
  "SubstituteItem": "IC-002",
  "ExciseHeadNo": "EX001",
  "QuotationFor": "Rs",
  "TransitDays": 5,
  "CustomDuty": 5.00,
  "Details": "Product details here",
  "ISBOM": 1
}
```

### Update Item
```
PUT /api/itemmaster/:id
Content-Type: application/json

{
  // Same payload as POST
}
```

### Delete Item
```
DELETE /api/itemmaster/:id
```

## Testing the Integration

### 1. Start Services
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### 2. Access Application
```
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
```

### 3. Test Create Item
1. Navigate to Item Master page
2. Fill all required fields
3. Click Submit
4. Verify in database:
   ```sql
   SELECT TOP 10 * FROM ItemMaster ORDER BY ID DESC;
   ```

### 4. Test Update Item
1. Click Edit on an item
2. Modify values
3. Click Update
4. Verify changes in database

### 5. Test Delete Item
1. Click Delete on an item
2. Confirm deletion
3. Verify item removed from database

## Database Query to Verify Structure
```sql
USE Compny;
GO

SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'ItemMaster'
ORDER BY ORDINAL_POSITION;
```

## Common Issues & Solutions

### Issue: Data not saving
**Solution:** 
- Check browser console for errors
- Verify backend is running: `curl http://localhost:5000/api/itemmaster`
- Check database connection in backend logs
- Verify all required fields are filled

### Issue: Wrong column names error
**Solution:**
- Ensure MSSQL table has been updated with new column names
- Verify all renames were applied correctly
- Check database structure matches ItemForm.js payload

### Issue: Validation errors
**Solution:**
- Ensure numeric fields (prices, quantities) are valid numbers
- Date fields must be in YYYY-MM-DD format
- HSNCode and other codes must be alphanumeric

