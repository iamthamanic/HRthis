import React, { ReactNode } from "react";

// Define the column interface
export interface Column {
  key: string;
  title: ReactNode;
  width?: string;
}

// Define the row interface
export interface Row {
  id: string | number;
  cells: ReactNode[];
}

interface CustomTableProps {
  columns: Column[];
  rows: Row[];
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export default function CustomTable({
  columns,
  rows,
  tableClassName = "min-w-full table-fixed border-collapse",
  headerClassName = "bg-primary text-white",
  bodyClassName = "border-t border-gray-200 hover:bg-gray-50 transition-colors",
}: CustomTableProps) {
  return (
    <table className={tableClassName}>
      <thead>
        <tr className={headerClassName}>
          {columns.map(column => (
            <th
              key={column.key}
              className={`p-3 text-left text-sm font-medium ${column.width || ""}`}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id} className={bodyClassName}>
            {row.cells.map((cell, index) => (
              <td key={`${row.id}-${index}`} className="p-3 whitespace-nowrap">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
