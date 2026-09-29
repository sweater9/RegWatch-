# RegWatch

A chronological feed of regulatory guidance, papers, and rulemaking from AML/KYC/sanctions regulators and standards bodies, refreshed on a schedule and served as a static site — no server or API key required.

## Sources

- **Fetched feeds:** UK FCA, US SEC (press releases + litigation releases), Bank of England, Basel Committee (BIS), BIS press, Germany BaFin, US DOJ (filtered to financial-crime coverage)
- **Fetched API:** US Federal Register (FinCEN, SEC, OFAC, OCC rulemaking)
- **Manual-link fallback** (no stable public feed): FATF, European Commission, FinCEN news, EBA, Singapore MAS, seven UAE regulators (EOCN, DFSA, Central Bank, CMA, ADGM FSRA, VARA, UN sanctions list implementation), Qatar (QFCRA, NCTC), JD Supra's AML topic page for law firm commentary

Each source is fetched independently; a source that's temporarily down doesn't block the rest — it's reported in `feed.json`'s `sourceErrors` instead.

**On Reuters/Bloomberg/Financial Times:** none currently offer a free public RSS feed (Reuters discontinued theirs, Bloomberg only publishes RSS for corporate press releases rather than editorial coverage, and FT's feed requires a paid myFT login). A Google News site-scoped RSS workaround does technically work, but Google's own feed terms restrict it to personal, non-commercial feed-reader use — not a fit for a public aggregator. DOJ and SEC litigation releases were added instead as genuinely free wire-equivalent coverage of major sanctions/AML enforcement.

## How it works

A GitHub Action (`.github/workflows/update-and-deploy.yml`) runs every 6 hours: it executes `scripts/build-feed.js`, which fetches all sources and writes `public/feed.json`, commits that file if it changed, then deploys `public/` to GitHub Pages. The page itself (`public/index.html`) is a static file that reads `feed.json` client-side — nothing runs server-side at request time.

## Run the fetch locally

```bash
npm run build-feed
```

This writes `public/feed.json`. Open `public/index.html` in a browser (or serve the folder) to view it.

## Deploy

**GitHub Pages** (primary): via the included workflow. Enable it once under **Settings → Pages → Source: GitHub Actions**; it then updates itself on schedule and redeploys automatically.

**Cloudflare Workers** (optional, mirrors the same static site): the workflow also deploys to Cloudflare Workers on every run, using `wrangler.toml`'s static-assets config — but only if `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set as repo secrets (**Settings → Secrets and variables → Actions**). Without those secrets, that step is skipped and GitHub Pages still deploys normally. Create the token at the Cloudflare dashboard (My Profile → API Tokens → a token with Workers Scripts: Edit permission for the target account); the account ID is on the Cloudflare dashboard's right sidebar.

If a Worker was ever deployed manually (`wrangler deploy` from a local copy, or pasted via the dashboard), it has no ongoing link to this repo — pushes here will never reach it until the secrets above are set and this workflow's Cloudflare step actually runs.

## Project layout

- `public/index.html` — the feed UI (reads `public/feed.json`)
- `public/feed.json` — generated output, refreshed by the Action
- `scripts/build-feed.js` — fetches every source and writes `feed.json`
- `server/rssParser.js` — minimal RSS/Atom parser (no external dependency)
- `server/sources/*.js` — one module per source or source group

## Adding a source

Add an entry to `server/sources/rssSources.js` (for an RSS/Atom feed) or write a new module following the same shape as `federalRegister.js` for a JSON API. Sources with no queryable public endpoint go in `server/sources/manual.js` instead.

## License

MIT
