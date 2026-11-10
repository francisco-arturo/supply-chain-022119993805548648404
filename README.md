# Cargolane

A working supply-chain marketing site: live shipment board, milestone trails, instant lane quote,
case studies and a contact form. Built in plain HTML, CSS and JavaScript with **one content file**,
so the site can be edited without a framework or a CMS.

This is a prototype built from a job brief. Shipments, rates and case studies are seeded sample data.

## Run it

```powershell
node dev-server.mjs
# http://127.0.0.1:5178
```

No install, no build step.

## Files

| File | What it is |
|---|---|
| `content.js` | Every headline, shipment, lane rate, case study and form label |
| `index.html` | Page structure and section mounts |
| `styles.css` | Design tokens and all layout |
| `app.js` | Renders `content.js` into the page and wires the interactions |
| `quote.mjs` | Pure lane-pricing logic (shared by the page and the checks) |
| `check.mjs` | Verification: content shape, pricing maths, page wiring |
| `dev-server.mjs` | Local static server; excluded from deploys |

## Edit the site

1. Open `content.js`.
2. Change a headline, a shipment, a case study or a rate.
3. Refresh the page.

The quote builder reads `content.quote.rates` and `content.quote.locations`. Adding a port means one
object with a `lat` and `lon`; the distance and price are computed for you.

## Verify

```powershell
powershell -ExecutionPolicy Bypass -File .\init.ps1
# or
node check.mjs
```

To include live HTTP checks against a running server:

```powershell
node check.mjs http://127.0.0.1:5178
```

## Deploy

The repository root is the deployment. On Vercel, import the repository and keep the default static
settings, or run the workspace deploy script:

```powershell
node ..\.harness\deploy.mjs supply-chain-022119993805548648404
```

`dev-server.mjs`, `check.mjs`, the harness files and this README are excluded by `.vercelignore`.

## Notes and limits

- The board is seeded; there is no carrier API behind it.
- The quote is a deterministic estimate from a local rate table, not a carrier offer.
- The contact form validates and shows a confirmation in the browser; nothing is sent.
- No authentication, no database, no server-side state.
