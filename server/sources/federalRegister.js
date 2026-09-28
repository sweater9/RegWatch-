// US Federal Register API — free, documented, no key.
// https://www.federalregister.gov/developers/documentation/api/v1
const AGENCIES = [
  "financial-crimes-enforcement-network",
  "securities-and-exchange-commission",
  "office-of-foreign-assets-control",
  "comptroller-of-the-currency",
];

async function fetchFederalRegister() {
  const params = new URLSearchParams({
    "per_page": "20",
    "order": "newest",
    "conditions[type][]": "RULE",
  });
  AGENCIES.forEach((a) => params.append("conditions[agencies][]", a));
  const url = `https://www.federalregister.gov/api/v1/documents.json?${params.toString()}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`Federal Register fetch failed: ${res.status}`);
  const data = await res.json();
  const results = data?.results || [];
  return results.slice(0, 15).map((doc) => ({
    title: doc.title,
    link: doc.html_url,
    date: doc.publication_date ? new Date(doc.publication_date).toISOString() : null,
    summary: (doc.abstract || "").slice(0, 280),
    sourceId: "federal-register",
    sourceLabel: "US Federal Register",
    sourceUrl: "https://www.federalregister.gov/agencies/financial-crimes-enforcement-network",
    kind: "rulebook",
    jurisdiction: "US",
  }));
}

module.exports = { fetchFederalRegister, label: "US Federal Register" };
