# Calendar Export Functionality

## Overview
The TeamCalendarView in CalendarScreen.tsx now supports exporting calendar data in both CSV and PDF formats.

## Features

### CSV Export
- Exports calendar data in a tabular format
- Columns include:
  - **Datum** (Date): Formatted as DD.MM.YYYY
  - **Mitarbeiter** (Employee): Employee name
  - **Typ** (Type): Entry type (Urlaub, Krankheit, Meeting, etc.)
  - **Stunden** (Hours): Working hours (if applicable)
  - **Status**: Request status (Beantragt, Genehmigt, Abgelehnt)
- UTF-8 encoded with BOM for proper character display in Excel
- Filename format: `Kalender_YYYY-MM.csv` (month view) or `Kalender_YYYY.csv` (year view)

### PDF Export
- Creates professionally formatted calendar views
- **Month View**:
  - Calendar grid layout with days as columns
  - Color-coded cells matching the on-screen display
  - Abbreviations for entry types (U = Urlaub, K = Krankheit, etc.)
  - Legend included at the bottom
  - Portrait orientation
- **Year View**:
  - Summary table showing totals per employee
  - Columns for each entry type showing total days
  - Total working hours per employee
  - Landscape orientation
- Filename format: `Kalender_YYYY-MM.pdf` (month view) or `Kalender_YYYY.pdf` (year view)

## Implementation Details

### Libraries Used
- **react-csv**: For CSV generation (installed but functionality implemented manually for more control)
- **jspdf**: For PDF document generation
- **jspdf-autotable**: For creating tables in PDFs

### Key Files
1. **`/src/utils/exportCalendar.ts`**: Core export functionality
   - `exportToCSV()`: Handles CSV generation and download
   - `exportToPDF()`: Handles PDF generation with different layouts for month/year views

2. **`/src/screens/CalendarScreen.tsx`**: Integration with UI
   - Export buttons connected to export functions
   - Passes filtered calendar data based on selected team and view

### Data Flow
1. Calendar entries are filtered based on:
   - Selected team (all teams or specific team)
   - User permissions (admins see all, others see only their teams)
   - Selected view (month or year)

2. Export functions receive:
   - Filtered calendar entries
   - Date range based on current view
   - List of users to include
   - Current view type and selected month

3. Export generates appropriate format and triggers browser download

## Usage

### For Users
1. Navigate to the Calendar screen
2. Select desired view (Month/Year)
3. Optionally filter by team
4. Click the export button:
   - **📄 PDF** button for PDF export
   - **📊 CSV** button for CSV export
5. The file will download automatically

### For Developers

#### Testing Export Functions
```javascript
// In browser console while app is running:
window.testCSVExport();  // Test CSV export with sample data
window.testPDFExport();  // Test PDF export with sample data
```

#### Adding New Export Formats
1. Add new export function in `/src/utils/exportCalendar.ts`
2. Follow the pattern of existing functions
3. Add new button in CalendarScreen.tsx
4. Connect button to new export function

## Color Coding (PDF)
- **Green (#9df09d)**: Vacation (Urlaub)
- **Black (#000000)**: Sick leave (Krankheit)
- **Blue (#5b8df6)**: Meeting
- **Orange (#ffc966)**: Training (Fortbildung)
- **Red (#f55959)**: Special leave (Sonderurlaub)
- **Light Blue (#98c1f2)**: Full-time work (8+ hours)
- **Yellow (#f7d560)**: Part-time work (6-8 hours)
- **Light Red (#f2a19e)**: Under 6 hours work

## Future Enhancements
- Export filters (date range selection)
- Email export functionality
- Excel format support (.xlsx)
- Custom templates for different departments
- Scheduled automatic exports
- Integration with calendar applications (iCal format)