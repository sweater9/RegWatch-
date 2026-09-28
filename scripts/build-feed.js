// Fetches all sources and writes public/feed.json. Run by the scheduled
// GitHub Action (or manually) since GitHub Pages can't run a live server.
const fs = require("fs");
const path = require("path");
const { FEEDS, fetchFeed } = require("../server/sources/rssSources");
const { fetchFederalRegister } = require("../server/sources/federalRegister");
const { listManual } = require("../server/sources/manual");

async function main() {
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

  const output = {
    generatedAt: new Date().toISOString(),
    cachedAt: new Date().toISOString(),
    items,
    sourceErrors,
    manualSources: listManual(),
  };

  const outPath = path.join(__dirname, "..", "public", "feed.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Wrote ${items.length} items and ${sourceErrors.length} source errors to ${outPath}`);
  if (sourceErrors.length > 0) {
    console.log("Source errors:", sourceErrors);
  }
}

main().catch((err) => {
  console.error("build-feed failed:", err);
  process.exit(1);
});
