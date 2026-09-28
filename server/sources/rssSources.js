const { parseFeed } = require("../rssParser");

// Each entry is a regulator/standards-body feed. `kind` is a loose label
// (guidance / paper / rulebook / news) used for client-side filtering —
// regulators don't tag their own RSS items this way, so it's a best guess
// per-source rather than per-item. `sourceUrl` is the regulator's own
// human-facing publications page (not the raw feed XML) — shown on each
// item so a reader can go check the source directly.
const FEEDS = [
  {
    id: "fca-news",
    label: "UK FCA — News & Publications",
    kind: "guidance",
    jurisdiction: "UK",
    feedUrl: "https://www.fca.org.uk/news/rss.xml",
    sourceUrl: "https://www.fca.org.uk/news",
  },
  {
    id: "sec-press",
    label: "US SEC — Press Releases",
    kind: "guidance",
    jurisdiction: "US",
    feedUrl: "https://www.sec.gov/news/pressreleases.rss",
    sourceUrl: "https://www.sec.gov/newsroom/press-releases",
  },
  {
    id: "boe-news",
    label: "Bank of England — News",
    kind: "guidance",
    jurisdiction: "UK",
    feedUrl: "https://www.bankofengland.co.uk/rss/news",
    sourceUrl: "https://www.bankofengland.co.uk/news",
  },
  {
    id: "bis-press",
    label: "Bank for International Settlements — Media Releases",
    kind: "paper",
    jurisdiction: "International",
    feedUrl: "https://www.bis.org/doclist/all_pressrels.rss",
    sourceUrl: "https://www.bis.org/press/index.htm",
  },
  {
    id: "bafin-press",
    label: "Germany BaFin — Press Releases",
    kind: "guidance",
    jurisdiction: "Germany",
    feedUrl: "https://www.bafin.de/EN/service/rss/_function/RSS_Presse.xml?nn=187494",
    sourceUrl: "https://www.bafin.de/EN/die-bafin/aktuelles-presse/aktuelles-presse_node_en.html",
  },
  {
    id: "doj-press",
    label: "US DOJ — Press Releases",
    kind: "guidance",
    jurisdiction: "US",
    feedUrl: "https://www.justice.gov/news/rss?m=1",
    sourceUrl: "https://www.justice.gov/news/press-releases",
    // DOJ's feed covers all department news; keep only the financial-crime
    // subset relevant to this tool instead of every prosecution.
    filterKeywords: ["sanction", "money launder", "laundering", "AML", "OFAC", "terrorist financ", "financial crime", "bank secrecy", "forfeiture", "cryptocurrency fraud", "wire fraud"],
  },
  {
    id: "sec-litigation",
    label: "US SEC — Litigation Releases",
    kind: "guidance",
    jurisdiction: "US",
    feedUrl: "https://www.sec.gov/enforcement-litigation/litigation-releases/rss",
    sourceUrl: "https://www.sec.gov/enforcement-litigation/litigation-releases",
  },
];

async function fetchFeed(source) {
  const res = await fetch(source.feedUrl, {
    signal: AbortSignal.timeout(12000),
    headers: { "User-Agent": "RegWatch regulatory-feed aggregator" },
  });
  if (!res.ok) throw new Error(`${source.label} fetch failed: ${res.status}`);
  const xml = await res.text();
  let items = parseFeed(xml);
  if (source.filterKeywords) {
    const keywords = source.filterKeywords.map((k) => k.toLowerCase());
    items = items.filter((item) => {
      const text = `${item.title} ${item.summary}`.toLowerCase();
      return keywords.some((k) => text.includes(k));
    });
  }
  items = items.slice(0, 12);
  return items.map((item) => ({
    ...item,
    sourceId: source.id,
    sourceLabel: source.label,
    sourceUrl: source.sourceUrl,
    kind: source.kind,
    jurisdiction: source.jurisdiction,
  }));
}

module.exports = { FEEDS, fetchFeed };
