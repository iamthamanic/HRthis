import { CalendarEntry } from '../types/calendar';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

/**
 * Type map for display names (German)
 */
const typeDisplayMap: Record<string, string> = {
  urlaub: 'Urlaub',
  krank: 'Krankheit',
  meeting: 'Meeting',
  fortbildung: 'Fortbildung',
  ux: 'Sonderurlaub',
  zeit: 'Arbeitszeit'
};

/**
 * Status map for display names (German)
 */
const statusDisplayMap: Record<string, string> = {
  beantragt: 'Beantragt',
  genehmigt: 'Genehmigt',
  abgelehnt: 'Abgelehnt'
};

/**
 * Export calendar data as CSV
 * @param entries - Calendar entries to export
 * @param dateRange - Date range for the export
 * @param users - List of users to include
 * @param view - Current view (month or year)
 * @param selectedMonth - Currently selected month
 */
export const exportToCSV = (
  entries: CalendarEntry[],
  dateRange: Date[],
  users: { userId: string; userName: string }[],
  view: 'monat' | 'jahr',
  selectedMonth: Date
): void => {
  // Create CSV headers
  const headers = ['Datum', 'Mitarbeiter', 'Typ', 'Stunden', 'Status'];
  
  // Create CSV rows
  const rows: string[][] = [];
  
  // Sort entries by date and user
  const sortedEntries = [...entries].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.userName.localeCompare(b.userName);
  });
  
  // Add each entry as a row
  sortedEntries.forEach(entry => {
    const formattedDate = format(new Date(entry.date), 'dd.MM.yyyy', { locale: de });
    const type = typeDisplayMap[entry.type] || entry.type;
    const hours = entry.stunden ? `${entry.stunden}h` : '-';
    const status = entry.status ? statusDisplayMap[entry.status] : '-';
    
    rows.push([
      formattedDate,
      entry.userName,
      type,
      hours,
      status
    ]);
  });
  
  // Convert to CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const fileName = view === 'monat' 
    ? `Kalender_${format(selectedMonth, 'yyyy-MM', { locale: de })}.csv`
    : `Kalender_${format(selectedMonth, 'yyyy', { locale: de })}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export calendar data as PDF
 * @param entries - Calendar entries to export
 * @param dateRange - Date range for the export
 * @param users - List of users to include
 * @param view - Current view (month or year)
 * @param selectedMonth - Currently selected month
 */
export const exportToPDF = (
  entries: CalendarEntry[],
  dateRange: Date[],
  users: { userId: string; userName: string }[],
  view: 'monat' | 'jahr',
  selectedMonth: Date
): void => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: view === 'jahr' ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add title
  const title = view === 'monat'
    ? `Team-Kalender ${format(selectedMonth, 'MMMM yyyy', { locale: de })}`
    : `Team-Kalender ${format(selectedMonth, 'yyyy', { locale: de })}`;
  
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  // Create entries map for quick lookup
  const entriesMap = new Map<string, CalendarEntry>();
  entries.forEach(entry => {
    const key = `${entry.userId}-${entry.date}`;
    entriesMap.set(key, entry);
  });
  
  if (view === 'monat') {
    // Monthly view - create a calendar grid
    const startY = 35;
    
    // Prepare table data
    const tableHeaders = ['Mitarbeiter'];
    const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    
    // Add date headers
    dateRange.forEach(date => {
      const dayOfWeek = weekDays[(date.getDay() + 6) % 7]; // Adjust for Monday start
      tableHeaders.push(`${dayOfWeek} ${format(date, 'd')}`);
    });
    
    // Create rows for each user
    const tableRows: any[][] = [];
    users.forEach(user => {
      const row = [user.userName];
      
      dateRange.forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const entry = entriesMap.get(`${user.userId}-${dateStr}`);
        
        if (entry) {
          let cellContent = '';
          switch (entry.type) {
            case 'urlaub':
              cellContent = 'U';
              break;
            case 'krank':
              cellContent = 'K';
              break;
            case 'meeting':
              cellContent = 'M';
              break;
            case 'fortbildung':
              cellContent = 'F';
              break;
            case 'ux':
              cellContent = 'Ux';
              break;
            case 'zeit':
              cellContent = entry.stunden ? `${entry.stunden}h` : '?';
              break;
          }
          row.push(cellContent);
        } else {
          row.push('');
        }
      });
      
      tableRows.push(row);
    });
    
    // Add table to PDF
    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows,
      startY: startY,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 1,
        halign: 'center',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [59, 130, 246], // Blue color
        textColor: 255,
        fontSize: 7
      },
      columnStyles: {
        0: { cellWidth: 30 } // Name column
      },
      didDrawCell: (data) => {
        // Color cells based on entry type
        if (data.section === 'body' && data.column.index > 0) {
          const userIndex = data.row.index;
          const dateIndex = data.column.index - 1;
          const user = users[userIndex];
          const date = dateRange[dateIndex];
          const dateStr = format(date, 'yyyy-MM-dd');
          const entry = entriesMap.get(`${user.userId}-${dateStr}`);
          
          if (entry) {
            let fillColor;
            switch (entry.type) {
              case 'urlaub':
                fillColor = [157, 240, 157]; // Green
                break;
              case 'krank':
                fillColor = [0, 0, 0]; // Black
                doc.setTextColor(255, 255, 255); // White text
                break;
              case 'meeting':
                fillColor = [91, 141, 246]; // Blue
                break;
              case 'fortbildung':
                fillColor = [255, 201, 102]; // Orange
                break;
              case 'ux':
                fillColor = [245, 89, 89]; // Red
                break;
              case 'zeit':
                if (entry.stunden && entry.stunden >= 8) {
                  fillColor = [152, 193, 242]; // Light blue
                } else if (entry.stunden && entry.stunden >= 6) {
                  fillColor = [247, 213, 96]; // Yellow
                } else {
                  fillColor = [242, 161, 158]; // Light red
                }
                break;
            }
            
            if (fillColor) {
              doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
              doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
              doc.setTextColor(0, 0, 0); // Reset text color
            }
          }
        }
      }
    });
    
    // Add legend
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text('Legende:', 14, finalY);
    
    const legendItems = [
      { label: 'U = Urlaub', color: [157, 240, 157] },
      { label: 'K = Krankheit', color: [0, 0, 0] },
      { label: 'M = Meeting', color: [91, 141, 246] },
      { label: 'F = Fortbildung', color: [255, 201, 102] },
      { label: 'Ux = Sonderurlaub', color: [245, 89, 89] },
      { label: 'h = Arbeitsstunden', color: [152, 193, 242] }
    ];
    
    let legendY = finalY + 5;
    legendItems.forEach(item => {
      doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      doc.rect(14, legendY - 3, 5, 3, 'F');
      doc.setFontSize(8);
      doc.text(item.label, 22, legendY);
      legendY += 5;
    });
    
  } else {
    // Year view - create a summary table
    const startY = 35;
    
    // Summary by user and type
    const summaryData: Record<string, Record<string, number>> = {};
    
    entries.forEach(entry => {
      if (!summaryData[entry.userName]) {
        summaryData[entry.userName] = {
          urlaub: 0,
          krank: 0,
          meeting: 0,
          fortbildung: 0,
          ux: 0,
          arbeitsstunden: 0
        };
      }
      
      if (entry.type === 'zeit' && entry.stunden) {
        summaryData[entry.userName].arbeitsstunden += entry.stunden;
      } else {
        summaryData[entry.userName][entry.type] = (summaryData[entry.userName][entry.type] || 0) + 1;
      }
    });
    
    // Create table data
    const tableHeaders = ['Mitarbeiter', 'Urlaub', 'Krankheit', 'Meeting', 'Fortbildung', 'Sonderurlaub', 'Arbeitsstunden'];
    const tableRows: any[][] = [];
    
    Object.entries(summaryData).forEach(([userName, data]) => {
      tableRows.push([
        userName,
        `${data.urlaub} Tage`,
        `${data.krank} Tage`,
        `${data.meeting} Tage`,
        `${data.fortbildung} Tage`,
        `${data.ux} Tage`,
        `${data.arbeitsstunden.toFixed(1)} h`
      ]);
    });
    
    // Add summary table
    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows,
      startY: startY,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      }
    });
  }
  
  // Save the PDF
  const fileName = view === 'monat'
    ? `Kalender_${format(selectedMonth, 'yyyy-MM', { locale: de })}.pdf`
    : `Kalender_${format(selectedMonth, 'yyyy', { locale: de })}.pdf`;
  
  doc.save(fileName);
};