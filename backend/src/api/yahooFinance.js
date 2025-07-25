const puppeteer = require("puppeteer");
const { getFromCache, setCache } = require("../utils/cache");

const YAHOO_FINANCE_CMP_CACHE_DURATION = 15 * 1000;

const getYahooFinanceData = async (stockSymbol) => {
  const cacheKey = `yahoo_cmp_${stockSymbol}`;
  const cachedData = getFromCache(cacheKey);

  if (cachedData) {
    console.log(`[Yahoo Puppeteer] Cache hit for Yahoo CMP: ${stockSymbol}`);
    return cachedData;
  }

  let browser;
  try {
    const yahooFinanceUrl = `https://finance.yahoo.com/quote/${stockSymbol}.NS`;
    console.log(
      `[Yahoo Puppeteer] Launching browser to fetch CMP for ${stockSymbol} from ${yahooFinanceUrl}...`
    );

    browser = await puppeteer.launch({
      headless: "new",
      executablePath:
        "C:\\Users\\ncarp\\.cache\\puppeteer\\chrome\\win64-138.0.7204.157\\chrome-win64\\chrome.exe",
      timeout: 90000,
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1366, height: 768 });

    await page.goto(yahooFinanceUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    let cmp = null;
    const maxAttempts = 3;
    const waitBetweenAttempts = 5000;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        await page.waitForSelector('span[data-testid="qsp-price"]', {
          timeout: 15000,
        });

        cmp = await page.evaluate(() => {
          const cmpElement = document.querySelector(
            'span[data-testid="qsp-price"]'
          );
          if (cmpElement) {
            return parseFloat(cmpElement.textContent.replace(/,/g, ""));
          }
          return null;
        });

        if (cmp !== null && !isNaN(cmp)) {
          break;
        } else {
          console.warn(
            `[Yahoo Puppeteer] Selector found but CMP content was invalid for ${stockSymbol}. Retrying...`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, waitBetweenAttempts)
          );
        }
      } catch (selectorError) {
        console.warn(
          `[Yahoo Puppeteer] Primary CMP selector (data-testid="qsp-price") not found for ${stockSymbol} on attempt ${
            i + 1
          }/${maxAttempts}: ${selectorError.message}. Retrying...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, waitBetweenAttempts)
        );
      }
    }

    const result = {
      cmp: !isNaN(cmp) ? cmp : null,
    };

    setCache(cacheKey, result, YAHOO_FINANCE_CMP_CACHE_DURATION);
    console.log(
      `[Yahoo Puppeteer] Fetched CMP for ${stockSymbol}:`,
      result.cmp
    );
    return result;
  } catch (error) {
    console.error(
      `[Yahoo Puppeteer] Error fetching CMP for ${stockSymbol}:`,
      error.message
    );
    return { cmp: null };
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log(`[Yahoo Puppeteer] Browser closed for ${stockSymbol}.`);
      } catch (closeError) {
        console.error(
          `Error closing browser for ${stockSymbol}:`,
          closeError.message
        );
      }
    }
  }
};

module.exports = { getYahooFinanceData };
