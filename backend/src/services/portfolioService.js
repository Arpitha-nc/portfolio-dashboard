const pLimit = require("p-limit").default;
const {
  mockPortfolioData,
  sectorMapping,
} = require("../models/mockPortfolioData");
const yahooFinanceAPI = require("../api/yahooFinance");
const googleFinanceAPI = require("../api/googleFinance");
const dataTransformer = require("../utils/dataTransformer");

const CONCURRENCY_LIMIT = 3;
const limit = pLimit(CONCURRENCY_LIMIT);

const fetchAndProcessPortfolioData = async () => {
  let processedPortfolio = [];
  let totalInvestment = 0;
  let totalPresentValue = 0;

  const stockPromises = mockPortfolioData.map((stock) => {
    return limit(async () => {
      let cmp = null;
      let peRatio = null;
      let latestEarnings = null;

      const yahooData = await yahooFinanceAPI.getYahooFinanceData(stock.symbol);
      cmp = yahooData.cmp;

      const googleData = await googleFinanceAPI.getGoogleFinanceData(
        stock.symbol
      );
      peRatio = googleData.peRatio;

      if (cmp !== null && peRatio !== null && peRatio !== 0) {
        latestEarnings = cmp / peRatio;
        console.log(
          `[Portfolio Service] Calculated EPS for ${
            stock.symbol
          }: ${latestEarnings.toFixed(2)} (CMP: ${cmp}, PE: ${peRatio})`
        );
      } else {
        console.warn(
          `[Portfolio Service] Could not calculate EPS for ${stock.symbol}: CMP (${cmp}) or P/E (${peRatio}) missing or P/E is zero.`
        );
        latestEarnings = null;
      }

      const investment = stock.purchasePrice * stock.qty;
      const effectiveCmp = cmp !== null ? cmp : stock.purchasePrice;
      const presentValue = effectiveCmp * stock.qty;
      const gainLoss = presentValue - investment;

      return {
        ...stock,
        cmp: cmp,
        peRatio: peRatio,
        latestEarnings:
          latestEarnings !== null
            ? parseFloat(latestEarnings.toFixed(2))
            : null,
        investment: parseFloat(investment.toFixed(2)),
        presentValue: parseFloat(presentValue.toFixed(2)),
        gainLoss: parseFloat(gainLoss.toFixed(2)),
        sector: sectorMapping[stock.particulars] || "Other",
      };
    });
  });

  const results = await Promise.allSettled(stockPromises);

  processedPortfolio = results.map((result, index) => {
    const originalStock = mockPortfolioData[index];

    if (result.status === "fulfilled") {
      return result.value;
    } else {
      console.error(
        `[Portfolio Service] Failed to process stock ${originalStock.symbol}: ${
          result.reason?.message || result.reason
        }`
      );
      return {
        ...originalStock,
        cmp: null,
        peRatio: null,
        latestEarnings: null,
        investment: parseFloat(
          (originalStock.purchasePrice * originalStock.qty).toFixed(2)
        ),
        presentValue: parseFloat(
          (originalStock.purchasePrice * originalStock.qty).toFixed(2)
        ),
        gainLoss: 0,
        sector: sectorMapping[originalStock.particulars] || "Other",
      };
    }
  });

  totalInvestment = processedPortfolio.reduce(
    (sum, stock) => sum + stock.investment,
    0
  );
  totalPresentValue = processedPortfolio.reduce(
    (sum, stock) => sum + stock.presentValue,
    0
  );

  processedPortfolio = processedPortfolio.map((stock) => ({
    ...stock,
    portfolioPercentage:
      totalInvestment > 0
        ? parseFloat(((stock.investment / totalInvestment) * 100).toFixed(2))
        : 0,
  }));

  const portfolioBySector =
    dataTransformer.groupPortfolioBySector(processedPortfolio);

  return {
    overall: {
      totalInvestment: parseFloat(totalInvestment.toFixed(2)),
      totalPresentValue: parseFloat(totalPresentValue.toFixed(2)),
      totalGainLoss: parseFloat(
        (totalPresentValue - totalInvestment).toFixed(2)
      ),
    },
    stocks: processedPortfolio,
    sectors: portfolioBySector,
  };
};

module.exports = {
  fetchAndProcessPortfolioData,
};
