/*
 * Verification for the Cargolane prototype.
 *
 *   node check.mjs                        structural + pricing checks
 *   node check.mjs http://127.0.0.1:5178  also fetch the running site
 *
 * Exits non-zero on the first failure summary, so init.ps1 / init.sh fail fast.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { priceQuote, distanceKm } from "./quote.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const results = [];
function check(label, fn) {
  try {
    fn();
    results.push({ ok: true, label });
  } catch (error) {
    results.push({ ok: false, label, error: error.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/* ---- content ------------------------------------------------------------- */
let content;
check("content.js loads and exposes window.CONTENT", () => {
  const sandbox = vm.createContext({ window: {} });
  vm.runInContext(read("content.js"), sandbox, { filename: "content.js" });
  content = sandbox.window.CONTENT;
  assert(content && typeof content === "object", "window.CONTENT is missing");
});

check("brand, navigation and hero copy are present", () => {
  assert(content.brand?.name === "Cargolane", "brand name");
  assert(content.nav?.links?.length >= 4, "nav links");
  assert(content.hero?.title?.pre && content.hero.title.em && content.hero.title.post, "hero title parts");
  assert(content.hero?.ctas?.length === 2, "two hero actions");
  assert(content.hero?.panel?.nodes?.length >= 6, "network nodes");
});

check("board ships at least eight seeded shipments with valid statuses", () => {
  const shipments = content.board.shipments;
  const valid = new Set(["transit", "delayed", "risk", "delivered"]);
  assert(shipments.length >= 8, `expected 8+ shipments, found ${shipments.length}`);
  const ids = new Set();
  for (const shipment of shipments) {
    assert(shipment.id && !ids.has(shipment.id), `duplicate or missing id: ${shipment.id}`);
    ids.add(shipment.id);
    assert(valid.has(shipment.statusKey), `${shipment.id} has status ${shipment.statusKey}`);
    assert(shipment.origin && shipment.destination && shipment.carrier, `${shipment.id} missing lane facts`);
    assert(shipment.milestones.length >= 4, `${shipment.id} needs a milestone trail`);
    assert(
      shipment.milestones.filter((mile) => mile.current).length <= 1,
      `${shipment.id} has more than one current milestone`
    );
    assert(
      shipment.progress >= 0 && shipment.progress <= 100,
      `${shipment.id} progress out of range`
    );
  }
  const delivered = shipments.filter((shipment) => shipment.statusKey === "delivered");
  assert(delivered.length >= 1, "one delivered shipment for the happy path");
});

check("quote locations and rate tables are complete", () => {
  const quote = content.quote;
  assert(quote.locations.length >= 8, "locations");
  assert(quote.modes.length >= 2, "modes");
  assert(quote.services.length === 3, "three service levels");
  for (const mode of quote.modes) {
    const rate = quote.rates[mode.id];
    assert(rate && rate.base > 0 && rate.perKg > 0 && rate.perKm > 0, `rate table for ${mode.id}`);
  }
});

check("every quote origin and destination has coordinates", () => {
  for (const location of content.quote.locations) {
    assert(
      typeof location.lat === "number" && typeof location.lon === "number",
      `${location.id} missing coordinates`
    );
  }
});

/* ---- pricing ------------------------------------------------------------- */
check("default ocean quote is priced, itemised and internally consistent", () => {
  const quote = priceQuote(content, content.quote.defaultSelection);
  assert(quote.total > 1000, `total too low: ${quote.total}`);
  const sum = quote.items.reduce((total, item) => total + item.amount, 0);
  assert(sum === quote.total, `items sum ${sum} != total ${quote.total}`);
  assert(quote.transitDays >= 10, `ocean transit too fast: ${quote.transitDays}`);
  assert(quote.co2Kg > 0, "co2 estimate");
  assert(quote.perKg > 0, "per kg");
});

check("air costs more and arrives sooner than ocean on the same lane", () => {
  const base = content.quote.defaultSelection;
  const ocean = priceQuote(content, { ...base, mode: "ocean" });
  const air = priceQuote(content, { ...base, mode: "air" });
  assert(air.total > ocean.total, `air ${air.total} should exceed ocean ${ocean.total}`);
  assert(air.transitDays < ocean.transitDays, `air ${air.transitDays} should beat ocean ${ocean.transitDays}`);
});

