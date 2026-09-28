# RegWatch

A live, chronological feed of regulatory guidance, papers, and rulemaking from AML/KYC/sanctions regulators and standards bodies.

## Sources

- **Live-checked feeds:** UK FCA, US SEC, Bank of England, Basel Committee (BIS), BIS press
- **Live-checked API:** US Federal Register (FinCEN, SEC, OFAC, OCC rulemaking)
- **Manual-link fallback** (no stable public feed): FATF, European Commission, FinCEN news, EBA

Each source is fetched independently and cached for 30 minutes; a source that's temporarily down doesn't block the rest — it's reported in `sourceErrors` instead.

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## Deploy on Render

Includes a `render.yaml` configured as a Node web service (needed because the feeds are fetched server-side — most regulator sites don't allow browser CORS requests). In the Render dashboard: **New → Web Service**, connect this repo.

## Project layout

- `public/index.html` — the feed UI
- `server/server.js` — Express app serving `public/` and `/api/feed`
- `server/feed.js` — aggregates all sources in parallel, caches, handles per-source failures
- `server/rssParser.js` — minimal RSS/Atom parser (no external dependency)
- `server/sources/*.js` — one module per source or source group

## Adding a source

Add an entry to `server/sources/rssSources.js` (for an RSS/Atom feed) or write a new module following the same shape as `federalRegister.js` for a JSON API. Sources with no queryable public endpoint go in `server/sources/manual.js` instead.

## License

MIT
