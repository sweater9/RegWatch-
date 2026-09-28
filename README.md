# RegWatch

A chronological feed of regulatory guidance, papers, and rulemaking from AML/KYC/sanctions regulators and standards bodies, refreshed on a schedule and served as a static site — no server or API key required.

## Sources

- **Fetched feeds:** UK FCA, US SEC, Bank of England, Basel Committee (BIS), BIS press
- **Fetched API:** US Federal Register (FinCEN, SEC, OFAC, OCC rulemaking)
- **Manual-link fallback** (no stable public feed): FATF, European Commission, FinCEN news, EBA

Each source is fetched independently; a source that's temporarily down doesn't block the rest — it's reported in `feed.json`'s `sourceErrors` instead.

## How it works

A GitHub Action (`.github/workflows/update-and-deploy.yml`) runs every 6 hours: it executes `scripts/build-feed.js`, which fetches all sources and writes `public/feed.json`, commits that file if it changed, then deploys `public/` to GitHub Pages. The page itself (`public/index.html`) is a static file that reads `feed.json` client-side — nothing runs server-side at request time.

## Run the fetch locally

```bash
npm run build-feed
```

This writes `public/feed.json`. Open `public/index.html` in a browser (or serve the folder) to view it.

## Deploy

GitHub Pages, via the included workflow. Enable it once under **Settings → Pages → Source: GitHub Actions**; it then updates itself on schedule and redeploys automatically.

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
