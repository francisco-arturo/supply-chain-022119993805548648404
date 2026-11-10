/*
 * Cargolane - the whole website reads from this file.
 * Edit copy, lanes, shipments, rates and case studies here. No build step.
 */
window.CONTENT = {
  brand: {
    name: "Cargolane",
    mark: "CL",
    tagline: "Supply-chain control tower",
    email: "hello@cargolane.example",
    phone: "+1 (415) 555-0138",
    address: "Pier 9, The Embarcadero, San Francisco, CA",
    footerNote: "Demo site. Rates, shipments and case studies are seeded sample data."
  },

  nav: {
    links: [
      { label: "Platform", href: "#platform" },
      { label: "Live board", href: "#board" },
      { label: "Quote", href: "#quote" },
      { label: "Proof", href: "#proof" }
    ],
    cta: { label: "Book a walkthrough", href: "#contact" }
  },

  hero: {
    eyebrow: "Supply-chain control tower",
    title: { pre: "Every container, every ETA,", em: "one honest", post: "screen." },
    paragraph:
      "Cargolane pulls your forwarder, carriers and warehouses into a single tracking board. See where freight actually is, what it will cost, and which exception needs a human before the demurrage clock starts.",
    ctas: [
      { label: "Open the live board", href: "#board", variant: "primary" },
      { label: "Get a lane quote", href: "#quote", variant: "ghost" }
    ],
    proof: "Built for mid-market importers moving 20 to 2,000 containers a year.",
    panel: {
      label: "Network status",
      live: "Live",
      caption: "8 active lanes",
      kpis: [
        { value: "94.2%", label: "on-time arrivals" },
        { value: "128", label: "shipments in motion" },
        { value: "3", label: "open exceptions" }
      ],
      nodes: [
        { id: "LAX", label: "LAX", x: 62, y: 168 },
        { id: "NYC", label: "NYC", x: 74, y: 92 },
        { id: "RTM", label: "RTM", x: 214, y: 74 },
        { id: "HAM", label: "HAM", x: 238, y: 58 },
        { id: "JEA", label: "JEA", x: 300, y: 132 },
        { id: "SIN", label: "SIN", x: 382, y: 196 },
        { id: "SHA", label: "SHA", x: 436, y: 120 }
      ],
      links: [
        { from: "SHA", to: "RTM", hot: true },
        { from: "SIN", to: "RTM" },
        { from: "SHA", to: "LAX" },
        { from: "HAM", to: "NYC" },
        { from: "JEA", to: "SIN" },
        { from: "LAX", to: "NYC" }
      ]
    }
  },

  logos: {
    label: "Freight moving for teams at",
    items: ["Northwind Foods", "Kestrel Robotics", "Palma Home", "Halden Chemicals", "Marlow Apparel"]
  },

  strip: [
    { value: "38%", label: "less demurrage", note: "sample network, 90 days" },
    { value: "11 min", label: "average exception response", note: "from alert to owner" },
    { value: "6", label: "carriers, one board", note: "ocean, air and road" },
    { value: "0", label: "spreadsheets required", note: "your team will check" }
  ],

  platform: {
    eyebrow: "Platform",
    title: "The parts of freight nobody enjoys, on one screen.",
    body:
      "Most teams run supply chain on a forwarder portal, four carrier sites, a spreadsheet and someone's inbox. Cargolane puts the same facts in one place, with an owner and a deadline attached.",
    features: [
      {
        icon: "radar",
        title: "Live milestones",
        body: "Gate in, departure, transshipment, customs, delivery. Pulled from carrier feeds and your forwarder, normalised into one timeline."
      },
      {
        icon: "bolt",
        title: "Exception desk",
        body: "Port congestion, rolled bookings and customs holds arrive as tasks with a dollar impact, not as a surprise invoice six weeks later."
      },
      {
        icon: "doc",
        title: "Documents in one folder",
        body: "Bills of lading, packing lists and certificates sit against the shipment they belong to. No more email archaeology."
      },
      {
        icon: "layers",
        title: "Landed cost, before you book",
        body: "Freight, surcharges, duty and demurrage risk land in one number, so sales can quote with a margin you actually keep."
      }
    ]
  },

  board: {
    eyebrow: "Live board",
    title: "A tracking board your whole team can read.",
    body:
      "This is a working demo on seeded freight. Filter the board, open a shipment, and walk the milestone trail the way your operations team would on a Monday morning.",
    hint: "Click any shipment to open its trail.",
    filters: [
      { key: "all", label: "All" },
      { key: "transit", label: "In transit" },
      { key: "delayed", label: "Delayed" },
      { key: "risk", label: "At risk" },
      { key: "delivered", label: "Delivered" }
    ],
    shipments: [
      {
        id: "CL-4821",
        origin: "Shanghai",
        destination: "Rotterdam",
        mode: "Ocean FCL",
        carrier: "Maersk",
        container: "MSKU 482 119 3",
        weight: "18,400 kg",
        value: "$184,000",
        status: "In transit",
        statusKey: "transit",
        progress: 78,
        eta: "Nov 18",
        etaNote: "On schedule",
        vessel: "Maersk Sealand / 224E",
        incoterm: "CIF",
        exception: "None open. Booking is inside the free-time window.",
        milestones: [
          { label: "Booking confirmed", place: "Shanghai", time: "Oct 28, 09:12", done: true },
          { label: "Gate in at origin", place: "Yangshan Terminal", time: "Oct 30, 16:40", done: true },
          { label: "Vessel departed", place: "Shanghai", time: "Nov 1, 03:25", done: true },
          { label: "Transshipment", place: "Singapore", time: "Nov 5, 21:10", done: true },
          { label: "Arrival at destination", place: "Rotterdam", time: "Est. Nov 18", done: false, current: true },
          { label: "Customs release", place: "Rotterdam", time: "Pending", done: false },
          { label: "Delivered", place: "Venlo DC", time: "Pending", done: false }
        ]
      },
      {
        id: "CL-4816",
        origin: "Singapore",
        destination: "Los Angeles",
        mode: "Ocean FCL",
        carrier: "ONE",
        container: "ONEU 731 402 8",
        weight: "22,100 kg",
        value: "$96,500",
        status: "Delayed",
        statusKey: "delayed",
        progress: 54,
        eta: "Nov 23",
        etaNote: "5 days late",
        vessel: "ONE Innovation / 018W",
        incoterm: "FOB",
        exception: "Customs hold at destination. Bonded storage starts Nov 14 ($210/day).",
        milestones: [
          { label: "Booking confirmed", place: "Singapore", time: "Oct 26, 11:05", done: true },
          { label: "Gate in at origin", place: "Tuas Port", time: "Oct 29, 08:20", done: true },
          { label: "Vessel departed", place: "Singapore", time: "Oct 31, 19:45", done: true },
          { label: "Arrival at destination", place: "Los Angeles", time: "Nov 14, 06:30", done: true },
          { label: "Customs hold", place: "Los Angeles", time: "Nov 14, 14:10", done: false, current: true },
          { label: "Customs release", place: "Los Angeles", time: "Est. Nov 22", done: false },
          { label: "Delivered", place: "Ontario, CA", time: "Est. Nov 23", done: false }
        ]
      },
      {
        id: "CL-4809",
        origin: "Hamburg",
        destination: "New York",
        mode: "Ocean LCL",
        carrier: "Hapag-Lloyd",
        container: "Consolidated / C-219",
        weight: "3,850 kg",
        value: "$42,800",
        status: "In transit",
        statusKey: "transit",
        progress: 41,
        eta: "Nov 20",
        etaNote: "On schedule",
        vessel: "Berlin Express / 441E",
        incoterm: "DAP",
        exception: "None open. Co-loaded with two other shipments.",
        milestones: [
          { label: "Booking confirmed", place: "Hamburg", time: "Nov 1, 10:02", done: true },
          { label: "Cargo received", place: "Hamburg CFS", time: "Nov 4, 15:35", done: true },
          { label: "Vessel departed", place: "Hamburg", time: "Nov 7, 22:15", done: true },
          { label: "Arrival at destination", place: "New York", time: "Est. Nov 19", done: false, current: true },
          { label: "Devanned", place: "Newark CFS", time: "Est. Nov 20", done: false },
          { label: "Delivered", place: "Brooklyn, NY", time: "Est. Nov 20", done: false }
        ]
      },
      {
        id: "CL-4802",
        origin: "Shenzhen",
        destination: "Dubai",
        mode: "Air freight",
        carrier: "Emirates SkyCargo",
        container: "AKE 62418 / 2 pallets",
        weight: "1,240 kg",
        value: "$268,000",
        status: "Delivered",
        statusKey: "delivered",
        progress: 100,
        eta: "Nov 7",
        etaNote: "Delivered 1 day early",
        vessel: "EK 9823 / 07 Nov",
        incoterm: "DDP",
        exception: "None. Proof of delivery signed by A. Haddad.",
        milestones: [
          { label: "Booking confirmed", place: "Shenzhen", time: "Nov 3, 13:40", done: true },
          { label: "Cargo delivered to carrier", place: "Shenzhen Airport", time: "Nov 4, 21:05", done: true },
          { label: "Flight departed", place: "Shenzhen", time: "Nov 5, 02:30", done: true },
          { label: "Arrival at destination", place: "Dubai", time: "Nov 5, 07:55", done: true },
          { label: "Customs released", place: "Dubai", time: "Nov 6, 10:20", done: true },
          { label: "Delivered", place: "Jebel Ali Free Zone", time: "Nov 7, 09:15", done: true }
        ]
      },
      {
        id: "CL-4798",
        origin: "Nhava Sheva",
        destination: "Felixstowe",
        mode: "Ocean FCL",
        carrier: "MSC",
        container: "MSCU 908 771 2",
        weight: "26,700 kg",
        value: "$312,000",
        status: "At risk",
        statusKey: "risk",
        progress: 33,
        eta: "Nov 29",
        etaNote: "Watching congestion",
        vessel: "MSC Aurora / 339W",
        incoterm: "CIF",
        exception: "Port congestion at Felixstowe. Carrier may omit the call and discharge at Antwerp.",
        milestones: [
          { label: "Booking confirmed", place: "Nhava Sheva", time: "Oct 24, 12:10", done: true },
          { label: "Gate in at origin", place: "JNPT", time: "Oct 27, 07:50", done: true },
          { label: "Vessel departed", place: "Nhava Sheva", time: "Oct 29, 18:30", done: true },
          { label: "Suez transit", place: "Suez Canal", time: "Nov 6, 04:15", done: true },
          { label: "Arrival at destination", place: "Felixstowe", time: "Est. Nov 26", done: false, current: true },
          { label: "Customs release", place: "Felixstowe", time: "Pending", done: false },
          { label: "Delivered", place: "Leeds DC", time: "Est. Nov 29", done: false }
        ]
      },
      {
        id: "CL-4791",
        origin: "Ho Chi Minh",
        destination: "Long Beach",
        mode: "Ocean FCL",
        carrier: "CMA CGM",
        container: "CMAU 551 043 6",
        weight: "15,300 kg",
        value: "$77,400",
        status: "In transit",
        statusKey: "transit",
        progress: 64,
        eta: "Nov 21",
        etaNote: "On schedule",
        vessel: "CMA CGM Marco Polo / 118E",
        incoterm: "FOB",
        exception: "None open. Rail leg to Chicago still unbooked.",
        milestones: [
          { label: "Booking confirmed", place: "Ho Chi Minh", time: "Oct 27, 08:45", done: true },
          { label: "Gate in at origin", place: "Cat Lai", time: "Oct 30, 11:20", done: true },
          { label: "Vessel departed", place: "Ho Chi Minh", time: "Nov 1, 14:05", done: true },
          { label: "Transshipment", place: "Busan", time: "Nov 6, 09:40", done: true },
          { label: "Arrival at destination", place: "Long Beach", time: "Est. Nov 21", done: false, current: true },
          { label: "Customs release", place: "Long Beach", time: "Pending", done: false },
          { label: "Delivered", place: "Chicago, IL", time: "Est. Nov 26", done: false }
        ]
      },
      {
        id: "CL-4786",
        origin: "Taipei",
        destination: "Chicago",
        mode: "Air freight",
        carrier: "China Airlines",
        container: "2 LD3 / 1,860 kg",
        weight: "1,860 kg",
        value: "$141,000",
        status: "Delivered",
        statusKey: "delivered",
        progress: 100,
        eta: "Nov 4",
        etaNote: "Delivered on time",
        vessel: "CI 522 / 03 Nov",
        incoterm: "DAP",
        exception: "None. Delivered to O'Hare bonded warehouse.",
        milestones: [
          { label: "Booking confirmed", place: "Taipei", time: "Oct 31, 16:20", done: true },
          { label: "Cargo delivered to carrier", place: "Taoyuan Airport", time: "Nov 1, 20:10", done: true },
          { label: "Flight departed", place: "Taipei", time: "Nov 2, 23:45", done: true },
          { label: "Arrival at destination", place: "Chicago", time: "Nov 3, 18:30", done: true },
          { label: "Customs released", place: "Chicago", time: "Nov 4, 08:05", done: true },
          { label: "Delivered", place: "Elk Grove Village, IL", time: "Nov 4, 12:40", done: true }
        ]
      },
      {
        id: "CL-4779",
        origin: "Busan",
        destination: "Antwerp",
        mode: "Ocean FCL",
        carrier: "HMM",
        container: "HMMU 220 887 1",
        weight: "20,050 kg",
        value: "$58,900",
        status: "In transit",
        statusKey: "transit",
        progress: 88,
        eta: "Nov 16",
        etaNote: "On schedule",
        vessel: "HMM Algeciras / 092W",
        incoterm: "FCA",
        exception: "None open. Delivery slot not confirmed with consignee.",
        milestones: [
          { label: "Booking confirmed", place: "Busan", time: "Oct 22, 10:15", done: true },
          { label: "Gate in at origin", place: "Busan New Port", time: "Oct 24, 13:55", done: true },
          { label: "Vessel departed", place: "Busan", time: "Oct 26, 05:20", done: true },
          { label: "Suez transit", place: "Suez Canal", time: "Nov 8, 17:45", done: true },
          { label: "Arrival at destination", place: "Antwerp", time: "Est. Nov 16", done: false, current: true },
          { label: "Customs release", place: "Antwerp", time: "Pending", done: false },
          { label: "Delivered", place: "Ghent, BE", time: "Est. Nov 17", done: false }
        ]
      }
    ]
  },

  quote: {
    eyebrow: "Instant quote",
    title: "A lane price in one screen, not five emails.",
    body:
      "Pick a lane, a mode and a weight. The estimate below is computed in the browser from the rate table in content.js, so a non-technical owner can adjust the numbers and see the page change.",
    disclaimer: "Demo estimate. Not a carrier offer and not a customs ruling.",
    defaultSelection: { origin: "SHA", destination: "RTM", mode: "ocean", weight: 18000, service: "standard" },
    locations: [
      { id: "SHA", name: "Shanghai", country: "China", lat: 31.23, lon: 121.47 },
      { id: "SZX", name: "Shenzhen", country: "China", lat: 22.54, lon: 114.06 },
      { id: "SIN", name: "Singapore", country: "Singapore", lat: 1.35, lon: 103.82 },
      { id: "NSA", name: "Nhava Sheva", country: "India", lat: 18.95, lon: 72.95 },
      { id: "BUS", name: "Busan", country: "South Korea", lat: 35.1, lon: 129.04 },
      { id: "SGN", name: "Ho Chi Minh", country: "Vietnam", lat: 10.82, lon: 106.63 },
      { id: "HAM", name: "Hamburg", country: "Germany", lat: 53.55, lon: 9.99 },
      { id: "RTM", name: "Rotterdam", country: "Netherlands", lat: 51.92, lon: 4.48 },
      { id: "LAX", name: "Los Angeles", country: "United States", lat: 33.74, lon: -118.27 },
      { id: "LGB", name: "Long Beach", country: "United States", lat: 33.77, lon: -118.19 },
      { id: "NYC", name: "New York", country: "United States", lat: 40.71, lon: -74.01 },
      { id: "FXT", name: "Felixstowe", country: "United Kingdom", lat: 51.96, lon: 1.35 },
      { id: "DXB", name: "Dubai", country: "United Arab Emirates", lat: 25.2, lon: 55.27 },
      { id: "CHI", name: "Chicago", country: "United States", lat: 41.88, lon: -87.63 }
    ],
    modes: [
      { id: "ocean", name: "Ocean FCL", note: "Best for full containers and heavy cargo" },
      { id: "air", name: "Air freight", note: "Best for launches, spares and high value" }
    ],
    services: [
      { id: "economy", name: "Economy", multiplier: 0.86, transitFactor: 1.24, note: "Slowest, lowest cost" },
      { id: "standard", name: "Standard", multiplier: 1, transitFactor: 1, note: "Our default routing" },
      { id: "priority", name: "Priority", multiplier: 1.34, transitFactor: 0.72, note: "Booked space, expedited" }
    ],
    rates: {
      ocean: { base: 820, perKg: 0.055, perKm: 0.058, kmPerDay: 850, fixedDays: 12, terminal: 185, security: 32, co2: 0.016 },
      air: { base: 260, perKg: 2.1, perKm: 0.031, kmPerDay: 6000, fixedDays: 1, terminal: 95, security: 18, co2: 0.602 }
    },
    common: { fuelPercent: 0.14, documentation: 85, maxWeight: 28000, minWeight: 50 }
  },

  how: {
    eyebrow: "How it works",
    title: "Live in a week, not a quarter.",
    body: "The board is the product. Everything around it exists to get your first lane onto it without a six-month integration programme.",
    steps: [
      {
        number: "01",
        title: "Send us a lane",
        body: "One active booking, one carrier, one forwarder. We connect that lane before touching anything else, so week one ends with your real freight on screen."
      },
      {
        number: "02",
        title: "We map the trail",
        body: "Milestones, documents and exception owners are configured to match how your team already works. No process redesign, no new vocabulary."
      },
      {
        number: "03",
        title: "Your team takes over",
        body: "The site and board are plain HTML, CSS and one content file. Add lanes, change copy or adjust rate tables without calling us."
      }
    ]
  },

  stack: {
    eyebrow: "No black box",
    title: "Built in a stack you can actually open.",
    body:
      "No framework, no build step, no proprietary page builder. The whole site is a handful of files, and every word, lane and rate comes from one readable content file.",
    points: [
      {
        title: "HTML, CSS and one content file",
        body: "index.html for structure, styles.css for design, content.js for copy and data. A developer can read all of it in an afternoon."
      },
      {
        title: "Change a word, refresh",
        body: "Headlines, case studies, shipments, lane rates and form labels live in content.js. No CMS login, no deploy pipeline to learn."
      },
      {
        title: "Deploys anywhere",
        body: "One command puts it on Vercel, or drop the folder on Netlify, Cloudflare Pages or any static host. Your next developer is never locked out."
      }
    ],
    snippetTitle: "content.js",
    snippet: [
      "window.CONTENT = {",
      "  hero: {",
      "    title: \"Every container, every ETA, one honest screen.\",",
      "    cta: \"Open the live board\"",
      "  },",
      "  quote: {",
      "    rates: { ocean: { base: 820, perKm: 0.058 } }",
      "  }",
      "};"
    ]
  },

  proof: {
    eyebrow: "Proof",
    title: "Three teams, three very different supply chains.",
    body: "Sample outcomes from the demo dataset, showing the kind of problem the board is built to solve.",
    cases: [
      {
        client: "Northwind Foods",
        sector: "Grocery imports",
        metric: "38%",
        metricLabel: "less demurrage",
        summary:
          "Reefer containers were sitting past free time because nobody owned the customs clock. The board gave every hold an owner and a countdown.",
        tags: ["Ocean FCL", "Reefer", "12 lanes"]
      },
      {
        client: "Kestrel Robotics",
        sector: "Electronics manufacturing",
        metric: "6 days",
        metricLabel: "off air-freight lead time",
        summary:
          "Two suppliers, one consolidated air lane. Milestone alerts replaced a daily status meeting and caught a missed uplift before the weekend.",
        tags: ["Air freight", "Multi-leg", "4 suppliers"]
      },
      {
        client: "Palma Home",
        sector: "Furniture, direct to consumer",
        metric: "14",
        metricLabel: "suppliers on one board",
        summary:
          "Landed cost per SKU finally matched the invoice. Sales could quote a delivery window that survived contact with port congestion.",
        tags: ["Ocean LCL", "DTC", "Landed cost"]
      }
    ]
  },

  integrations: {
    label: "Plays nicely with the tools you already pay for",
    items: ["SAP", "NetSuite", "Shopify", "Xero", "Slack", "Microsoft Teams", "Google Sheets", "Salesforce", "SFTP / CSV"]
  },

  contact: {
    eyebrow: "Next step",
    title: "Put one real lane on the board this week.",
    body:
      "Tell us what you ship and where it gets stuck. We will map one live lane and show you the board with your freight on it, not a generic demo.",
    bullets: [
      "One lane connected in week one",
      "Your copy, your rates, your process",
      "Plain files handed over, no lock-in"
    ],
    formNote: "Demo form. Nothing is sent anywhere.",
    fields: {
      name: "Name",
      email: "Work email",
      company: "Company",
      volume: "What are you shipping?",
      message: "What gets stuck today?"
    },
    volumeOptions: ["Ocean FCL", "Ocean LCL", "Air freight", "Road freight", "Not sure yet"],
    submit: "Request a walkthrough",
    success: "Thanks. This demo does not send email, but on the live site you would hear back within one business day."
  },

  footer: {
    columns: [
      { title: "Platform", links: ["Live board", "Exception desk", "Documents", "Landed cost"] },
      { title: "Company", links: ["About", "Proof", "Careers", "Contact"] },
      { title: "Resources", links: ["Demo guide", "Rate table", "Status", "Privacy"] }
    ],
    smallprint: "Cargolane is a fictional product built as a working prototype."
  }
};
