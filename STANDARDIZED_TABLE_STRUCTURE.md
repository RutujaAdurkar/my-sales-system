# Standardized Table Structure Implementation

## Overview
All tables in the application now follow a consistent, modern structure with unified styling, behavior, and features. The `StandardTable` component provides a reusable template for implementing this across the application.

## StandardTable Component
**Location:** `src/components/StandardTable.js`

### Features Included:
- ✅ Consistent title and branding
- ✅ Integrated search functionality
- ✅ Export and Add action buttons
- ✅ Multi-select checkboxes with select-all functionality
- ✅ Striped table rows with hover effects
- ✅ Pagination with customizable page size
- ✅ Action menu (View, Edit, Delete) per row
- ✅ Beautiful Material-UI styling

### Props:
```javascript
<StandardTable
  title="String"                    // Page title
  columns={Array}                   // Column definitions
  rows={Array}                      // Table data
  search={String}                   // Search text
  setSearch={Function}              // Search setter
  selectedRows={Array}              // Selected row IDs
  setSelectedRows={Function}        // Setter for selected rows
  onAdd={Function}                  // Add button callback
  onExport={Function}               // Export button callback
  onEdit={Function}                 // Edit action callback
  onView={Function}                 // View action callback
  onDelete={Function}               // Delete action callback
  showCheckbox={Boolean}            // Show/hide checkboxes (default: true)
  pageSize={Number}                 // Rows per page (default: 10)
/>
```

### Column Definition Format:
```javascript
const columns = [
  { 
    field: "fieldName",           // Data field name from row object
    headerName: "Display Name",   // Column header text
    width: 150                     // Column width (optional)
  }
];
```

## Implementation Examples

### CityMasterForm.js
✅ **Status:** Updated
- Uses StandardTable component
- Exports to Excel/CSV
- Full CRUD operations (Create, Read, Update, Delete)
- Search and filter functionality
- Multi-select export

### ItemMasterList.js
✅ **Status:** Updated
- Integrated with StandardTable
- Form modal integration for Add/Edit
- Row-level actions (View, Edit, Delete)
- Export functionality

### StateMasterForm.js
✅ **Status:** Updated
- StandardTable implementation
- Simple form with validation
- Export CSV and Excel formats
- Checkbox multi-select

## Table Structure Design

### Header Section
- **Title**: Large, blue (#0d47a1), bold text
- **Search Bar**: Left-aligned, icon-based, 300px width
- **Action Buttons**: Right-aligned
  - "Export Selected" button (blue, shows count when selected)
  - "+ Add [Record]" button (blue with Add icon)

### Table Styling
- **Header Row**: Light blue background (#e3f2fd) with bold text
- **Data Rows**: Alternating white/light gray background
- **Hover Effect**: Rows turn light blue on hover
- **Checkboxes**: First column for multi-select
- **Actions Column**: Three-dot menu per row

### Features
1. **Search**: Real-time filtering across all columns
2. **Pagination**: 5, 10, 25, 50 rows per page options
3. **Checkboxes**: Select/deselect individual or all rows
4. **Export**: Only selected rows exported to Excel
5. **Actions**: View (read-only), Edit, Delete per row

## CSS Classes (still compatible)
Old CSS files remain functional but styling is now primarily handled by Material-UI:
- `city-container`, `city-form`, `city-header`
- `state-container`, `state-form`, `state-header`
- `item-container`, `item-form`, `item-header`

## Usage Pattern

### Step 1: Import StandardTable
```javascript
import StandardTable from "../components/StandardTable";
```

### Step 2: Define columns
```javascript
const columns = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "name", headerName: "Name", width: 150 }
];
```

### Step 3: Render StandardTable
```javascript
<StandardTable
  title="My Table"
  columns={columns}
  rows={data}
  search={search}
  setSearch={setSearch}
  selectedRows={selectedRows}
  setSelectedRows={setSelectedRows}
  onAdd={() => { /* Add logic */ }}
  onEdit={(row) => { /* Edit logic */ }}
  onView={(row) => { /* View logic */ }}
  onDelete={(row) => { /* Delete logic */ }}
  onExport={() => { /* Export logic */ }}
/>
```

## Next Steps - Apply to Other Pages

### Report Pages to Update:
1. **PaymentFollowupReport.js**
   - Currently has filters and displays results in table
   - Should use StandardTable for consistent look

2. **FollowupTelephoneReportCustomerwise.js**
   - Report table display
   - Add StandardTable formatting

3. **TechnicalSupportReportCustomerwise.js**
   - Report listing
   - Implement StandardTable

4. **VideoSalesCallReportCustomerwise.js**
   - Report display
   - Use StandardTable component

5. **VisitReportCustomerwise.js**
   - Report table
   - Standardize with StandardTable

6. **ApplicationReportForm.js**
   - Form and table display
   - Apply StandardTable to table view

## Key Benefits

✅ **Consistency**: All tables look and behave the same way
✅ **Maintainability**: Single component to update instead of multiple
✅ **User Experience**: Familiar interface across the application
✅ **Development Speed**: Faster implementation of new tables
✅ **Responsive Design**: Material-UI handles responsive behavior
✅ **Accessibility**: Built-in accessibility features from MUI

## Database Field Mapping

The component expects row objects to have an `id`, `ID`, or `Id` field for selection tracking:
```javascript
// All these work:
{ id: 1, name: "City A" }
{ ID: 1, name: "City A" }
{ Id: 1, name: "City A" }
```

---

**Last Updated:** January 27, 2026
**Component Status:** Production Ready
