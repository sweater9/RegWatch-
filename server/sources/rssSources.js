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
  {
    id: "finma-news",
    label: "Switzerland FINMA — News",
    kind: "guidance",
    jurisdiction: "Switzerland",
    feedUrl: "https://www.finma.ch/en/rss/news/",
    sourceUrl: "https://www.finma.ch/en/news/",
  },
  {
    id: "austrac-media",
    label: "AUSTRAC (Australia) — Media Releases",
    kind: "guidance",
    jurisdiction: "Australia",
    feedUrl: "https://www.austrac.gov.au/media-release/rss.xml",
    sourceUrl: "https://www.austrac.gov.au/news-and-media/media-releases",
  },
  {
    id: "japan-fsa-news",
    label: "Japan FSA — News",
    kind: "guidance",
    jurisdiction: "Japan",
    feedUrl: "https://www.fsa.go.jp/fsaEnNewsList_rss2.xml",
    sourceUrl: "https://www.fsa.go.jp/en/news/",
  },
  {
    id: "canada-boc-press",
    label: "Bank of Canada — Press",
    kind: "guidance",
    jurisdiction: "Canada",
    feedUrl: "https://www.bankofcanada.ca/content_type/press/feed/",
    sourceUrl: "https://www.bankofcanada.ca/press/",
  },
  {
    id: "ireland-cbi-news",
    label: "Central Bank of Ireland — News & Media",
    kind: "guidance",
    jurisdiction: "Ireland",
    feedUrl: "https://www.centralbank.ie/feeds/news-media-feed",
    sourceUrl: "https://www.centralbank.ie/news",
  },
  {
    id: "hk-sfc-press",
    label: "Hong Kong SFC — Press Releases",
    kind: "guidance",
    jurisdiction: "Hong Kong",
    feedUrl: "https://www.sfc.hk/en/RSS-Feeds/Press-releases",
    sourceUrl: "https://www.sfc.hk/en/News-and-announcements/News",
  },
  {
    id: "rbnz-news",
    label: "Reserve Bank of New Zealand — News Releases",
    kind: "guidance",
    jurisdiction: "New Zealand",
    feedUrl: "https://www.rbnz.govt.nz/feeds/news",
    sourceUrl: "https://www.rbnz.govt.nz/news-and-events/news",
  },
  {
    id: "dnb-general-news",
    label: "De Nederlandsche Bank (DNB) — General News",
    kind: "guidance",
    jurisdiction: "Netherlands",
    feedUrl: "https://www.dnb.nl/en/rss/16451/6882",
    sourceUrl: "https://www.dnb.nl/en/general-news/",
  },
  {
    id: "amf-france-news",
    label: "AMF (France) — Actualités",
    kind: "guidance",
    jurisdiction: "France",
    feedUrl: "https://www.amf-france.org/en/flux-rss/display/30",
    sourceUrl: "https://www.amf-france.org/en",
  },
  {
    id: "rbi-press",
    label: "Reserve Bank of India — Press Releases",
    kind: "guidance",
    jurisdiction: "India",
    feedUrl: "https://rbi.org.in/pressreleases_rss.xml",
    sourceUrl: "https://rbi.org.in/Scripts/BS_PressreleaseDisplay.aspx",
  },
  {
    id: "cssf-publications",
    label: "CSSF (Luxembourg) — Latest Publications",
    kind: "guidance",
    jurisdiction: "Luxembourg",
    feedUrl: "https://www.cssf.lu/en/feed/publications",
    sourceUrl: "https://www.cssf.lu/en/news/",
  },
  {
    id: "sarb-publications",
    label: "South African Reserve Bank — News & Publications",
    kind: "guidance",
    jurisdiction: "South Africa",
    feedUrl: "https://www.resbank.co.za/bin/sarb/solr/publications/rss",
    sourceUrl: "https://www.resbank.co.za/en/home",
  },
  {
    id: "bde-news",
    label: "Banco de España — News and Events",
    kind: "guidance",
    jurisdiction: "Spain",
    feedUrl: "https://www.bde.es/wbe/en/inicio/rss/rss-noticias/",
    sourceUrl: "https://www.bde.es/wbe/en/noticias-eventos/",
  },
  {
    id: "mfsa-publications",
    label: "Malta Financial Services Authority — Publications",
    kind: "guidance",
    jurisdiction: "Malta",
    feedUrl: "https://www.mfsa.mt/feed/",
    sourceUrl: "https://www.mfsa.mt/news/news-releases/",
  },
  {
    id: "gfsc-guernsey-news",
    label: "Guernsey Financial Services Commission — All News",
    kind: "guidance",
    jurisdiction: "Guernsey",
    feedUrl: "https://www.gfsc.gg/article.xml",
    sourceUrl: "https://www.gfsc.gg/news",
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
