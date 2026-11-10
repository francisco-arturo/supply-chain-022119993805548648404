# Session Handoff — Prototype: supply-chain-022119993805548648404

## Last Updated

- 2026-11-10 — built and verified the Cargolane marketing site; awaiting user review.

## Current Objective

Freight-forwarder marketing website: logistics hero and service lanes, how-it-works timeline, live
shipment tracking demo, instant quote builder, case studies and contact, built in plain HTML/CSS/JS
with one editable content file.

## Recommended Next Step

1. Open `http://127.0.0.1:5178` and walk the path in `DEMO.md`.
2. If the user approves, ask for the GitHub repository URL they created, add it to
   `github.json` -> `approved_remotes`, push, then deploy:
   `node .harness/deploy.mjs supply-chain-022119993805548648404`.
3. Send the live URL back. Do not draft a proposal unless the user asks for one.
4. `proto-002` (map the client's Claude design) starts only when the design files arrive.

## Files

- `content.js` — all copy, 8 seeded shipments, 14 ports, rate table, case studies, form labels.
- `index.html` — section structure and mounts.
- `styles.css` — tokens, layout, components, responsive rules.
- `app.js` — renders `content.js`; board filters/detail, quote builder, contact form, nav.
- `quote.mjs` — pure pricing/distance logic, shared with the checks.
- `check.mjs` — verification (content, pricing, wiring, stub-DOM boot, optional HTTP probes).
- `dev-server.mjs` — local static server on port 5178 (excluded from deploys).
- `README.md` — how to run, edit and deploy in plain language.
- `DEMO.md` — click path, limits, what is fake.
- `init.ps1` / `init.sh` — run `node check.mjs`.

## Blockers

- None technical. The client's Claude design files and brand assets were not supplied, so the visual
  design is derived from the brief; `proto-002` is where their design gets mapped.

## Next Session

- Start the local server with `node dev-server.mjs` from this directory if it is not running.
- Re-run `node check.mjs http://127.0.0.1:5178` before changing anything.
- Do not create a second directory for this prototype; continue in this one.
- Retirement, if ever needed, goes through the workspace `retire-prototype.ps1`.
