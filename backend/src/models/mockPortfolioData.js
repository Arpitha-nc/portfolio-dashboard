const mockPortfolioData = [
  {
    particulars: "HDFC Bank",
    symbol: "HDFCBANK",
    purchasePrice: 1450,
    qty: 50,
    nseBse: "NSE",
  },
  // {
  //   particulars: "Bajaj Finance",
  //   symbol: "BAJFINANCE",
  //   purchasePrice: 6465,
  //   qty: 15,
  //   nseBse: "NSE",
  // },
  // {
  //   particulars: "ICICI Bank",
  //   symbol: "ICICIBANK",
  //   purchasePrice: 780,
  //   qty: 64,
  //   nseBse: "NSE",
  // },
  // {
  //   particulars: "Bajaj Holding",
  //   symbol: "BAJAJHLDNG",
  //   purchasePrice: 130,
  //   qty: 504,
  //   nseBse: "NSE",
  // },
  // {
  //   particulars: "SBI Cards & Payment Services",
  //   symbol: "SBICARD",
  //   purchasePrice: 24,
  //   qty: 1000,
  //   nseBse: "NSE",
  // },

  {
    particulars: "Dmart",
    symbol: "DMART",
    purchasePrice: 2777,
    qty: 217,
    nseBse: "NSE",
  },
];

const sectorMapping = {
  "HDFC Bank": "Financial Sector",
  // "Bajaj Finance": "Financial Sector",
  // "ICICI Bank": "Financial Sector",
  // "Bajaj Holding": "Financial Sector",
  // "SBI Cards & Payment Services": "Financial Sector",
  Dmart: "Consumer Sector",
};

module.exports = {
  mockPortfolioData,
  sectorMapping,
};
