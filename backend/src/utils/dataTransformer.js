const groupPortfolioBySector = (stocks) => {
  const sectors = {};

  stocks.forEach((stock) => {
    const sectorName = stock.sector;
    if (!sectors[sectorName]) {
      sectors[sectorName] = {
        totalInvestment: 0,
        totalPresentValue: 0,
        totalGainLoss: 0,
        stocks: [],
      };
    }
    sectors[sectorName].totalInvestment += stock.investment;
    sectors[sectorName].totalPresentValue += stock.presentValue;
    sectors[sectorName].totalGainLoss += stock.gainLoss;
    sectors[sectorName].stocks.push(stock);
  });

  for (const sectorName in sectors) {
    sectors[sectorName].totalInvestment = parseFloat(
      sectors[sectorName].totalInvestment.toFixed(2)
    );
    sectors[sectorName].totalPresentValue = parseFloat(
      sectors[sectorName].totalPresentValue.toFixed(2)
    );
    sectors[sectorName].totalGainLoss = parseFloat(
      sectors[sectorName].totalGainLoss.toFixed(2)
    );
  }

  return sectors;
};

module.exports = {
  groupPortfolioBySector,
};
