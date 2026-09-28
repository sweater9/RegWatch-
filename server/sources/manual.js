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
];

function listManual() {
  return MANUAL_SOURCES.map((s) => ({ ...s, method: "manual" }));
}

module.exports = { listManual };
