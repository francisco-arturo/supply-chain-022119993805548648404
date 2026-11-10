/*
 * Cargolane - rendering and interaction.
 * Everything readable lives in content.js. This file only decides where it goes.
 */
import { priceQuote } from "./quote.mjs";

const C = window.CONTENT;
const state = {
  filter: "all",
  selectedId: C.board.shipments[0].id,
  escalated: new Set(),
  quote: { ...C.quote.defaultSelection }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const money = (value) => "$" + Math.round(value).toLocaleString("en-US");
const num = (value) => Number(value).toLocaleString("en-US");

const ICONS = {
  arrow:
    '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"/></svg>',
  radar:
    '<svg viewBox="0 0 20 20" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="7.2"/><circle cx="10" cy="10" r="3.2"/><path d="M10 10l5.2-4.4"/><circle cx="10" cy="10" r="1" fill="currentColor" stroke="none"/></svg>',
  bolt:
    '<svg viewBox="0 0 20 20" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.2 2.5L4.8 11h4l-.6 6.5L15 9h-4z"/></svg>',
  doc:
    '<svg viewBox="0 0 20 20" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 2.8h6l4 4v10.4H5z"/><path d="M11 2.8v4h4M7.5 11h5M7.5 14h3.5"/></svg>',
  layers:
    '<svg viewBox="0 0 20 20" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2.8l7 3.6-7 3.6-7-3.6z"/><path d="M3 10.4l7 3.6 7-3.6M3 14l7 3.6 7-3.6"/></svg>'
};

const STATUS_LABEL = { transit: "In transit", delayed: "Delayed", risk: "At risk", delivered: "Delivered" };

/* --------------------------------------------------------------------------
   Header, hero, shared chrome
   -------------------------------------------------------------------------- */
function renderChrome() {
  $("#brandName").textContent = C.brand.name;
  $("#navLinks").innerHTML = C.nav.links.map((link) => `<a href="${link.href}">${esc(link.label)}</a>`).join("");
  const cta = $("#navCta");
  cta.href = C.nav.cta.href;
  cta.textContent = C.nav.cta.label;

  $("#mobileNavLinks").innerHTML =
    C.nav.links.map((link) => `<a href="${link.href}">${esc(link.label)}</a>`).join("") +
    `<a class="btn btn-primary" href="${C.nav.cta.href}">${esc(C.nav.cta.label)}</a>`;

  document.title = `${C.brand.name} — ${C.brand.tagline}`;
}

function renderHero() {
  $("#heroEyebrow").textContent = C.hero.eyebrow;
  $("#heroTitle").innerHTML = `${esc(C.hero.title.pre)} <em>${esc(C.hero.title.em)}</em> ${esc(C.hero.title.post)}`;
  $("#heroLede").textContent = C.hero.paragraph;
  $("#heroNote").textContent = C.hero.proof;

  $("#heroActions").innerHTML = C.hero.ctas
    .map(
      (cta) =>
        `<a class="btn btn-${cta.variant === "primary" ? "primary" : "ghost"}" href="${cta.href}">${esc(cta.label)}${
          cta.variant === "primary" ? ICONS.arrow : ""
        }</a>`
    )
    .join("");

  $("#heroPanel").innerHTML = `
    <div class="panel-head">
      <span class="panel-label">${esc(C.hero.panel.label)}</span>
      <span class="panel-live"><i></i>${esc(C.hero.panel.live)}</span>
    </div>
    <div class="network">${networkSvg(C.hero.panel)}</div>
    <div class="kpi-row">
      ${C.hero.panel.kpis
        .map((kpi) => `<div class="kpi"><strong>${esc(kpi.value)}</strong><span>${esc(kpi.label)}</span></div>`)
        .join("")}
    </div>`;

  $("#logoLabel").textContent = C.logos.label;
  $("#logoRow").innerHTML = C.logos.items.map((item) => `<li>${esc(item)}</li>`).join("");
}

function networkSvg(panel) {
  const nodes = new Map(panel.nodes.map((node) => [node.id, node]));
  const lanes = panel.links
    .map((link) => {
      const from = nodes.get(link.from);
      const to = nodes.get(link.to);
      if (!from || !to) return "";
      const cx = (from.x + to.x) / 2 - (to.y - from.y) * 0.22;
      const cy = (from.y + to.y) / 2 + (to.x - from.x) * 0.22;
      const d = `M${from.x} ${from.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x} ${to.y}`;
      return `<path d="${d}" class="lane${link.hot ? " lane-hot" : ""}" />`;
    })
    .join("");

  const dots = panel.nodes
    .map(
      (node) =>
        `<circle class="node-dot" cx="${node.x}" cy="${node.y}" r="3.2" />` +
        `<text class="node-label" x="${node.x + 7}" y="${node.y + 3}">${esc(node.label)}</text>`
    )
    .join("");

  return `<svg viewBox="0 0 520 258" role="img" aria-label="Network map with active freight lanes">
      <text class="node-label" x="18" y="24" style="fill:#8b948d">LANE NETWORK / WEEK 46</text>
      <line x1="18" y1="34" x2="502" y2="34" style="stroke:#e2dccd" stroke-width="1" />
      ${lanes}
      ${dots}
      <circle class="packet" cx="214" cy="74" r="3.4" />
    </svg>
    <span class="panel-caption"><span class="live-dot"></span>${esc(C.hero.panel.caption)}</span>`;
}

function renderStats() {
  $("#statsGrid").innerHTML = C.strip
    .map(
      (item) => `
      <div class="stat">
        <strong>${esc(item.value)}</strong>
        <span class="stat-label">${esc(item.label)}</span>
        <span class="stat-note">${esc(item.note)}</span>
      </div>`
    )
    .join("");
}

/* --------------------------------------------------------------------------
   Platform
   -------------------------------------------------------------------------- */
function renderPlatform() {
  $("#platformEyebrow").textContent = C.platform.eyebrow;
  $("#platformTitle").textContent = C.platform.title;
  $("#platformBody").textContent = C.platform.body;

  $("#featureGrid").innerHTML = C.platform.features
    .map(
      (feature) => `
      <article class="feature">
        <span class="feature-icon">${ICONS[feature.icon] || ICONS.layers}</span>
        <h3>${esc(feature.title)}</h3>
        <p>${esc(feature.body)}</p>
      </article>`
    )
    .join("");
}

/* --------------------------------------------------------------------------
   Shipment board
   -------------------------------------------------------------------------- */
function filteredShipments() {
  if (state.filter === "all") return C.board.shipments;
  return C.board.shipments.filter((shipment) => shipment.statusKey === state.filter);
}

function renderBoard() {
  $("#boardEyebrow").textContent = C.board.eyebrow;
  $("#boardTitle").textContent = C.board.title;
  $("#boardBody").textContent = C.board.body;
  $("#boardHint").textContent = C.board.hint;

  $("#boardFilters").innerHTML = C.board.filters
    .map((filter) => {
      const count =
        filter.key === "all"
          ? C.board.shipments.length
          : C.board.shipments.filter((shipment) => shipment.statusKey === filter.key).length;
      return `<button class="filter-btn${state.filter === filter.key ? " is-active" : ""}" type="button" role="tab"
        aria-selected="${state.filter === filter.key}" data-filter="${filter.key}">${esc(filter.label)}<span class="count">${count}</span></button>`;
    })
    .join("");

  const rows = filteredShipments();
  $("#shipmentRows").innerHTML = rows
    .map(
      (shipment) => `
      <tr data-id="${esc(shipment.id)}" tabindex="0" class="${shipment.id === state.selectedId ? "is-selected" : ""}"
          aria-label="Open shipment ${esc(shipment.id)}, ${esc(shipment.status)}">
        <td><span class="ship-id">${esc(shipment.id)}</span><span class="ship-sub">${esc(shipment.container)}</span></td>
        <td><span class="lane">${esc(shipment.origin)} <i class="lane-arrow" aria-hidden="true">→</i> ${esc(shipment.destination)}</span><span class="ship-sub">${esc(shipment.carrier)}</span></td>
        <td>${esc(shipment.mode)}</td>
        <td><span class="eta"><strong>${esc(shipment.eta)}</strong><span>${esc(shipment.etaNote)}</span></span></td>
        <td><span class="status ${shipment.statusKey}">${esc(STATUS_LABEL[shipment.statusKey] || shipment.status)}</span></td>
      </tr>`
    )
    .join("");

  $("#boardMeta").textContent = `${rows.length} of ${C.board.shipments.length} shipments · seeded feed`;
  $("#boardFoot").textContent =
    state.filter === "all"
      ? "Showing all seeded shipments. Click a row to open its milestone trail."
      : `Filtered to ${(STATUS_LABEL[state.filter] || state.filter).toLowerCase()}. Clear the filter to see the whole board.`;

  renderDetail();
}

function renderDetail() {
  const shipment = C.board.shipments.find((item) => item.id === state.selectedId) || C.board.shipments[0];
  if (!shipment) return;
  const escalated = state.escalated.has(shipment.id);
  const exceptionClass = shipment.statusKey === "transit" || shipment.statusKey === "delivered" ? " is-clear" : "";
  const label = STATUS_LABEL[shipment.statusKey] || shipment.status;

  $("#shipmentDetail").innerHTML = `
    <div class="detail-top">
      <div>
        <span class="detail-label">Shipment detail</span>
        <span class="detail-id">${esc(shipment.id)}</span>
      </div>
      <span class="status ${shipment.statusKey}">${esc(label)}</span>
    </div>

    <div class="detail-route">
      <div class="route-points">
        <div><strong>${esc(shipment.origin)}</strong><span>Origin</span></div>
        <span class="arrow" aria-hidden="true">→</span>
        <div style="text-align:right"><strong>${esc(shipment.destination)}</strong><span>Destination</span></div>
      </div>
      <div class="progress-track"><span class="progress-fill" data-progress="${shipment.progress}"></span></div>
      <div class="route-meta">
        <span>${shipment.progress}% of trail</span>
        <span>ETA ${esc(shipment.eta)} · ${esc(shipment.etaNote)}</span>
      </div>
    </div>

    <div class="detail-facts">
      <div class="fact"><span>Carrier</span><strong>${esc(shipment.carrier)}</strong></div>
      <div class="fact"><span>Mode</span><strong>${esc(shipment.mode)}</strong></div>
      <div class="fact"><span>Weight</span><strong>${esc(shipment.weight)}</strong></div>
      <div class="fact"><span>Declared value</span><strong>${esc(shipment.value)}</strong></div>
      <div class="fact"><span>Incoterm</span><strong>${esc(shipment.incoterm)}</strong></div>
      <div class="fact"><span>Vessel / flight</span><strong>${esc(shipment.vessel)}</strong></div>
    </div>

    <div class="exception${exceptionClass}">
      <strong>${escalated ? "Escalated" : "Exception"}</strong>
      ${esc(shipment.exception)}${escalated ? " Escalated to the duty ops manager." : ""}
    </div>

    <div class="timeline">
      <p class="timeline-title">Milestone trail</p>
      <ol>
        ${shipment.milestones
          .map(
            (mile) => `
          <li class="${mile.done ? "done" : ""}${mile.current ? " current" : ""}">
            <span class="mile-label">${esc(mile.label)}</span>
            <span class="mile-meta">${esc(mile.place)} · ${esc(mile.time)}</span>
          </li>`
          )
          .join("")}
      </ol>
    </div>

    <div class="detail-actions">
      <button class="btn btn-ghost btn-sm" type="button" data-detail-action="copy">Copy tracking link</button>
      <button class="btn btn-primary btn-sm" type="button" data-detail-action="escalate" ${escalated ? "disabled" : ""}>
        ${escalated ? "Escalated" : "Escalate to ops"}
      </button>
    </div>`;

  const fill = $("#shipmentDetail .progress-fill");
  if (fill) {
    requestAnimationFrame(() => {
      fill.style.width = `${shipment.progress}%`;
    });
  }
}

function selectShipment(id) {
  state.selectedId = id;
  $$("#shipmentRows tr").forEach((row) => row.classList.toggle("is-selected", row.dataset.id === id));
  renderDetail();
  $("#shipmentDetail")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

/* --------------------------------------------------------------------------
   Quote builder
   -------------------------------------------------------------------------- */
function populateQuote() {
  const options = C.quote.locations
    .map((location) => `<option value="${location.id}">${esc(location.name)}, ${esc(location.country)}</option>`)
    .join("");
  $("#originSelect").innerHTML = options;
  $("#destinationSelect").innerHTML = options;
  $("#originSelect").value = state.quote.origin;
  $("#destinationSelect").value = state.quote.destination;

  $("#modeToggle").innerHTML = C.quote.modes
    .map(
      (mode) => `
      <label class="mode-option">
        <input type="radio" name="mode" value="${mode.id}" ${state.quote.mode === mode.id ? "checked" : ""} />
        <span class="mode-name">${esc(mode.name)}</span>
        <span class="mode-note">${esc(mode.note)}</span>
        <span class="mode-check" aria-hidden="true"></span>
      </label>`
    )
    .join("");

  $("#serviceOptions").innerHTML = C.quote.services
    .map((service) => {
      const delta = Math.round((service.multiplier - 1) * 100);
      const hint = `${service.note}${delta > 0 ? ` · +${delta}%` : delta < 0 ? ` · ${delta}%` : ""}`;
      return `
      <label class="service-option">
        <input type="radio" name="service" value="${service.id}" ${state.quote.service === service.id ? "checked" : ""} />
        <span class="service-name">${esc(service.name)}</span>
        <span class="service-note">${esc(hint)}</span>
      </label>`;
    })
    .join("");

  $("#quoteEyebrow").textContent = C.quote.eyebrow;
  $("#quoteTitle").textContent = C.quote.title;
  $("#quoteBody").textContent = C.quote.body;
  $("#quoteDisclaimer").textContent = C.quote.disclaimer;

  syncWeightInputs(state.quote.weight);
}

function syncWeightInputs(weight) {
  const range = $("#weightRange");
  const input = $("#weightInput");
  range.value = String(Math.min(Number(range.max), Math.max(Number(range.min), weight)));
  input.value = String(weight);
  $("#weightOutput").textContent = `${num(weight)} kg`;
}

function renderQuote() {
  $("#originSelect").value = state.quote.origin;
  $("#destinationSelect").value = state.quote.destination;
  const modeInput = $(`input[name="mode"][value="${state.quote.mode}"]`);
  if (modeInput) modeInput.checked = true;
  const serviceInput = $(`input[name="service"][value="${state.quote.service}"]`);
  if (serviceInput) serviceInput.checked = true;

  let result;
  try {
    result = priceQuote(C, state.quote);
  } catch (error) {
    $("#quoteResult").innerHTML = `<div class="result-head"><span>All-in estimate</span></div>
      <p class="result-total" style="font-size:22px">Pick two different ports</p>
      <p class="result-sub">Origin and destination must differ.</p>`;
    return;
  }

  const freight = result.items.find((item) => item.key === "freight").amount;
  const fixed = result.items.filter((item) => item.key === "terminal" || item.key === "security" || item.key === "docs").reduce((sum, item) => sum + item.amount, 0);
  const surcharge = result.total - freight - fixed;
  const pct = (value) => `${Math.max(0, Math.round((value / result.total) * 100))}%`;

  const arrival = new Date();
  arrival.setDate(arrival.getDate() + result.transitDays);
  const arrivalLabel = arrival.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const co2 = result.co2Kg >= 1000 ? `${(result.co2Kg / 1000).toFixed(1)} t` : `${num(result.co2Kg)} kg`;

  $("#quoteResult").innerHTML = `
    <div class="result-head">
      <span>All-in estimate</span>
      <span class="result-lane">${esc(result.origin.id)} → ${esc(result.destination.id)}</span>
    </div>
    <div class="result-total">${money(result.total)}</div>
    <div class="result-sub">USD · arrives around ${arrivalLabel} · $${result.perKg.toFixed(2)}/kg</div>

    <div class="cost-bar" aria-hidden="true">
      <i class="seg-freight" style="width:${pct(freight)}"></i>
      <i class="seg-surcharge" style="width:${pct(surcharge)}"></i>
      <i class="seg-fixed" style="width:${pct(fixed)}"></i>
    </div>

    <ul class="breakdown">
      ${result.items
        .map((item) => `<li><span>${esc(item.label)}</span><strong>${money(item.amount)}</strong></li>`)
        .join("")}
      <li class="is-total"><span>Total, ${esc(result.service.name.toLowerCase())}</span><strong>${money(result.total)}</strong></li>
    </ul>

    <div class="result-metrics">
      <div class="result-metric"><strong>${result.transitDays} days</strong><span>Door to door</span></div>
      <div class="result-metric"><strong>${co2}</strong><span>CO2e estimate</span></div>
    </div>`;
}

function onQuoteInput(event) {
  const target = event.target;
  if (target.id === "weightRange") {
    state.quote.weight = Number(target.value);
    syncWeightInputs(state.quote.weight);
  } else if (target.id === "weightInput") {
    if (target.value.trim() === "") return;
    const value = Math.round(Number(target.value));
    if (!Number.isFinite(value)) return;
    state.quote.weight = Math.min(C.quote.common.maxWeight, Math.max(1, value));
    const range = $("#weightRange");
    range.value = String(
      Math.min(Number(range.max), Math.max(Number(range.min), state.quote.weight))
    );
    $("#weightOutput").textContent = `${num(state.quote.weight)} kg`;
    if (event.type === "change") {
      state.quote.weight = Math.min(
        C.quote.common.maxWeight,
        Math.max(C.quote.common.minWeight, state.quote.weight)
      );
      syncWeightInputs(state.quote.weight);
    }
  } else if (target.id === "originSelect") {
    state.quote.origin = target.value;
    if (state.quote.origin === state.quote.destination) {
      const alternative = C.quote.locations.find((location) => location.id !== state.quote.origin);
      state.quote.destination = alternative.id;
      $("#destinationSelect").value = alternative.id;
    }
  } else if (target.id === "destinationSelect") {
    state.quote.destination = target.value;
    if (state.quote.destination === state.quote.origin) {
      const alternative = C.quote.locations.find((location) => location.id !== state.quote.destination);
      state.quote.origin = alternative.id;
      $("#originSelect").value = alternative.id;
    }
  } else if (target.name === "mode") {
    state.quote.mode = target.value;
  } else if (target.name === "service") {
    state.quote.service = target.value;
  } else {
    return;
  }
  renderQuote();
  if (target.id !== "weightInput") syncWeightInputs(state.quote.weight);
}

/* --------------------------------------------------------------------------
   How, stack, proof, integrations
   -------------------------------------------------------------------------- */
function renderHow() {
  $("#howEyebrow").textContent = C.how.eyebrow;
  $("#howTitle").textContent = C.how.title;
  $("#howBody").textContent = C.how.body;
  $("#stepList").innerHTML = C.how.steps
    .map(
      (step) => `
      <li class="step">
        <span class="step-number">${esc(step.number)}</span>
        <h3>${esc(step.title)}</h3>
        <p>${esc(step.body)}</p>
      </li>`
    )
    .join("");
}

function highlight(line) {
  return line
    .replace(/("[^"]*")/g, '<span class="tok-str">$1</span>')
    .replace(/^(\s*)([a-zA-Z_][\w]*)(:)/, '$1<span class="tok-key">$2</span>$3');
}

function renderStack() {
  $("#stackEyebrow").textContent = C.stack.eyebrow;
  $("#stackTitle").textContent = C.stack.title;
  $("#stackBody").textContent = C.stack.body;
  $("#stackPoints").innerHTML = C.stack.points
    .map((point) => `<li><strong>${esc(point.title)}</strong><p>${esc(point.body)}</p></li>`)
    .join("");
  $("#snippetTitle").textContent = C.stack.snippetTitle;
  $("#codeSnippet").innerHTML = C.stack.snippet.map((line) => highlight(line)).join("\n");
}

function renderProof() {
  $("#proofEyebrow").textContent = C.proof.eyebrow;
  $("#proofTitle").textContent = C.proof.title;
  $("#proofBody").textContent = C.proof.body;
  $("#caseGrid").innerHTML = C.proof.cases
    .map(
      (item) => `
      <article class="case-card">
        <span class="case-sector">${esc(item.sector)}</span>
        <div>
          <div class="case-metric">${esc(item.metric)}</div>
          <span class="case-metric-label">${esc(item.metricLabel)}</span>
        </div>
        <h3>${esc(item.client)}</h3>
        <p>${esc(item.summary)}</p>
        <ul class="case-tags">${item.tags.map((tag) => `<li>${esc(tag)}</li>`).join("")}</ul>
      </article>`
    )
    .join("");
}

function renderIntegrations() {
  $("#integrationLabel").textContent = C.integrations.label;
  $("#integrationChips").innerHTML = C.integrations.items.map((item) => `<li>${esc(item)}</li>`).join("");
}

/* --------------------------------------------------------------------------
   Contact + footer
   -------------------------------------------------------------------------- */
function renderContact() {
  const contact = C.contact;
  $("#contactEyebrow").textContent = contact.eyebrow;
  $("#contactTitle").textContent = contact.title;
  $("#contactBody").textContent = contact.body;
  $("#contactBullets").innerHTML = contact.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("");
  $("#contactLines").innerHTML = `
    <a href="mailto:${esc(C.brand.email)}">${esc(C.brand.email)}</a>
    <a href="tel:${esc(C.brand.phone.replace(/[^+\d]/g, ""))}">${esc(C.brand.phone)}</a>
    <span>${esc(C.brand.address)}</span>`;

  $("#labelName").textContent = contact.fields.name;
  $("#labelEmail").textContent = contact.fields.email;
  $("#labelCompany").textContent = contact.fields.company;
  $("#labelVolume").textContent = contact.fields.volume;
  $("#labelMessage").textContent = contact.fields.message;
  $("#contactSubmit").textContent = contact.submit;
  $("#formNote").textContent = contact.formNote;
  $("#contactVolume").innerHTML = contact.volumeOptions.map((option) => `<option>${esc(option)}</option>`).join("");
}

function renderFooter() {
  $("#footerTagline").textContent = `${C.brand.tagline}. ${C.brand.footerNote}`;
  const targets = {
    "Live board": "#board",
    "Exception desk": "#platform",
    Documents: "#platform",
    "Landed cost": "#platform",
    About: "#platform",
    Proof: "#proof",
    Careers: "#contact",
    Contact: "#contact",
    "Demo guide": "#board",
    "Rate table": "#quote",
    Status: "#top",
    Privacy: "#contact"
  };
  $("#footerCols").innerHTML = C.footer.columns
    .map(
      (column) => `
      <div class="footer-col">
        <h3>${esc(column.title)}</h3>
        ${column.links.map((link) => `<a href="${targets[link] || "#top"}">${esc(link)}</a>`).join("")}
      </div>`
    )
    .join("");
  $("#footerNote").textContent = `© ${new Date().getFullYear()} ${C.brand.name}. ${C.brand.tagline}.`;
  $("#footerSmallprint").textContent = C.footer.smallprint;
}

/* --------------------------------------------------------------------------
   Chrome behaviour
   -------------------------------------------------------------------------- */
let toastTimer;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

function wireEvents() {
  const header = $("#siteHeader");
  const progress = $("#progressBar");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = height > 0 ? `${Math.min(100, (window.scrollY / height) * 100)}%` : "0%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menuBtn = $("#menuBtn");
  const mobileNav = $("#mobileNav");
  const closeMenu = () => {
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    mobileNav.classList.remove("is-open");
  };
  menuBtn.addEventListener("click", () => {
    const open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!open));
    menuBtn.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    mobileNav.classList.toggle("is-open", !open);
  });
  mobileNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  $("#boardFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.filter = button.dataset.filter;
    const visible = filteredShipments();
    if (visible.length && !visible.some((shipment) => shipment.id === state.selectedId)) {
      state.selectedId = visible[0].id;
    }
    renderBoard();
  });

  $("#shipmentRows").addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-id]");
    if (row) selectShipment(row.dataset.id);
  });

  $("#shipmentRows").addEventListener("keydown", (event) => {
    const row = event.target.closest("tr[data-id]");
    if (!row) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectShipment(row.dataset.id);
    }
  });

  $("#shipmentDetail").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-detail-action]");
    if (!button) return;
    const shipment = C.board.shipments.find((item) => item.id === state.selectedId);
    if (!shipment) return;
    if (button.dataset.detailAction === "copy") {
      const link = `${window.location.origin}${window.location.pathname}#shipment=${shipment.id}`;
      const ok = await copyText(link);
      toast(ok ? `Tracking link copied for ${shipment.id}` : "Copy blocked by the browser");
    }
    if (button.dataset.detailAction === "escalate") {
      state.escalated.add(shipment.id);
      renderDetail();
      toast(`${shipment.id} escalated to the duty ops manager`);
    }
  });

  $("#quoteForm").addEventListener("input", onQuoteInput);
  $("#quoteForm").addEventListener("change", onQuoteInput);

  const contactForm = $("#contactForm");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    const status = $("#formStatus");
    status.textContent = C.contact.success;
    status.classList.add("is-visible");
    const button = $("#contactSubmit");
    button.textContent = "Request sent";
    button.disabled = true;
    toast("Demo submission received");
  });
}

function wireReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((item) => observer.observe(item));
}

function wireActiveNav() {
  const links = $$("#navLinks a");
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window) || !sections.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}

function openLinkedShipment() {
  const match = window.location.hash.match(/shipment=([A-Za-z0-9-]+)/);
  if (!match) return;
  const shipment = C.board.shipments.find((item) => item.id.toLowerCase() === match[1].toLowerCase());
  if (shipment) {
    state.selectedId = shipment.id;
    renderBoard();
  }
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
function boot() {
  renderChrome();
  renderHero();
  renderStats();
  renderPlatform();
  renderBoard();
  populateQuote();
  renderQuote();
  renderHow();
  renderStack();
  renderProof();
  renderIntegrations();
  renderContact();
  renderFooter();
  wireEvents();
  wireReveal();
  wireActiveNav();
  openLinkedShipment();
}

boot();
