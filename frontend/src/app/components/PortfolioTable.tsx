"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

import { StockData, TableRowData } from "../../interfaces/portfolio";

interface PortfolioTableProps {
  data: TableRowData[];
}

const PortfolioTable: React.FC<PortfolioTableProps> = React.memo(({ data }) => {
  const columns: ColumnDef<TableRowData>[] = React.useMemo(
    () => [
      {
        accessorKey: "particulars",
        id: "particulars",
        header: "Particulars (Stock Name)",
        minSize: 150,
        cell: (info) => {
          const row = info.row.original;
          if ("isSectorHeader" in row && row.isSectorHeader) {
            return (
              <span className="font-bold text-lg text-gray-800">
                {row.sectorName}
              </span>
            );
          }
          return info.getValue();
        },
      },
      {
        accessorKey: "purchasePrice",
        id: "purchasePrice",
        header: "Purchase Price",
        cell: (info) => {
          const row = info.row.original;
          if ("isSectorHeader" in row && row.isSectorHeader) return "";
          const value = info.getValue() as number | null;
          return value !== null ? (
            value.toFixed(2)
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
      {
        accessorKey: "qty",
        id: "qty",
        header: "Quantity (Qty)",
        cell: (info) => {
          const row = info.row.original;
          if ("isSectorHeader" in row && row.isSectorHeader) return "";
          const value = info.getValue();
          return value !== null ? (
            value
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
      {
        accessorKey: "investment",
        id: "investment",
        header: "Investment",
        cell: (info) => {
          const row = info.row.original;
          if ("isSectorHeader" in row && row.isSectorHeader) {
            return (
              <span className="font-bold">
                ₹{row.totalInvestment.toFixed(2)}
              </span>
            );
          }
          const value = info.getValue() as number | null;
          return value !== null ? (
            `₹${value.toFixed(2)}`
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
      {
        accessorKey: "portfolioPercentage",
        id: "portfolioPercentage",
        header: "Portfolio (%)",
        cell: (info) => {
          const row = info.row.original;
          if ("isSectorHeader" in row && row.isSectorHeader) return "";
          const value = info.getValue() as number | null;
          return value !== null ? (
            `${value.toFixed(2)}%`
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
      {
        accessorKey: "nseBse",
        id: "nseBse",
        header: "NSE/BSE (Exchange)",
        cell: (info) => {
          const row = info.row.original;
          if ("isSectorHeader" in row && row.isSectorHeader) return "";
          const value = info.getValue();
          return value || <span className="text-gray-400">N/A</span>;
        },
      },
      {
        accessorKey: "cmp",
        id: "cmp",
        header: "CMP",
        cell: (info) => {
          const row = info.row.original;
          if ("isSectorHeader" in row && row.isSectorHeader) return "";
          const value = info.getValue() as number | null;
          return value !== null ? (
            value.toFixed(2)
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
      {
        accessorKey: "presentValue",
        id: "presentValue",
        header: "Present Value",
        cell: (info) => {
          const row = info.row.original;
          if ("isSectorHeader" in row && row.isSectorHeader) {
            return (
              <span className="font-bold">
                ₹{row.totalPresentValue.toFixed(2)}
              </span>
            );
          }
          const value = info.getValue() as number | null;
          return value !== null ? (
            `₹${value.toFixed(2)}`
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
      {
        accessorKey: "gainLoss",
        id: "gainLoss",
        header: "Gain/Loss",
        cell: (info) => {
          const row = info.row.original;
          let value: number | null;
          if ("isSectorHeader" in row && row.isSectorHeader) {
            value = row.totalGainLoss;
          } else {
            value = info.getValue() as number | null;
          }
          if (value === null) return <span className="text-gray-400">N/A</span>;
          const colorClass = value >= 0 ? "text-green-600" : "text-red-600";
          return <span className={colorClass}>₹{value.toFixed(2)}</span>;
        },
      },
      {
        accessorKey: "peRatio",
        id: "peRatio",
        header: "P/E Ratio",
        cell: (info) => {
          const row = info.row.original;
          if ("isSectorHeader" in row && row.isSectorHeader) return "";
          const value = info.getValue() as number | null;
          return value !== null ? (
            value.toFixed(2)
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
      {
        accessorKey: "latestEarnings",
        id: "latestEarnings",
        header: "Latest Earnings",
        cell: (info) => {
          const row = info.row.original;
          if ("isSectorHeader" in row && row.isSectorHeader) return "";
          const value = info.getValue() as number | null;
          const cmp = (row as StockData).cmp;
          const peRatio = (row as StockData).peRatio;
          if (cmp !== null && peRatio !== null && peRatio !== 0) {
            const eps = cmp / peRatio;
            return eps.toFixed(2);
          }
          return value !== null ? (
            value.toFixed(2)
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => {
      if ("isSectorHeader" in row && row.isSectorHeader) {
        return row.id;
      } else {
        return (row as StockData).symbol;
      }
    },
  });

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {table.getRowModel().rows.map((row) => {
            const isSectorHeaderRow =
              "isSectorHeader" in row.original && row.original.isSectorHeader;

            return (
              <tr
                key={row.id}
                className={`
                  ${
                    isSectorHeaderRow
                      ? "bg-gray-200 font-semibold text-gray-800 border-b-2 border-gray-300"
                      : "hover:bg-gray-50"
                  }
                  ${
                    !isSectorHeaderRow && row.index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  }
                `}
              >
                {columns.map((columnDef) => {
                  const cell = row
                    .getAllCells()
                    .find((c) => c.column.id === columnDef.id);
                  if (!cell) return null;

                  const isParticularsColumn = cell.column.id === "particulars";
                  const isInvestmentColumn = cell.column.id === "investment";
                  const isPresentValueColumn =
                    cell.column.id === "presentValue";
                  const isGainLossColumn = cell.column.id === "gainLoss";

                  if (isSectorHeaderRow) {
                    const sectorLabelColIndex = columns.findIndex(
                      (col) => col.id === "particulars"
                    );
                    const investmentColIndex = columns.findIndex(
                      (col) => col.id === "investment"
                    );
                    const colSpanValue =
                      investmentColIndex - sectorLabelColIndex - 2;

                    if (isParticularsColumn) {
                      return (
                        <td
                          key={cell.id}
                          colSpan={colSpanValue}
                          className="px-6 py-4 text-sm font-bold text-gray-800 bg-gray-100"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    }

                    if (
                      isInvestmentColumn ||
                      isPresentValueColumn ||
                      isGainLossColumn
                    ) {
                      return (
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-sm font-bold text-right bg-gray-100"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    }

                    return (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm bg-gray-100"
                      />
                    );
                  } else {
                    return (
                      <td
                        key={cell.id}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900
                          ${
                            isInvestmentColumn ||
                            isPresentValueColumn ||
                            isGainLossColumn
                              ? "text-right"
                              : ""
                          }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No stock data to display.
        </div>
      )}
    </div>
  );
});

PortfolioTable.displayName = "PortfolioTable";

export default PortfolioTable;
