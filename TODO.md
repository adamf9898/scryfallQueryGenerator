# TODO — Issues Found Running This Project

All problems were discovered by running `npm test`, `npm audit`, and inspecting the source files in both the root app and `generator/` sub-app.

---

## 🔴 Bugs (Logic / Correctness)

- [ ] **Fix `or()` method in `src/ScryfallQueryBuilder.js`**
  - **Problem:** `or()` builds a sub-query string and then calls `.split(' ').join(' or ')`, which splits on *every* space—including spaces inside quoted values like `name:"Lightning Bolt"`, producing broken output: `(name:"Lightning or Bolt")`.
  - **Fix:** Replace `subQuery.split(' ').join(' or ')` with `subBuilder.parts.join(' or ')` so each filter part is joined correctly.
  - File: `src/ScryfallQueryBuilder.js` line 410

- [ ] **Fix `keyword()` not quoting multi-word keywords in root `app.js`**
  - **Problem:** The browser-embedded `keyword()` in `app.js` outputs `keyword:first strike` (unquoted), which is invalid Scryfall syntax. Keywords like "first strike" and "double strike" require quotes: `keyword:"first strike"`.
  - **Fix:** Add a space-check in `keyword()` and wrap multi-word values in double quotes, matching how `name()`, `type()`, and `oracleText()` already work.
  - File: `app.js` line ~284

- [ ] **Fix `keyword()` not quoting multi-word keywords in `generator/app.js`**
  - Same issue as above, same fix needed.
  - File: `generator/app.js`

---

## 🟠 Workflow / CI Failures

- [ ] **Fix `update-scryfall-data.yml` — missing `npm install` step**
  - **Problem:** The workflow runs `npm run update-data` immediately after `actions/setup-node@v4` without ever running `npm install`. Since `node_modules/` is not committed, the script will fail with `Cannot find module` errors in CI.
  - **Fix:** Add a `run: npm install` (or `npm ci`) step between "Setup Node.js" and "Update Scryfall data".
  - File: `.github/workflows/update-scryfall-data.yml`

---

## 🟡 Security

- [ ] **Fix moderate vulnerability in `brace-expansion` dependency**
  - **Problem:** `npm audit` reports a moderate-severity DoS vulnerability ([GHSA-f886-m6hf-6m8v](https://github.com/advisories/GHSA-f886-m6hf-6m8v)) in `brace-expansion < 1.1.13 || >= 2.0.0 < 2.0.3`, pulled in transitively by Jest.
  - **Fix:** Run `npm audit fix` to upgrade to a safe version.
  - File: `package.json` / `package-lock.json`

---

## 🟡 Code Quality / Maintainability

- [ ] **Eliminate the three duplicate copies of `ScryfallQueryBuilder`**
  - **Problem:** The class exists in three places: `src/ScryfallQueryBuilder.js` (canonical), `app.js` (root, browser copy — missing `banned`, `restricted`, `watermark`, `language`, `priceEur`, `priceTix`, `keyword`, `produces`, `is`, `not`, `or`, `and`, `negate`, `clone`), and `generator/app.js` (another browser copy). Divergence between copies causes bugs and maintenance overhead.
  - **Fix:** Use a single source file and either (a) `<script type="module">` in both HTML files, or (b) add a simple build step (e.g., `esbuild` or just a copy task) to produce a browser bundle from `src/`.
  - Files: `app.js`, `generator/app.js`, `src/ScryfallQueryBuilder.js`

- [ ] **Add a `lint` script to `package.json`**
  - **Problem:** There is no linter configured. The only scripts are `test` and `update-data`, so code style issues go undetected.
  - **Fix:** Add ESLint (e.g., `eslint --ext .js .`) as a `lint` script and a corresponding `eslint.config.js` (flat config).
  - File: `package.json`

---

## 🟡 Data / Stale Content

- [ ] **Update `data/sets.json` — missing 2025 sets**
  - **Problem:** The `recentSets` list only goes up to *Foundations* (November 2024). Sets released in 2025 — *Aetherdrift* (Feb 2025), *Tarkir: Dragonstorm* (Apr 2025) — are absent, so the UI's set selector is stale.
  - **Fix:** Run `npm run update-data` (or trigger the GitHub Actions workflow) to pull fresh set data from the Scryfall API. Also expand the `recentSets` slice from 20 to 25 entries in `scripts/update-scryfall-data.js` to avoid losing sets going forward.
  - File: `data/sets.json`, `scripts/update-scryfall-data.js`

---

## 🟢 Browser App (`generator/`)

- [ ] **Fix `generator/bulk-data.js` — `localStorage` cannot hold Scryfall bulk data**
  - **Problem:** `BulkDataManager` stores the entire Scryfall bulk dataset in `localStorage` (`this.storageKey`). The *oracle_cards* dataset is ~100 MB; browsers impose a `localStorage` limit of ~5–10 MB. The `addAll()` call will silently fail or throw a `QuotaExceededError`, breaking the Card Data tab entirely.
  - **Fix:** Replace `localStorage` with the [Origin Private File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) (`navigator.storage.getDirectory()`) or IndexedDB for large binary/JSON blobs.
  - File: `generator/bulk-data.js`

- [ ] **Fix `generator/sw.js` — data files not included in service worker cache**
  - **Problem:** `ASSETS_TO_CACHE` in the service worker lists `config.json`, `queries.json`, and the JS files, but does **not** include any `../data/` JSON files (`sets.json`, `keywords.json`, `types.json`, etc.). The Query Builder tab fetches these at runtime and will fail offline.
  - **Fix:** Add the data files to `ASSETS_TO_CACHE`, or add a runtime caching strategy for `fetch` requests to `./data/*.json`.
  - File: `generator/sw.js`


