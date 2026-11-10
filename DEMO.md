# Demo — Cargolane (supply-chain-022119993805548648404)

A working marketing site for a fictional freight-forwarding platform. Built from the job brief:
finish a supply-chain tech website on a stack the owner can work with, with designs coming from a
design tool. This version is the **build-first answer**: the pages and interactions exist, in plain
files, ready to be dressed with the client's own design.

- **Live URL:** https://supply-chain-022119993805548648404.vercel.app
- **Repository:** https://github.com/francisco-arturo/supply-chain-022119993805548648404
- **Local URL:** `http://127.0.0.1:5178` (`node dev-server.mjs`)
- **Deploy command:** `node ..\.harness\deploy.mjs supply-chain-022119993805548648404`
- **Last verified:** 2026-11-10

## The 60-second path

| # | Do this | What the visitor sees |
|---|---|---|
| 1 | Open `http://127.0.0.1:5178` | Hero with the lane-network panel, live KPIs and the "one honest screen" headline |
| 2 | Scroll to **Live board** | Eight seeded shipments, five status filters, milestone trail in the right rail |
| 3 | Click **Delayed**, then shipment `CL-4816` | Customs hold at Los Angeles, $210/day bonded storage, full milestone trail |
| 4 | Click **Escalate to ops** | Exception becomes "Escalated", toast confirms the handoff |
| 5 | Scroll to **Instant quote** | Shanghai → Rotterdam, Ocean FCL, 18,000 kg, Standard = **$3,418 / 23 days**, itemised |
| 6 | Switch service to **Priority** | Price rises, transit drops; breakdown and CO2 update in place |
| 7 | Read **No black box** | The code card showing `content.js`, the single file behind the copy and rates |
| 8 | Scroll to **Contact**, submit the form | Inline confirmation; no page reload |

## The one sentence to say about it

> "Every shipment, exception and lane price sits on one screen, and the whole site reads from a
> single content file, so you can change a headline or a rate without a developer."

## What is deliberately fake

- Shipments, carriers, milestones, values and case studies are seeded in `content.js`.
- Lane prices are a deterministic estimate from a local rate table (distance × mode + surcharges).
  They are not carrier offers, and there is no customs or duty calculation.
- The contact form validates and confirms in the browser; nothing is sent.
- No authentication, database or carrier API. The board is a read-only demo of the intended
  experience.
- Case-study metrics are illustrative sample data, not client results.

## What was verified

```
node check.mjs https://supply-chain-022119993805548648404.vercel.app
21 passed, 0 failed
```

Checks cover content shape, shipment integrity, quote maths (clamping, mode comparison, totals),
page wiring, a stub-DOM boot of the renderer, and HTTP 200 for the entry route, CSS, app and
pricing module. Chrome headless screenshots are blocked by the agent sandbox (mojo channel access
denied), so visual review is by the user in a browser.

## If something fails while they look

- Reload `http://127.0.0.1:5178/`; the server is a static `node dev-server.mjs` job.
- If the port is busy, run `$env:PORT=5188; node dev-server.mjs` and open the printed URL.
- Fresh state is a reload; nothing persists by design.

## Not built (next, if the user wants it)

- The client's actual Claude design files, typography and brand assets (none supplied yet).
- Real carrier/forwarder feed, document upload and user accounts.
- A production contact endpoint and rate engine; the demo deliberately stops at the estimate.
