// Regulators/standards bodies without a stable free public feed endpoint —
// surfaced as a direct link to their publications page instead of a guess.
const MANUAL_SOURCES = [
  {
    id: "fatf-publications",
    label: "FATF — Publications",
    kind: "guidance",
    jurisdiction: "International",
    url: "https://www.fatf-gafi.org/en/publications.html",
  },
  {
    id: "eu-commission-finance",
    label: "European Commission — Financial Stability, Services & Capital Markets Union",
    kind: "guidance",
    jurisdiction: "EU",
    url: "https://finance.ec.europa.eu/news_en",
  },
  {
    id: "fincen-news",
    label: "FinCEN — News & Guidance",
    kind: "guidance",
    jurisdiction: "US",
    url: "https://www.fincen.gov/news-room",
  },
  {
    id: "eba-publications",
    label: "European Banking Authority — Publications",
    kind: "rulebook",
    jurisdiction: "EU",
    url: "https://www.eba.europa.eu/publications-and-media/publications",
  },
  {
    id: "mas-news",
    label: "Monetary Authority of Singapore — News",
    kind: "guidance",
    jurisdiction: "Singapore",
    url: "https://www.mas.gov.sg/news",
  },
  {
    id: "cbuae-news",
    label: "Central Bank of the UAE — News & Insights",
    kind: "guidance",
    jurisdiction: "UAE",
    url: "https://centralbank.ae/en/news-and-publications/news-and-insights/",
  },
  {
    id: "qcb-news",
    label: "Qatar Central Bank — Publications",
    kind: "guidance",
    jurisdiction: "Qatar",
    url: "https://www.qcb.gov.qa/en/publications",
  },
];

function listManual() {
  return MANUAL_SOURCES.map((s) => ({ ...s, method: "manual" }));
}

module.exports = { listManual };