check("weight is clamped to the configured limits", () => {
  const base = content.quote.defaultSelection;
  const light = priceQuote(content, { ...base, weight: -20 });
  const heavy = priceQuote(content, { ...base, weight: 900000 });
  assert(light.weight === content.quote.common.minWeight, `light weight ${light.weight}`);
  assert(heavy.weight === content.quote.common.maxWeight, `heavy weight ${heavy.weight}`);
});

check("heavier freight costs more than lighter freight", () => {
  const base = content.quote.defaultSelection;
  const light = priceQuote(content, { ...base, weight: 2000 });
  const heavy = priceQuote(content, { ...base, weight: 20000 });
  assert(heavy.total > light.total, "heavy total should exceed light total");
});

check("identical origin and destination is rejected", () => {
  let threw = false;
  try {
    priceQuote(content, { ...content.quote.defaultSelection, destination: content.quote.defaultSelection.origin });
  } catch {
    threw = true;
  }
  assert(threw, "expected an error for a zero-length lane");
});

check("distance calculation is sane for known city pairs", () => {
  const byId = Object.fromEntries(content.quote.locations.map((location) => [location.id, location]));
  const shanghaiRotterdam = distanceKm(byId.SHA, byId.RTM);
  assert(shanghaiRotterdam > 8000 && shanghaiRotterdam < 10000, `SHA-RTM distance ${shanghaiRotterdam}`);
  const singaporeLa = distanceKm(byId.SIN, byId.LAX);
  assert(singaporeLa > 13000, `SIN-LAX distance ${singaporeLa}`);
});

/* ---- page wiring --------------------------------------------------------- */
check("index.html mounts every section the renderer expects", () => {
  const html = read("index.html");
  const required = [
    "heroTitle",
    "heroPanel",
    "shipmentRows",
    "shipmentDetail",
    "boardFilters",
    "originSelect",
    "destinationSelect",
    "quoteResult",
    "caseGrid",
    "contactForm",
    "formStatus",
    "toast"
  ];
  for (const id of required) {
    assert(html.includes(`id="${id}"`), `missing #${id}`);
  }
  assert(html.includes('href="styles.css"'), "styles.css is linked");
  assert(html.includes('src="content.js"'), "content.js is loaded");
  assert(html.includes('type="module" src="app.js"'), "app.js is loaded as a module");
  assert(html.includes('name="viewport"'), "viewport meta");
});

check("renderer only looks up ids that exist in the markup", () => {
  const html = read("index.html");
  const app = read("app.js");
  const ids = new Set([...app.matchAll(/\$\("#([A-Za-z][\w-]*)"\)/g)].map((match) => match[1]));
  assert(ids.size > 10, "expected many mounted ids");
  for (const id of ids) {
    assert(html.includes(`id="${id}"`), `app.js queries #${id} but index.html does not define it`);
  }
});

check("renderer and stylesheet are wired to real files", () => {
  const app = read("app.js");
  const css = read("styles.css");
  assert(app.includes('from "./quote.mjs"'), "app.js imports the pricing module");
  assert(app.includes("priceQuote("), "app.js calls priceQuote");
  assert(css.includes(".board-shell") && css.includes(".quote-shell"), "key layout classes");
  assert(css.includes("@media (max-width: 900px)"), "responsive breakpoint");
  assert(css.includes("prefers-reduced-motion"), "reduced motion support");
});

check("app.js parses and the stylesheet braces balance", () => {
  const source = read("app.js").replace(/^import[^\n]*\n/m, "");
  new Function(source);
  const css = read("styles.css");
  const open = (css.match(/{/g) || []).length;
  const close = (css.match(/}/g) || []).length;
  assert(open === close, `styles.css has ${open} opening and ${close} closing braces`);
});

check("all copy stays in English with no leftover template markers", () => {
  const sources = ["index.html", "content.js", "app.js", "styles.css"].map(read).join("\n");
  assert(!sources.includes("[[http"), "unfilled DEMO placeholder leaked into the site");
  assert(!/TODO|FIXME|Lorem ipsum/i.test(sources), "leftover placeholder text");
});

