const portfolioService = require("../services/portfolioService");

const getPortfolioData = async (req, res) => {
  try {
    const portfolio = await portfolioService.fetchAndProcessPortfolioData();
    res.json(portfolio);
  } catch (error) {
    console.error("Error in getPortfolioData controller:", error);
    res.status(500).json({
      message: "Failed to retrieve portfolio data",
      error: error.message,
    });
  }
};

module.exports = {
  getPortfolioData,
};
