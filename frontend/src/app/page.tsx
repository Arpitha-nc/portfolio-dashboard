// frontend/src/app/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getPortfolioData } from "../lib/api";
import {
  PortfolioApiResponse,
  TableRowData,
  SectorHeaderRow,
  StockData,
} from "../interfaces/portfolio";

import PortfolioTable from "../app/components/PortfolioTable";
import PortfolioDistributionChart from "../app/components/PortfolioDistributionChart";

const REFRESH_INTERVAL_MS = 15 * 1000;

const PortfolioDashboard: React.FC = () => {
  const [portfolioApiData, setPortfolioApiData] =
    useState<PortfolioApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = async () => {
    if (!portfolioApiData) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getPortfolioData();
      setPortfolioApiData(data);
      setLastUpdated(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (err: any) {
      setError(err.message || "Failed to fetch portfolio data.");
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  const transformedTableData = useMemo(() => {
    const tableData: TableRowData[] = [];

    if (!portfolioApiData) {
      return [];
    }

    const sortedSectorNames = Object.keys(portfolioApiData.sectors).sort();

    sortedSectorNames.forEach((sectorName) => {
      const sectorSummary = portfolioApiData.sectors[sectorName];

      tableData.push({
        id: `sector-${sectorName}`,
        isSectorHeader: true,
        sectorName: sectorName,
        totalInvestment: sectorSummary.totalInvestment,
        totalPresentValue: sectorSummary.totalPresentValue,
        totalGainLoss: sectorSummary.totalGainLoss,
      } as SectorHeaderRow);

      sectorSummary.stocks
        .sort((a, b) => a.particulars.localeCompare(b.particulars))
        .forEach((stock) => {
          tableData.push(stock as StockData);
        });
    });

    return tableData;
  }, [portfolioApiData]);

  const hasData =
    portfolioApiData &&
    (portfolioApiData.stocks.length > 0 ||
      Object.keys(portfolioApiData.sectors).length > 0);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Portfolio Dashboard
        </h1>
        {lastUpdated && (
          <div className="text-sm text-gray-600">
            Last updated: {lastUpdated}
          </div>
        )}
        {loading && hasData && (
          <div className="text-sm text-blue-600 flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Refreshing...
          </div>
        )}
      </div>

      {loading && !hasData && (
        <div className="text-center py-8 text-blue-600 font-semibold text-lg">
          Loading initial portfolio data... Please wait, this might take a
          moment.
        </div>
      )}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <button
            onClick={fetchData}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {hasData && !error && (
        <>
          <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 mb-10 border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
              Overall Portfolio Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Total Investment:
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  ₹{portfolioApiData!.overall.totalInvestment.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Total Present Value:
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  ₹{portfolioApiData!.overall.totalPresentValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Total Gain/Loss:
                </p>
                <p
                  className={`text-xl sm:text-2xl font-bold mt-1 ${
                    portfolioApiData!.overall.totalGainLoss >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹{portfolioApiData!.overall.totalGainLoss.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {Object.keys(portfolioApiData!.sectors).length > 0 && (
            <div className="grid grid-cols-1 mb-10">
              <PortfolioDistributionChart sectors={portfolioApiData!.sectors} />
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
            Stock Holdings & Sector Breakdown
          </h2>
          <PortfolioTable data={transformedTableData} />
        </>
      )}

      {!loading && !hasData && !error && (
        <div className="text-center py-8 text-gray-600 text-lg">
          No portfolio data available. Add stocks to your backend.
        </div>
      )}
    </div>
  );
};

export default PortfolioDashboard;
