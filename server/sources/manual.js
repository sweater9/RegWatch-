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
    id: "uae-eocn",
    label: "UAE Executive Office for Control & Non-Proliferation (EOCN)",
    kind: "guidance",
    jurisdiction: "UAE",
    url: "https://www.uaeiec.gov.ae/en-us/",
  },
  {
    id: "uae-unsc-list",
    label: "UAE UN Security Council Sanctions List Implementation (via EOCN)",
    kind: "rulebook",
    jurisdiction: "UAE",
    url: "https://www.uaeiec.gov.ae/en-us/",
  },
  {
    id: "uae-dfsa",
    label: "Dubai Financial Services Authority (DFSA) — News",
    kind: "guidance",
    jurisdiction: "UAE",
    url: "https://www.dfsa.ae/news",
  },
  {
    id: "uae-cma",
    label: "UAE Capital Market Authority (CMA)",
    kind: "guidance",
    jurisdiction: "UAE",
    url: "https://www.uaecma.gov.ae/en/home.aspx",
  },
  {
    id: "uae-fsra",
    label: "ADGM Financial Services Regulatory Authority (FSRA)",
    kind: "guidance",
    jurisdiction: "UAE",
    url: "https://www.adgm.com/financial-services-regulatory-authority",
  },
  {
    id: "uae-vara",
    label: "Dubai Virtual Assets Regulatory Authority (VARA) — VASPs",
    kind: "guidance",
    jurisdiction: "UAE",
    url: "https://www.vara.ae/en/news/",
  },
  {
    id: "qatar-qfcra",
    label: "Qatar Financial Centre Regulatory Authority (QFCRA)",
    kind: "guidance",
    jurisdiction: "Qatar",
    url: "https://www.qfcra.com/",
  },
  {
    id: "qatar-nctc",
    label: "Qatar National Counter Terrorism Committee (NCTC)",
    kind: "rulebook",
    jurisdiction: "Qatar",
    url: "https://portal.moi.gov.qa/wps/portal/NCTC/Home/",
  },
  {
    id: "jdsupra-aml",
    label: "JD Supra — Anti-Money Laundering (law firm alerts)",
    kind: "commentary",
    jurisdiction: "International",
    url: "https://www.jdsupra.com/topics/anti-money-laundering/",
  },
  {
    id: "mayerbrown-aml",
    label: "Mayer Brown — Anti-Money Laundering (law firm insights)",
    kind: "commentary",
    jurisdiction: "International",
    url: "https://www.mayerbrown.com/en/services/key-issues/anti-money-laundering",
  },
  {
    id: "korea-fsc-press",
    label: "Financial Services Commission (South Korea) — Press Releases",
    kind: "guidance",
    jurisdiction: "South Korea",
    url: "https://www.fsc.go.kr/eng/pr010101",
  },
  {
    id: "iomfsa-news",
    label: "Isle of Man Financial Services Authority — FSA News",
    kind: "guidance",
    jurisdiction: "Isle of Man",
    url: "https://www.iomfsa.im/fsa-news/",
  },
  {
    id: "egmont-group-news",
    label: "Egmont Group of Financial Intelligence Units — News",
    kind: "guidance",
    jurisdiction: "International",
    url: "https://egmontgroup.org/news-and-events/",
  },
  {
    id: "fsb-press",
    label: "Financial Stability Board — Press & Publications",
    kind: "guidance",
    jurisdiction: "International",
    url: "https://www.fsb.org/press",
  },
];

function listManual() {
  return MANUAL_SOURCES.map((s) => ({ ...s, method: "manual" }));
}

module.exports = { listManual };
