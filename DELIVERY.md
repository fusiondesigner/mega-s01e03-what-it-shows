# S01E03 delivery

Publication approved by the student. Public repository created and issues #1 and #2 filed. The course accepted the final repository and saved the debrief.

## Acceptance

- One issue draft per cause supported by the supplied classifier, with auditable counts.
- Deduplicate overlapping export pages by ID; reconcile all 412 reports exactly once.
- Preserve original export files and accepted decision 0001.
- Add a signed .svx page and real Svelte-rendered HTML with computed tables, timeline, dedupe examples and desk reference.
- Distinguish routing evidence from diagnoses; flag the five anomalous reports without double-counting.
- Treat the October 4 data as a snapshot, not live desk state.
- Publish only after explicit permission; course acceptance remains a separate gate.

## Reproduce

Use Node 24 LTS, `npm ci`, `node scripts/analyze.mjs`, then `npm run build`.
The lockfile pins dependencies. Local checks ran on Node 23.10.0; the Svelte Vite plugin reports that this non-LTS version is outside its supported range, although compilation passed.
`npm run dev` serves the interactive KB locally. `rendered/` contains server-rendered HTML with inline CSS and bundled client assets for hydration. Run `node scripts/serve.mjs` to view the delivered artifact at http://127.0.0.1:4173/kb/decisions/0002-dedupe-by-cause/. Opening HTML directly as a file preserves the static content, but interactive controls require serving the folder. No production service is deployed.

## Evidence

- Data checks passed: 427 raw rows, 412 unique IDs; parser 379, hint 33; no overlap or omissions.
- Original classification and independent tenant/form partition agree.
- Client and SSR builds passed; five pages rendered.
- Browser showed counts, five anomaly notes, timeline and signature-derived desk reference.
- Browser interaction: changing report A channel from form to app changed its cause from hint to parser and verdict from different causes to same cause.

## Publication proposal

Create public `fusiondesigner/mega-s01e03-what-it-shows`, publish this KB and build tooling, and create the two issues from `drafts/parser.md` and `drafts/hint.md`. Add resulting issue links to the new page and rebuild before pushing. Only this challenge repository is in scope. Anyone can read or copy published contents. It can be deleted after course acceptance, but copies may persist.

## Independent review

Reviewer verified the original files are unchanged, counts and signature are correct, and anomaly qualifications are supported. Reviewer found missing JavaScript in the HTML export. Fixed by adding built assets and hydration; tested channel changes in the served exported page with no browser warnings/errors.

## Course acceptance

The course accepted the signed page and both ticket outcomes at commit dc61d01. Issue #1 is completed (parser fixed); issue #2 is not planned (booking-v3 retired), matching the course engineering update. This records course acceptance, not independent verification of the product in production.

Debrief: https://hq.mega.dev/challenges/what-it-shows#debrief
