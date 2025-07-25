const cache = new Map();
const CACHE_DURATION = 15 * 1000;

const getFromCache = (key) => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data;
  }
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

module.exports = { getFromCache, setCache };
