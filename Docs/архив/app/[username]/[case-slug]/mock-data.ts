export const caseMock = {
  username: "alex",
  slug: "modern-ecommerce-platform",
  title: "Modern E-commerce Platform",
  subtitle:
    "Redesigning the end-to-end checkout flow to cut abandonment and rebuild trust at every step.",
  heroImage:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=555&fit=crop",
  metadata: [
    { label: "CLIENT", value: "TechStore Inc." },
    { label: "TIMELINE", value: "2024 · 3 Months" },
    { label: "MY ROLE", value: "End-to-End UX/UI Design" },
    { label: "DEVICES", value: "Desktop & Mobile Web" },
  ],
  problem: {
    number: "01",
    name: "Problem & Audience",
    heading: "What problem are we solving?",
    description:
      "The existing checkout had a 74% abandonment rate. Users dropped off when faced with unclear shipping costs, forced account creation, and a fragmented payment experience.",
    cards: [
      {
        title: "Goal",
        body: "Reduce checkout abandonment below 40% and increase completed purchases by clarifying costs, simplifying auth, and streamlining payment.",
      },
      {
        title: "Target Users",
        body: "Mobile-first shoppers aged 25–45 who value speed, transparent pricing, and guest checkout — often comparing 2–3 stores before buying.",
      },
    ],
  },
  research: {
    number: "02",
    name: "User Research",
    heading: "What the data revealed.",
    description:
      "8 contextual interviews, a 120-person survey, and session replays surfaced three blockers that explained most of the drop-off.",
    metrics: [
      { value: "74%", label: "Checkout abandonment" },
      { value: "2.4×", label: "More drop-offs on mobile" },
      { value: "61%", label: "Cited surprise fees" },
    ],
    persona: {
      name: "Maya Chen",
      role: "Busy product manager · Frequent online shopper",
      quote:
        "I abandon carts the moment shipping jumps at the last step. Just tell me the real total up front.",
      traits: ["Time-poor", "Price-sensitive", "Mobile-first"],
    },
  },
  process: {
    number: "03",
    name: "Design Process",
    heading: "From blank page to structure.",
    description:
      "From wireframes to pixels — we mapped the full checkout journey, stress-tested edge cases, and aligned stakeholders around a single happy path.",
    body: "We started with task flows and low-fidelity wireframes, then iterated through three rounds of critique. Each screen was designed mobile-first, then expanded to desktop with shared components.",
    wireframes: [
      "Cart overview",
      "Shipping & address",
      "Payment methods",
      "Order confirmation",
    ],
    prototypeLabel: "View Lo-Fi prototype in Figma",
    prototypeHref: "#",
  },
  designSystem: {
    number: "04",
    name: "Design System",
    heading: "Visual language & token system.",
    description:
      "Clean, high-contrast e-commerce aesthetics built on Material You tokens — forest primary, coral accents, and calm neutral surfaces.",
    typeSamples: [
      { label: "Display", sample: "Aa", detail: "Poppins 52 / 60" },
      { label: "Headline", sample: "Aa", detail: "Poppins 34 / 42" },
      { label: "Title", sample: "Aa", detail: "Poppins 20 / 28" },
      { label: "Body", sample: "Aa", detail: "Inter 16 / 24" },
      { label: "Label", sample: "Aa", detail: "Inter 13 / 20" },
      { label: "Overline", sample: "Aa", detail: "Inter 10 / 16" },
    ],
  },
  testing: {
    number: "05",
    name: "Testing & Iteration",
    heading: "What users taught me.",
    description:
      "What users taught us during testing shaped the final payment hierarchy and error recovery patterns.",
    body: "Moderated usability testing with 5 participants uncovered friction in address autocomplete and trust signals around guest checkout. We iterated twice before high-fidelity polish.",
    comparisons: [
      {
        label: "Block Before/After — 01",
        before: "Forced account wall before payment",
        after: "Guest checkout with optional save",
      },
      {
        label: "Block Before/After — 02",
        before: "Fees revealed on final step only",
        after: "Live total with shipping preview",
      },
    ],
  },
  final: {
    number: "06",
    name: "Final Design",
    heading: "The Finished Product",
    description:
      "A premium, high-converting checkout experience with transparent pricing, flexible auth, and a calm visual system.",
    body: "The final UI balances clarity and brand warmth — progressive disclosure for edge cases, strong focus states, and a payment step that feels as safe as it is fast.",
    showcases: [
      "Checkout — cart & summary",
      "Checkout — shipping",
      "Checkout — confirmation",
    ],
    prototypeLabel: "View Hi-Fi prototype in Figma",
    prototypeHref: "#",
    results: [
      { value: "−48%", label: "Abandonment rate" },
      { value: "+36%", label: "Completed checkouts" },
      { value: "4.8/5", label: "Task success score" },
      { value: "WCAG 2.2", label: "AA compliant" },
    ],
    tools: ["Figma", "FigJam", "Maze", "Notion", "React"],
  },
  reflection: {
    number: "07",
    name: "Reflection",
    heading: "What I learned.",
    description:
      "Trust is not built through words — it is built through predictable totals, honest defaults, and recovery paths that never punish the user.",
    body: "Shipping transparency and guest checkout were the highest-leverage changes. Visual polish mattered less than removing moments of surprise.",
    nextSteps: [
      "Roll out one-click pay for returning guests",
      "Localize tax & shipping for EU markets",
      "Instrument funnel analytics per payment method",
    ],
  },
  nextProject: {
    title: "Mobile Banking App Redesign",
    subtitle:
      "Elevating the daily banking journey with clearer balances, smarter transfers, and calmer security flows.",
    href: "#",
  },
  author: {
    name: "Alex Rivera",
    tagline: "Product designer · Digital Craftsmanship",
  },
} as const;
