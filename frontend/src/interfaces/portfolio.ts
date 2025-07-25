export interface StockData {
  particulars: string;
  symbol: string;
  purchasePrice: number;
  qty: number;
  nseBse: "NSE" | "BSE" | string;
  cmp: number | null;
  presentValue: number;
  gainLoss: number;
  peRatio: number | null;
  latestEarnings: number | null;
  investment: number;
  portfolioPercentage: number;
  sector: string;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  stocks: StockData[];
}

export interface OverallSummary {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
}

export interface PortfolioApiResponse {
  overall: OverallSummary;
  stocks: StockData[];
  sectors: { [key: string]: SectorSummary };
}

export interface SectorHeaderRow {
  id: string;
  isSectorHeader: true;
  sectorName: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
}

export type TableRowData = StockData | SectorHeaderRow;
