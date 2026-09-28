const { FEEDS, fetchFeed } = require("./sources/rssSources");
const { fetchFederalRegister } = require("./sources/federalRegister");
const { listManual } = require("./sources/manual");

let cache = { items: null, sourceErrors: [], fetchedAt: 0 };
const TTL_MS = 30 * 60 * 1000;

async function buildFeed() {
  if (cache.items && Date.now() - cache.fetchedAt < TTL_MS) return cache;

  const rssResults = await Promise.allSettled(FEEDS.map((s) => fetchFeed(s)));
  const fedRegResult = await Promise.allSettled([fetchFederalRegister()]);

  const items = [];
  const sourceErrors = [];

  rssResults.forEach((r, i) => {
    if (r.status === "fulfilled") items.push(...r.value);
    else sourceErrors.push({ source: FEEDS[i].label, error: String(r.reason?.message || r.reason) });
  });

  if (fedRegResult[0].status === "fulfilled") items.push(...fedRegResult[0].value);
  else sourceErrors.push({ source: "US Federal Register", error: String(fedRegResult[0].reason?.message || fedRegResult[0].reason) });

  items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  cache = { items, sourceErrors, fetchedAt: Date.now() };
  return cache;
}

async function getFeed() {
  const { items, sourceErrors, fetchedAt } = await buildFeed();
  return {
    generatedAt: new Date().toISOString(),
    cachedAt: new Date(fetchedAt).toISOString(),
    items,
    sourceErrors,
    manualSources: listManual(),
  };
}

module.exports = { getFeed };