/* ---- boot smoke test ---------------------------------------------------- */
class StubElement {
  constructor(id = "") {
    this.id = id;
    this._html = "";
    this.textContent = "";
    this.value = "";
    this.style = {};
    this.dataset = {};
    this.attributes = {};
    this.classList = {
      add() {},
      remove() {},
      toggle() {},
      contains() {
        return false;
      }
    };
  }
  set innerHTML(value) {
    this._html = String(value);
  }
  get innerHTML() {
    return this._html;
  }
  addEventListener() {}
  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }
  getAttribute(name) {
    return this.attributes[name] ?? null;
  }
  querySelector() {
    return null;
  }
  querySelectorAll() {
    return [];
  }
  appendChild() {}
  remove() {}
  scrollIntoView() {}
  closest() {
    return null;
  }
  checkValidity() {
    return true;
  }
  reportValidity() {}
}

const stubIds = new Map();
const stubDocument = {
  title: "",
  documentElement: { scrollHeight: 5000 },
  body: { appendChild() {} },
  querySelector(selector) {
    if (!selector.startsWith("#") || selector.includes(" ")) return null;
    const id = selector.slice(1);
    if (!stubIds.has(id)) stubIds.set(id, new StubElement(id));
    return stubIds.get(id);
  },
  querySelectorAll() {
    return [];
  },
  createElement() {
    return new StubElement();
  },
  addEventListener() {}
};

globalThis.window = {
  CONTENT: content,
  addEventListener() {},
  scrollY: 0,
  innerWidth: 1440,
  location: { origin: "http://127.0.0.1:5178", pathname: "/", hash: "" }
};
globalThis.document = stubDocument;
globalThis.requestAnimationFrame = (callback) => callback();
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

try {
  await import("./app.js");
  assert(stubDocument.title.includes("Cargolane"), "document title was not set");
  assert(
    stubDocument.querySelector("#heroTitle").innerHTML.includes("honest"),
    "hero title did not render"
  );
  assert(
    stubDocument.querySelector("#shipmentRows").innerHTML.includes("CL-4821"),
    "shipment rows did not render"
  );
  assert(
    stubDocument.querySelector("#shipmentDetail").innerHTML.includes("Milestone trail"),
    "shipment detail did not render"
  );
  assert(
    stubDocument.querySelector("#quoteResult").innerHTML.includes("$"),
    "quote result did not render"
  );
  assert(
    stubDocument.querySelector("#caseGrid").innerHTML.includes("Northwind"),
    "case studies did not render"
  );
  results.push({ ok: true, label: "app.js boots and renders hero, board, quote and proof" });
} catch (error) {
  results.push({ ok: false, label: "app.js boots against a stub DOM", error: error.message });
}

/* ---- running site (optional) -------------------------------------------- */
const base = process.argv[2];
if (base) {
  const probes = [
    ["/", "text/html"],
    ["/styles.css", "text/css"],
    ["/app.js", "text/javascript"],
    ["/quote.mjs", "text/javascript"]
  ];
  for (const [route, type] of probes) {
    try {
      const response = await fetch(new URL(route, base));
      assert(response.status === 200, `${route} returned ${response.status}`);
      const body = await response.text();
      assert(body.length > 0, `${route} returned an empty body`);
      if (route === "/") {
        assert(body.includes("Cargolane"), "entry route does not contain the brand");
        assert(body.includes("shipmentRows"), "entry route is missing the board mount");
      }
      results.push({ ok: true, label: `GET ${route} -> 200 (${type})` });
    } catch (error) {
      results.push({ ok: false, label: `GET ${route}`, error: error.message });
    }
  }
}

/* ---- report -------------------------------------------------------------- */
const pad = Math.max(...results.map((result) => result.label.length));
console.log("");
console.log("Cargolane verification");
console.log("----------------------");
for (const result of results) {
  console.log(`  ${result.ok ? "PASS" : "FAIL"}  ${result.label.padEnd(pad)}${result.ok ? "" : `  ${result.error}`}`);
}

const failed = results.filter((result) => !result.ok);
try {
  const sample = priceQuote(content, content.quote.defaultSelection);
  console.log("");
  console.log(
    `Sample quote: ${sample.origin.name} -> ${sample.destination.name}, ${sample.mode.name}, ` +
      `${sample.weight.toLocaleString("en-US")} kg = $${sample.total.toLocaleString("en-US")} / ${sample.transitDays} days`
  );
} catch {
  /* the quote checks above already reported the failure */
}

console.log("");
console.log(`${results.length - failed.length} passed, ${failed.length} failed`);
if (failed.length) process.exit(1);
