import React from "react";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

interface LedgerTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function LedgerTable<T>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No ledger entries recorded in this ledger view.",
  className = "",
}: LedgerTableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto border border-[#1A1F1B]/30 bg-[#F6F0E0] ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#EDE4CE] text-[#0C1411] border-b-[3px] border-double border-[#1A1F1B]/40">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3 px-3.5 font-mono text-[11px] uppercase tracking-[0.12em] font-bold border-r border-[#1A1F1B]/20 last:border-r-0 ${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left"
                } ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1A1F1B]/15">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 px-4 text-center font-mono text-xs text-[#1A1F1B]/60 italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-colors ${
                  onRowClick
                    ? "cursor-pointer hover:bg-[#EDE4CE] active:bg-[#F2A900]/10"
                    : ""
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`py-2.5 px-3.5 font-sans text-xs border-r border-[#1A1F1B]/15 last:border-r-0 ${
                      col.align === "right"
                        ? "text-right font-mono tabular-nums"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    } ${col.className || ""}`}
                  >
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? "")
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
