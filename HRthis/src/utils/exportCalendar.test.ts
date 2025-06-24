import { CalendarEntry } from '../types/calendar';
import { exportToCSV, exportToPDF } from './exportCalendar';

// Test data
const testEntries: CalendarEntry[] = [
  { userId: '1', userName: 'Max Mustermann', date: '2025-01-06', type: 'urlaub', status: 'genehmigt' },
  { userId: '1', userName: 'Max Mustermann', date: '2025-01-07', type: 'urlaub', status: 'genehmigt' },
  { userId: '2', userName: 'Anna Admin', date: '2025-01-07', type: 'krank' },
  { userId: '3', userName: 'Tom Teilzeit', date: '2025-01-08', type: 'meeting' },
  { userId: '1', userName: 'Max Mustermann', date: '2025-01-09', type: 'zeit', stunden: 8.5 },
  { userId: '2', userName: 'Anna Admin', date: '2025-01-09', type: 'zeit', stunden: 6.0 },
  { userId: '3', userName: 'Tom Teilzeit', date: '2025-01-09', type: 'zeit', stunden: 4.0 },
];

const testUsers = [
  { userId: '1', userName: 'Max Mustermann' },
  { userId: '2', userName: 'Anna Admin' },
  { userId: '3', userName: 'Tom Teilzeit' },
];

const testDateRange = [
  new Date('2025-01-06'),
  new Date('2025-01-07'),
  new Date('2025-01-08'),
  new Date('2025-01-09'),
];

// Manual test functions (to be run in browser console)
export const testCSVExport = () => {
  console.log('Testing CSV export...');
  exportToCSV(testEntries, testDateRange, testUsers, 'monat', new Date('2025-01-01'));
};

export const testPDFExport = () => {
  console.log('Testing PDF export...');
  exportToPDF(testEntries, testDateRange, testUsers, 'monat', new Date('2025-01-01'));
};

// Export test functions to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).testCSVExport = testCSVExport;
  (window as any).testPDFExport = testPDFExport;
}