const { parseFeed } = require("../rssParser");

// Each entry is a regulator/standards-body feed. `kind` is a loose label
// (guidance / paper / rulebook / news) used for client-side filtering —
// regulators don't tag their own RSS items this way, so it's a best guess
// per-source rather than per-item.
const FEEDS = [
  {
    id: "fca-news",
    label: "UK FCA — News & Publications",
    kind: "guidance",
    jurisdiction: "UK",
    feedUrl: "https://www.fca.org.uk/news/rss.xml",
  },
  {
    id: "sec-press",
    label: "US SEC — Press Releases",
    kind: "guidance",
    jurisdiction: "US",
    feedUrl: "https://www.sec.gov/news/pressreleases.rss",
  },
  {
    id: "boe-news",
    label: "Bank of England — News",
    kind: "guidance",
    jurisdiction: "UK",
    feedUrl: "https://www.bankofengland.co.uk/rss/news",
  },
  {
    id: "bis-bcbs",
    label: "Basel Committee (BIS) — Publications",
    kind: "rulebook",
    jurisdiction: "International",
    feedUrl: "https://www.bis.org/doclist/bcbs_publications.rss",
  },
  {
    id: "bis-press",
    label: "Bank for International Settlements — Press",
    kind: "paper",
    jurisdiction: "International",
    feedUrl: "https://www.bis.org/doclist/press.rss",
  },
];

async function fetchFeed(source) {
  const res = await fetch(source.feedUrl, {
    signal: AbortSignal.timeout(12000),
    headers: { "User-Agent": "RegWatch regulatory-feed aggregator" },
  });
  if (!res.ok) throw new Error(`${source.label} fetch failed: ${res.status}`);
  const xml = await res.text();
  const items = parseFeed(xml).slice(0, 12);
  return items.map((item) => ({
    ...item,
    sourceId: source.id,
    sourceLabel: source.label,
    kind: source.kind,
    jurisdiction: source.jurisdiction,
  }));
}

module.exports = { FEEDS, fetchFeed };
