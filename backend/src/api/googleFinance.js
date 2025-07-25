const axios = require("axios");
const cheerio = require("cheerio");
const { getFromCache, setCache } = require("../utils/cache");

const GOOGLE_FINANCE_CACHE_DURATION = 1 * 60 * 60 * 1000;

const getGoogleFinanceData = async (stockSymbol) => {
  const cacheKey = `google_financial_data_${stockSymbol}`;
  const cachedData = getFromCache(cacheKey);

  if (cachedData) {
    console.log(
      `[Google Cheerio] Cache hit for Google Financial Data: ${stockSymbol}`
    );
    return cachedData;
  }

  try {
    const url = `https://www.google.com/finance/quote/${stockSymbol}:NSE`;
    console.log(
      `[Google Cheerio] Fetching P/E for ${stockSymbol} from ${url}...`
    );

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(data);

    let peRatio = null;

    const peRatioContainer = $(
      'div.gyFHrc:has(div.mfs7Fc:contains("P/E ratio"))'
    );
    if (peRatioContainer.length > 0) {
      const peRatioValueElement = peRatioContainer.find("div.P6K39c");
      if (peRatioValueElement.length > 0) {
        peRatio = parseFloat(peRatioValueElement.text().replace(/,/g, ""));
      } else {
        console.warn(
          `[Google Cheerio] Could not find P/E ratio value for ${stockSymbol}.`
        );
      }
    } else {
      console.warn(
        `[Google Cheerio] Could not find P/E ratio for ${stockSymbol}.`
      );
    }

    const financialData = {
      peRatio: !isNaN(peRatio) ? peRatio : null,
      latestEarnings: null,
    };

    if (financialData.peRatio !== null) {
      setCache(cacheKey, financialData, GOOGLE_FINANCE_CACHE_DURATION);
    }
    return financialData;
  } catch (error) {
    console.error(
      `[Google Cheerio] Error fetching Google Finance data for ${stockSymbol}:`,
      error.message
    );
    if (error.response) {
      console.error(
        `Status: ${
          error.response.status
        }, Data: ${error.response.data.substring(0, 200)}...`
      );
    }
    return { peRatio: null, latestEarnings: null };
  }
};

module.exports = { getGoogleFinanceData };
