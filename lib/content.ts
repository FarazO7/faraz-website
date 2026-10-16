// ---------------------------------------------------------------------------
// All site copy and data lives here. Edit this file to change content —
// components only render what they're given.
// ---------------------------------------------------------------------------

/** Stable ids for every organisation on the timeline (jobs and schools). */
export type OrgId =
  | "zamplitude"
  | "newton"
  | "healthkart"
  | "healthmug"
  | "mdi"
  | "kiit";

/** A bullet may link to its impact page at /impact/{impact}. */
export type Bullet = string | { text: string; impact?: string };

export function bulletParts(bullet: Bullet): { text: string; impact?: string } {
  return typeof bullet === "string" ? { text: bullet } : bullet;
}

export type Role = {
  id: OrgId;
  title: string;
  company: string;
  /** Shorter company name where space is tight; defaults to `company`. */
  companyShort?: string;
  /** The resume's company descriptor, shown after the name on the timeline. */
  descriptor?: string;
  location: string;
  dates: string;
  current?: boolean;
  /** The resume's one-line role summary, shown above the bullets. */
  summary?: string;
  bullets: Bullet[];
};

// The single `current: true` role comes first. The hero title, metadata and
// JSON-LD derive from it (see `currentRole`), so a job change is one edit here.
// Bullets follow the resume, verbatim and in resume order.
export const experience: Role[] = [
  {
    id: "zamplitude",
    title: "Product Manager",
    company: "Zamplitude",
    descriptor: "Dubai-based SaaS firm",
    location: "Remote, India",
    dates: "Mar 2026 – Present",
    current: true,
    summary:
      "First PM hire. Own discovery and Agile delivery of a KYC/AML compliance platform (risk scoring, compliance review, AML screening) for a regulated investment firm; the first module shipped on schedule.",
    bullets: [
      {
        text: "Partnered with the client's Compliance Officer on risk-scoring bands and auto-approval thresholds over verified digital-ID data, replacing case-by-case review: 68% of applications auto-cleared and turnaround fell from 72 hours to under 8.",
        impact: "risk-scoring",
      },
      {
        text: "Traced where KYC reviews stalled through 12 requirement sessions with 4 client compliance stakeholders, then redesigned the review and approval workflow, lifting first-pass compliance clearance from 23% to 61%.",
        impact: "kyc-review-workflow",
      },
      {
        text: "Cut question-change turnaround from 5 days to same day by replacing an email approval trail with a compliance dashboard: two-level sign-off for KYC and Enhanced Due Diligence (EDD) questions, plus EDD assignment to flagged users.",
        impact: "compliance-dashboard",
      },
      {
        text: "Audited 30+ compliance actions against regulatory obligations, exposing shared-login risk, and prioritised a Roles and Permissions module over competing scope, replacing every shared login with individual, role-based access.",
        impact: "roles-permissions",
      },
      {
        text: "Parsed the AML vendor's specification programmatically, flagged 2 contradictions before build and published a mock service with API contracts, unblocking frontend and QA 3 weeks before sandbox access (~120 hours of rework saved).",
        impact: "aml-mock-service",
      },
    ],
  },
  {
    id: "newton",
    title: "Associate Product Manager",
    company: "Newton School",
    descriptor: "edtech",
    location: "Bengaluru",
    dates: "Mar 2025 – Mar 2026",
    summary:
      "Acquisition, enrolment, payments and exam-operations products for an online tech-education platform.",
    bullets: [
      {
        text: "Found manual proctoring could not scale across 15,000+ exam sessions; took an AI exam-monitoring system from 0 to 1 through discovery, PRDs and a cross-functional launch, cutting manual proctoring from 100 to 30 hours per exam batch.",
        impact: "ai-proctoring",
      },
      {
        text: "Lifted referral-to-signup conversion from 7% to 12% by pinpointing drop-off through funnel and cohort analysis, prioritising an incentive redesign over competing bets and validating it in A/B tests.",
        impact: "referral-growth",
      },
      {
        text: "Owned acquisition-funnel experimentation: landing-page A/B tests prioritised by impact and effort and tracked on self-serve dashboards (DAU/MAU, activation); sign-up conversion nearly doubled, from 10% to 19.1%.",
        impact: "signup-conversion",
      },
      {
        text: "Diagnosed bottlenecks in manual payment reconciliation and replaced it with a Razorpay API integration (API specs, QA): payments reconciled in real time with no mismatches, reducing manual reconciliation effort by 99%.",
        impact: "razorpay-route",
      },
      {
        text: "Identified enrolment bottlenecks behind stalled waitlists and shipped an automated seat-allocation workflow: 60 of 200 waitlisted learners (30%) converted to enrolments and no seats went unfilled.",
        impact: "waitlist-automation",
      },
    ],
  },
  {
    id: "healthkart",
    title: "Product Management Trainee",
    company: "HealthKart",
    descriptor: "health and nutrition e-commerce",
    location: "Gurugram",
    dates: "Aug 2024 – Mar 2025",
    summary:
      "Product trainee on the warehouse, inventory and order management systems (WMS, OMS) that run HealthKart's fulfilment.",
    bullets: [
      "With warehouse ops and engineering, cut picking errors by 10% by introducing scan-based WMS validation and FEFO (first-expiry, first-out) checks, backed by SOPs and staff training.",
      "With the OMS engineering team, cut stock-out cancellations from 8% to 6% and order-to-dispatch time from 10 to 8 hours by syncing inventory across sales channels and routing orders to the nearest in-stock warehouse.",
      "Ran user research with internal ops users to map journeys and surface workflow gaps; prioritised a platform migration and wrote its PRDs and user stories, removing a blocker to SOC-2 compliance.",
    ],
  },
  {
    id: "healthmug",
    title: "Category Management Intern (PGDM internship)",
    company: "Healthmug",
    descriptor: "health e-commerce",
    location: "New Delhi",
    dates: "Apr 2023 – Jul 2023",
    bullets: [
      "With the category team, lifted the repeat-purchase rate from 20% to 25% by analysing purchase behaviour for repeat drivers and changing merchandising and retention tactics to match.",
      "Spotted demand gaps in category data and expanded the assortment from 1,230 to 1,820 SKUs (+48%), driving 35% month-on-month category growth.",
    ],
  },
];

/** Sectors worked in, shown as chips atop Experience. */
export const domains = [
  "Regulated Fintech",
  "KYC/AML",
  "Payments",
  "Edtech",
  "E-commerce",
  "WMS",
  "OMS",
];

/** The role marked `current: true` (scripts/check-content.ts asserts exactly one, listed first). */
export const currentRole: Role =
  experience.find((role) => role.current) ?? experience[0];

export function getRole(id: OrgId): Role | undefined {
  return experience.find((role) => role.id === id);
}

const NAME = "Faraz Ali";

export const identity = {
  name: NAME,
  title: currentRole.title,
  location: "Bengaluru, India",
  company: currentRole.company,
  tenure: currentRole.dates,
  // Resume summary, sentences one and three (meta description, OG and Twitter text).
  positioning:
    "Product Manager with 2+ years across regulated fintech (KYC/AML), edtech growth and e-commerce operations (WMS, OMS). Focused on B2B fintech platforms and applied AI.",
  companyShort: currentRole.companyShort ?? currentRole.company,
  greeting: "Hello there!",
  // REVIEW(Faraz): resume summary in the first person (October 2026 resume
  // sync), plus the AI-builder line drawn from the Signal project.
  bio:
    "I'm a product manager with 2+ years across regulated fintech (KYC/AML), edtech growth and e-commerce operations (WMS, OMS). As the first PM hire at Zamplitude, I own a regulated investment firm's KYC/AML platform; at Newton School, I launched AI exam monitoring and nearly doubled sign-up conversion. I'm focused on B2B fintech platforms and applied AI, and I build AI prototypes myself, with evaluation harnesses and human-in-the-loop review.",
  siteUrl: "https://faraz-website.vercel.app",
  phone: "+91 79911 93433",
  phoneHref: "tel:+917991193433",
  email: "faraz139@gmail.com",
  linkedin: "https://linkedin.com/in/-faraz",
  github: "https://github.com/FarazO7",
  githubUsername: "FarazO7",
  // Place the PDF at public/resume/Faraz-Ali-Product-Manager.pdf
  resumePath: "/resume/Faraz-Ali-Product-Manager.pdf",
  // Optimised WebP headshot (1024×1024). Source PNG kept in public/images/.
  headshotPath: "/images/faraz-ali.webp",
  headshotAlt: `${NAME}, ${currentRole.title}`,
} as const;

// Experience & Education proof strip in the hero (monogram + name + descriptor).
export type CredibilityOrg = {
  name: string;
  mark: string;
  descriptor: string;
  accent: string;
  logo?: string; // optional path under /public, e.g. "/logos/newton-school.png"
};

export const credibility: {
  experience: CredibilityOrg[];
  education: CredibilityOrg[];
} = {
  experience: [
    { name: "Zamplitude", mark: "Z", descriptor: "SaaS", accent: "#FFD68A" },
    { name: "Newton School", mark: "NS", descriptor: "EdTech", accent: "#4F7CFF", logo: "/logos/newton-school.png" },
    { name: "HealthKart", mark: "HK", descriptor: "E-commerce", accent: "#18C6B4", logo: "/logos/healthkart.png" },
    { name: "Healthmug", mark: "hm", descriptor: "E-commerce", accent: "#9DB8FF", logo: "/logos/healthmug.png" },
  ],
  education: [
    { name: "KIIT University", mark: "KIIT", descriptor: "B.Tech", accent: "#FFB454", logo: "/logos/kiit.png" },
    { name: "MDI Murshidabad", mark: "MDI", descriptor: "PGDM", accent: "#C77BD8", logo: "/logos/mdi.png" },
  ],
};

export const navLinks = [
  { label: "Impact", href: "#impact" },
  { label: "Work", href: "#work" },
  { label: "Built", href: "#built" },
  { label: "Experience", href: "#experience" },
  { label: "GitHub", href: "#github" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export type Metric = {
  /** Numeral that counts up on first view */
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
  /** Links the tile to its detail page at /impact/{slug} (Phase 7). */
  slug: string;
  /** The exact resume phrase that proves the headline figure; scripts/check-content.ts finds it in the PDF. */
  resumeEvidence: string;
};

/** Hero metrics, one group per role; each group becomes a tab. */
export type MetricGroup = { org: OrgId; label: string; metrics: Metric[] };

// Tiles follow resume bullet order. Before-and-after figures lead with the
// "after" value and put the "before" in the detail line.
export const metricGroups: MetricGroup[] = [
  {
    org: "zamplitude",
    label: "Zamplitude",
    metrics: [
      {
        value: 68,
        suffix: "%",
        label: "Applications auto-cleared",
        detail:
          "Risk-scoring bands and auto-approval thresholds over verified digital-ID data; turnaround fell from 72 hours to under 8.",
        slug: "risk-scoring",
        resumeEvidence: "68% of applications auto-cleared",
      },
      {
        // An absolute clearance rate: never prefix it with "+".
        value: 61,
        suffix: "%",
        label: "First-pass compliance clearance",
        detail:
          "Up from 23%, after redesigning the KYC review and approval workflow across 12 requirement sessions.",
        slug: "kyc-review-workflow",
        resumeEvidence: "first-pass compliance clearance from 23% to 61%",
      },
      {
        // REVIEW(Faraz): the resume's only figure for this work is the audit
        // size, so the outcome sits in the detail line.
        value: 30,
        suffix: "+",
        label: "Compliance actions audited",
        detail:
          "Exposed shared-login risk; a Roles and Permissions module replaced every shared login with individual, role-based access.",
        slug: "roles-permissions",
        resumeEvidence: "Audited 30+ compliance actions",
      },
      {
        value: 120,
        prefix: "~",
        suffix: "h",
        label: "Rework saved",
        detail:
          "Mock AML service with API contracts unblocked frontend and QA 3 weeks before sandbox access.",
        slug: "aml-mock-service",
        resumeEvidence: "~120 hours of rework saved",
      },
    ],
  },
  {
    org: "newton",
    label: "Newton School",
    metrics: [
      {
        value: 30,
        suffix: "h",
        label: "Manual proctoring per exam batch",
        detail:
          "Down from 100 hours across 15,000+ exam sessions, with an AI exam-monitoring system taken from 0 to 1.",
        slug: "ai-proctoring",
        resumeEvidence: "from 100 to 30 hours per exam batch",
      },
      {
        value: 12,
        suffix: "%",
        label: "Referral-to-signup conversion",
        detail:
          "Up from 7%. Drop-off pinpointed through funnel and cohort analysis; incentive redesign validated in A/B tests.",
        slug: "referral-growth",
        resumeEvidence: "referral-to-signup conversion from 7% to 12%",
      },
      {
        value: 19.1,
        suffix: "%",
        label: "Sign-up conversion",
        detail:
          "Nearly doubled, up from 10%, through landing-page A/B tests prioritised by impact and effort.",
        slug: "signup-conversion",
        resumeEvidence: "sign-up conversion nearly doubled, from 10% to 19.1%",
      },
      {
        value: 99,
        prefix: "−",
        suffix: "%",
        label: "Manual reconciliation effort, with no payment mismatches",
        detail:
          "Razorpay Route API split payments between two accounts, webhook-driven failure handling.",
        slug: "razorpay-route",
        resumeEvidence: "reducing manual reconciliation effort by 99%",
      },
    ],
  },
];

// Three tiles repeated in the hero's stat orbit, values and labels unchanged,
// one per lever (compliance automation, growth, payments). Each links to the
// same impact page as its tile.
const HERO_STAT_SLUGS = ["risk-scoring", "signup-conversion", "razorpay-route"];

export const heroStats: Metric[] = HERO_STAT_SLUGS.map((slug) => {
  const metric = metricGroups.flatMap((group) => group.metrics).find((m) => m.slug === slug);
  if (!metric) throw new Error(`heroStats: no metric tile for "${slug}"`);
  return metric;
});

/** The tile's full accessible name, shared by the tile and its hero copy. */
export function metricLabel(metric: Metric): string {
  return `${metric.prefix ?? ""}${metric.value}${metric.suffix ?? ""} — ${metric.label}. Read the full story.`;
}

export type CaseStudy = {
  title: string;
  subtitle?: string;
  summary?: string;
  href?: string;
  /** Preview image lives at public/previews/{slug}.webp (Phase 5 script). */
  slug: string;
  docs?: { title: string; href: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    title: "Bumble — “Date Vibe”",
    subtitle: "Growth strategy",
    slug: "bumble",
    summary:
      "Simplified pre-date planning from user research; gamified solution projected ₹10 Cr annual revenue and +20% profile interactions.",
    href: "https://assets.nextleap.app/submissions/NLBumble-da078847-c1b6-4b73-b9c3-760f63b97b4c.pdf",
  },
  {
    title: "MakeMyTrip",
    subtitle: "Product teardown",
    slug: "makemytrip",
    // REVIEW(Faraz): summary written from the deck — adjust wording as you like.
    summary:
      "A Growth-team teardown answering MakeMyTrip's mandate to crack trip planning — an unsolved gap in travel — with a GenAI-powered planner. Works through the business model, competitor and actor mapping, and a structured problem breakdown.",
    href: "https://assets.nextleap.app/submissions/Makemytrip-9eb8bfaa-0280-463f-a9df-6ca31ed1887f.pdf",
  },
  {
    title: "Zepto",
    subtitle: "Product teardown",
    slug: "zepto",
    // REVIEW(Faraz): summary written from the deck — adjust wording as you like.
    summary:
      "A Growth teardown targeting Zepto's low average order value — the lever for quick-commerce unit economics. Maps the business outcome (profitability) to product outcomes (higher basket quantity and unit price), with problem validation and framing.",
    href: "https://assets.nextleap.app/submissions/Zepto-da51ae3f-a48d-40c6-9f3a-7615f18849e7.pdf",
  },
  {
    title: "Zomato — Increasing Reviews",
    subtitle: "Outcomes → insights → product note → PRD",
    slug: "zomato",
    // REVIEW(Faraz): one-line description of the four-document arc.
    summary:
      "A four-part arc on growing review volume on Zomato — from defining the product outcome, through user-insight discovery, to a product note and a full PRD.",
    docs: [
      {
        title: "Defining Product Outcomes",
        href: "https://assets.nextleap.app/submissions/Zomato_milestone_1-649634e2-0d24-4ac4-8f94-c6501973d4da.pdf",
      },
      {
        title: "Deriving Insights from Users",
        href: "https://assets.nextleap.app/submissions/Zomato_milestone_2-c5178530-7bea-4788-891f-3d1048b81820.pdf",
      },
      {
        title: "Product Note",
        href: "https://assets.nextleap.app/submissions/PRD_1-38d725a5-c2e1-4d2a-8cd9-ff2e1bb0d11c.pdf",
      },
      {
        title: "PRD",
        href: "https://assets.nextleap.app/submissions/ZomatoPRD_2-d66f3915-fb5d-40fb-9308-8e6aeb753989.pdf",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Prototypes and side projects (the "Built" section). Signal is the flagship;
// the rest are secondary cards. Signal's subtitle and highlights and Cairn's
// description follow the resume; the other descriptions are the owner's,
// verbatim — no usage/adoption numbers (these are side projects).
// ---------------------------------------------------------------------------
export type Project = {
  name: string;
  /** Short mono kicker line above the name. */
  tagline: string;
  description: string;
  repo: string;
  /** Live demo, when one exists. */
  demo?: string;
  flagship?: boolean;
  /** Resume-style descriptor under the name (flagship card). */
  subtitle?: string;
  year?: string;
  /** Resume bullets, rendered on the flagship card only. */
  highlights?: string[];
  /** A real screenshot of the live demo, under /public. */
  screenshot?: { src: string; alt: string };
};

export const projects: Project[] = [
  {
    name: "Signal",
    tagline: "Flagship · Agentic feedback-to-roadmap",
    description:
      "AI feedback-triage agent: clusters user feedback into themes, grounds every recommendation in real source quotes, routes low-confidence calls to a human, and evaluates its own output.",
    repo: "https://github.com/FarazO7/Signal",
    demo: "https://signal-theta-ten.vercel.app",
    flagship: true,
    // REVIEW(Faraz): alt text for the live-demo screenshot (captured October 2026).
    screenshot: {
      src: "/previews/signal.webp",
      alt: "The Signal live demo: a sample-data run and a CSV upload for turning feedback into a prioritised roadmap brief",
    },
    subtitle: "Agentic LLM feedback-triage prototype",
    year: "2026",
    highlights: [
      "Built an agentic LLM pipeline that classifies, clusters and scores scattered user feedback into ranked, evidence-linked recommendations on what to build next.",
      "Added explainable scoring, a human-in-the-loop review step and an evaluation harness that measures theme recall, precision and hallucination rate against a labelled set.",
    ],
  },
  {
    name: "engagR",
    tagline: "Growth CRM · D2C",
    description:
      "Event-driven growth CRM for D2C — captures user events, flags where people drop off, and auto-generates personalised re-engagement across email, WhatsApp, and SMS, with A/B testing built in.",
    repo: "https://github.com/FarazO7/journey-mapper",
  },
  {
    name: "Cairn",
    tagline: "RAG · Coaching assistant",
    description:
      "A RAG coaching assistant prototype that grounds its answers in a custom corpus using cosine-similarity embedding search.",
    repo: "https://github.com/FarazO7/cairn",
  },
  {
    name: "Application Desk",
    tagline: "Agentic · Job search",
    description:
      "An agentic job-search assistant — finds relevant roles, drafts tailored applications, and schedules sends, on FastAPI, MongoDB, OpenAI, and Gmail.",
    repo: "https://github.com/FarazO7/job-apply-assistant-1",
  },
];

// `slug` maps to a verified simple-icons brand mark (see lib/skillIcons.ts).
// Skills without a slug render as a JetBrains-Mono text node — no skill is
// dropped for lacking a logo. `accent` colors each hub's connector junctions.
// Static "how I work" strip under the hero (icons via lucide-react).
export type Capability = {
  label: string;
  icon: "bulb" | "chart" | "users" | "bot" | "rocket";
  accent: string;
};

export const capabilities: Capability[] = [
  { label: "Product Thinking", icon: "bulb", accent: "#FFB454" },
  { label: "Strategy & Roadmaps", icon: "chart", accent: "#9DB8FF" },
  { label: "User Empathy", icon: "users", accent: "#18C6B4" },
  { label: "AI & Automation", icon: "bot", accent: "#C77BD8" },
  { label: "Execution & Impact", icon: "rocket", accent: "#FFB454" },
];

export type SkillNode = { label: string; slug?: string };
export type SkillHub = { name: string; accent: string; nodes: SkillNode[] };

// The resume's four skill groups, items verbatim and in resume order, as a
// 2×2 grid of hub cards.
export const skills: SkillHub[] = [
  {
    name: "Product",
    accent: "#4F7CFF", // indigo
    nodes: [
      { label: "Discovery" },
      { label: "User research and interviews" },
      { label: "JTBD" },
      { label: "PRDs and user stories" },
      { label: "Acceptance criteria" },
      { label: "UAT" },
      { label: "Roadmapping" },
      { label: "Prioritisation (RICE, MoSCoW)" },
      { label: "OKRs" },
      { label: "Go-to-market" },
      { label: "Agile/Scrum" },
      { label: "Stakeholder management" },
    ],
  },
  {
    name: "Growth and data",
    accent: "#18C6B4", // teal
    nodes: [
      { label: "A/B tests" },
      { label: "Experimentation" },
      { label: "Funnel/cohort analysis" },
      { label: "SQL" },
      { label: "Mixpanel", slug: "mixpanel" },
      { label: "GA4", slug: "googleanalytics" },
      { label: "CleverTap" }, // no simple-icons mark → text node
      { label: "Metabase", slug: "metabase" },
      { label: "Excel" }, // no simple-icons mark → text node
    ],
  },
  {
    name: "AI",
    accent: "#FFB454", // amber
    nodes: [
      { label: "GenAI and LLM applications" },
      { label: "Agentic workflows" },
      { label: "RAG" },
      { label: "Evals" },
      { label: "Human-in-the-loop design" },
      { label: "Prompt engineering" },
    ],
  },
  {
    name: "Technical and domains",
    accent: "#8B5CF6", // violet
    nodes: [
      { label: "REST APIs" },
      { label: "API specs" },
      { label: "Python", slug: "python" },
      { label: "Jira", slug: "jira" },
      { label: "Confluence", slug: "confluence" },
      { label: "Notion", slug: "notion" },
      { label: "KYC/AML" },
      { label: "Payments" },
      { label: "WMS" },
      { label: "OMS" },
    ],
  },
];

// The line under the Skills heading, limited to skills the resume lists.
export const skillsIntro =
  "Fluent in product discovery, user research, JTBD, prioritisation, experimentation, A/B testing, APIs, and SQL-driven decisions.";

export type Credential = { text: string; href?: string };

// Promoted into its own dramatic scroll section (Phase 6). `icon` selects a
// lucide mark; `href` (when supplied) turns the line into a link.
export type Achievement = {
  title: string;
  year?: string;
  icon: "trophy" | "award" | "fileBadge";
  href?: string;
};

export const achievements: Achievement[] = [
  {
    title: "NextLeap Product Manager Top Fellow",
    year: "2024",
    icon: "trophy",
  },
  {
    title: "Runner-Up, “Call for Article” — Analytics Club, IIM Rohtak",
    year: "2023",
    icon: "award",
  },
];

// The resume's certifications; NextLeap Top Fellow sits in `achievements`.
export const certifications: Credential[] = [
  { text: "Lean Six Sigma (KPMG)" },
  { text: "Google Analytics 4 (Google)" },
];

// Rendered with the same vertical timeline as Experience (Phase 3). Empty
// `dates`/`bullets` render gracefully — no orphan separators.
export const educationTimeline: Role[] = [
  {
    id: "mdi",
    title: "PGDM — Marketing & Supply Chain Management",
    company: "Management Development Institute (MDI)",
    location: "Murshidabad",
    dates: "2022 – 2024",
    bullets: [],
  },
  {
    id: "kiit",
    title: "B.Tech, Electronics & Telecommunication Engineering",
    company: "KIIT University",
    location: "Bhubaneswar",
    dates: "2014 – 2018",
    bullets: [],
  },
];

// ---------------------------------------------------------------------------
// Impact detail pages (Phase 7). Each hero metric tile links to /impact/{slug}.
// The Zamplitude and sign-up pages are restructured from the resume; the other
// Newton narratives are the owner's, transcribed verbatim — no invented numbers.
// ---------------------------------------------------------------------------

export type ImpactMeta = { label: string; value: string };
export type ImpactSection = { heading: string; body: string };
/** Organisations with impact pages; each page's Tenure row comes from its role's dates. */
export type ImpactOrg = Extract<OrgId, "zamplitude" | "newton">;
export type ImpactDetail = {
  slug: string;
  org: ImpactOrg;
  metric: string;
  outcome: string;
  meta: ImpactMeta[];
  sections: ImpactSection[];
};

/** Footer note on each impact page, by organisation. */
export const confidentiality: Record<ImpactOrg, string> = {
  zamplitude:
    "Client work. Details are limited to what can be shared publicly, and the client is not named. Happy to walk through the approach in conversation.",
  newton:
    "Specific internal data is summarised at the level Newton School permits publicly; happy to discuss details in conversation.",
};

// Shared by every Zamplitude page. The client stays anonymous everywhere.
const ZAMPLITUDE_META: ImpactMeta[] = [
  {
    label: "Company",
    value: "Zamplitude (client: regulated investment firm)",
  },
  { label: "Industry", value: "Regulated Fintech (KYC/AML)" },
  { label: "Role", value: "Product Manager, first PM hire" },
];

export const impactDetails: ImpactDetail[] = [
  {
    slug: "kyc-review-workflow",
    org: "zamplitude",
    metric: "61% First-Pass Compliance Clearance",
    outcome:
      "Up from 23%, after the KYC review and approval workflow was redesigned.",
    meta: [
      { label: "Project type", value: "Compliance workflow redesign" },
      ...ZAMPLITUDE_META,
      { label: "Collaboration", value: "4 client compliance stakeholders" },
      { label: "Discovery", value: "12 requirement sessions" },
    ],
    sections: [
      {
        heading: "Problem",
        // REVIEW(Faraz): restructured from the resume bullet.
        body: "KYC reviews were stalling, and first-pass compliance clearance stood at 23%.",
      },
      {
        heading: "Approach & key decisions",
        body: "Traced where KYC reviews stalled through 12 requirement sessions with 4 client compliance stakeholders, then redesigned the review and approval workflow.",
      },
      {
        heading: "Results",
        body: "First-pass compliance clearance rose from 23% to 61%.",
      },
    ],
  },
  {
    slug: "compliance-dashboard",
    org: "zamplitude",
    metric: "5 Days → Same-Day Question Changes",
    outcome: "A compliance dashboard replaced an email approval trail.",
    meta: [
      { label: "Project type", value: "Compliance dashboard" },
      ...ZAMPLITUDE_META,
      { label: "Scope", value: "KYC and Enhanced Due Diligence (EDD) questions" },
    ],
    sections: [
      {
        heading: "Problem",
        // REVIEW(Faraz): restructured from the resume bullet.
        body: "KYC and EDD question changes ran through an email approval trail, with a turnaround of 5 days.",
      },
      {
        heading: "Approach & key decisions",
        body: "Replaced the email approval trail with a compliance dashboard: two-level sign-off for KYC and Enhanced Due Diligence (EDD) questions, plus EDD assignment to flagged users.",
      },
      {
        heading: "Results",
        body: "Question-change turnaround cut from 5 days to same day.",
      },
    ],
  },
  {
    slug: "risk-scoring",
    org: "zamplitude",
    metric: "68% Auto-Cleared",
    outcome: "Turnaround fell from 72 hours to under 8.",
    meta: [
      { label: "Project type", value: "Risk-scoring automation" },
      ...ZAMPLITUDE_META,
      { label: "Collaboration", value: "Client Compliance Officer" },
      { label: "Identity basis", value: "Verified digital-ID data" },
    ],
    sections: [
      {
        heading: "Problem",
        // REVIEW(Faraz): restructured from the resume bullet.
        body: "Applications were approved manually, case by case, and review turnaround stood at 72 hours.",
      },
      {
        heading: "Approach & key decisions",
        body: "Partnered with the client's Compliance Officer on risk-scoring bands and auto-approval thresholds over verified digital-ID data, replacing case-by-case review.",
      },
      {
        heading: "Results",
        body: "68% of applications auto-cleared; turnaround fell from 72 hours to under 8.",
      },
    ],
  },
  {
    slug: "roles-permissions",
    org: "zamplitude",
    metric: "Every Shared Login Replaced",
    outcome:
      "Individual, role-based access, prioritised from an audit of 30+ compliance actions.",
    meta: [
      { label: "Project type", value: "Access control" },
      ...ZAMPLITUDE_META,
      { label: "Audit scope", value: "30+ compliance actions" },
    ],
    sections: [
      {
        heading: "Problem",
        // REVIEW(Faraz): restructured from the resume bullet.
        body: "Shared logins posed a risk against the platform's regulatory obligations.",
      },
      {
        heading: "Approach & key decisions",
        body: "Audited 30+ compliance actions against regulatory obligations, exposing shared-login risk, and prioritised a Roles and Permissions module over competing scope.",
      },
      {
        heading: "Results",
        body: "Every shared login replaced with individual, role-based access, following an audit of 30+ compliance actions.",
      },
    ],
  },
  {
    slug: "aml-mock-service",
    org: "zamplitude",
    metric: "~120 Hours of Rework Saved",
    outcome: "Frontend and QA unblocked 3 weeks before sandbox access.",
    meta: [
      { label: "Project type", value: "Vendor integration, API contracts" },
      ...ZAMPLITUDE_META,
      { label: "Deliverable", value: "Mock service with API contracts" },
    ],
    sections: [
      {
        heading: "Problem",
        // REVIEW(Faraz): restructured from the resume bullet.
        body: "Frontend and QA were waiting on sandbox access from the AML screening vendor.",
      },
      {
        heading: "Approach & key decisions",
        body: "Parsed the AML vendor's specification programmatically, flagged 2 contradictions before build and published a mock service with API contracts.",
      },
      {
        heading: "Results",
        body: "Frontend and QA unblocked 3 weeks before sandbox access; ~120 hours of rework saved.",
      },
    ],
  },
  {
    slug: "signup-conversion",
    org: "newton",
    metric: "19.1% Sign-Up Conversion",
    outcome: "Nearly doubled, from 10%.",
    meta: [
      { label: "Project type", value: "Acquisition-funnel experimentation" },
      { label: "Company", value: "Newton School" },
      { label: "Industry", value: "Edtech" },
      { label: "Role", value: "Associate Product Manager" },
    ],
    sections: [
      {
        heading: "Problem",
        // REVIEW(Faraz): restructured from the resume bullet.
        body: "Acquisition-funnel sign-up conversion stood at 10%.",
      },
      {
        heading: "Approach & key decisions",
        body: "Owned acquisition-funnel experimentation: landing-page A/B tests prioritised by impact and effort and tracked on self-serve dashboards (DAU/MAU, activation).",
      },
      {
        heading: "Results",
        body: "Sign-up conversion nearly doubled, from 10% to 19.1%.",
      },
    ],
  },
  {
    slug: "referral-growth",
    org: "newton",
    metric: "12% Referral-to-Signup Conversion",
    outcome:
      "Up from 7%; referrals became a core growth lever for the platform.",
    meta: [
      { label: "Project type", value: "Growth module, end-to-end ownership" },
      { label: "Company", value: "Newton School" },
      { label: "Industry", value: "Edtech" },
      { label: "Role", value: "Associate Product Manager" },
      { label: "Collaboration", value: "PM + engineering + programme team" },
    ],
    sections: [
      {
        heading: "Problem",
        body: "Referral signups were declining; analysis of user behaviour showed monetary rewards alone weren't motivating students to share.",
      },
      {
        heading: "Approach & key decisions",
        body: "Proposed collaborative prep materials as an incentive and ran a three-arm A/B test: monetary vs prep-material vs combined. The trade-off was explicit: removing money risked immediate referrals (the monetary-only cohort dropped ~10%), but the combined arm lifted overall referral signups 15% while holding acquisition cost within target, balancing short-term incentive seekers against long-term engagement.",
      },
      {
        heading: "Iterations",
        body: "Mixpanel funnel analysis exposed a drop-off at the copy-link step; highlighting the link and decluttering the dashboard lifted copy interactions 18% and referral conversions 10%. Survey feedback showed milestone gadgets felt irrelevant; pivoting the sixth-referral reward to a ChatGPT Plus voucher lifted power-user referrals 20%. CleverTap re-engagement journeys (WhatsApp, email, SMS) reactivated dormant users for +12% signups and ~5% referral-driven revenue lift that quarter.",
      },
      {
        heading: "Learnings",
        body: "Declined a post-exam prep-material proposal after quantifying that the referral pipeline's revenue impact was larger — protected the highest-impact initiative.",
      },
      {
        heading: "Results",
        body: "Referral-to-signup conversion rose from 7% to 12%; referrals became a core growth lever.",
      },
    ],
  },
  {
    slug: "ai-proctoring",
    org: "newton",
    metric: "100 → 30 Proctoring Hours per Exam Batch",
    outcome: "AI monitoring scaled exam integrity across 15,000+ sessions.",
    meta: [
      { label: "Project type", value: "AI feature, discovery → release" },
      { label: "Company", value: "Newton School" },
      { label: "Industry", value: "Edtech" },
      { label: "Role", value: "APM (PRD, edge cases, success metrics)" },
      { label: "Collaboration", value: "PM + ML/engineering + ops reviewers" },
      { label: "Scale", value: "15,000+ sessions" },
    ],
    sections: [
      {
        heading: "Problem",
        body: "Manual proctoring couldn't scale, and recording full sessions for thousands of simultaneous test-takers was infeasible on storage and memory.",
      },
      {
        heading: "Approach & key decisions",
        body: "Defined a lightweight monitoring design with engineering — screenshots every 10 seconds, flagged against predefined malpractice patterns (multiple faces, phones in frame), feeding a human-review pipeline. Led definition of edge cases and success metrics so AI accuracy and reviewer load stayed in balance; tight AI constraints plus human oversight was the deliberate architecture.",
      },
      {
        heading: "Results",
        body: "Manual proctoring cut from 100 to 30 hours per exam batch across 15,000+ exam sessions, scaled with no memory overload.",
      },
    ],
  },
  {
    slug: "razorpay-route",
    org: "newton",
    metric: "−99% Reconciliation Effort",
    outcome: "Split payments reconciled in real time, refund delays eliminated.",
    meta: [
      { label: "Project type", value: "Payments integration" },
      { label: "Company", value: "Newton School + partner institute" },
      { label: "Industry", value: "Edtech / Fintech" },
      {
        label: "Role",
        value: "APM (scoping, API documentation, testing, automation)",
      },
      { label: "Integration", value: "Razorpay Route API" },
    ],
    sections: [
      {
        heading: "Problem",
        body: "Fees split across two accounts; wrong-account payments meant multi-day refunds, and reconciliation took 5 people two weeks per cycle.",
      },
      {
        heading: "Approach & key decisions",
        body: "Implemented Route's predefined split rules so one student payment auto-distributed across both accounts. Webhooks reported success/failure in real time for immediate action; user-ID, payment-ID, and account-ID were mapped in a database for full traceability. Edge cases designed in: partial payments trigger a webhook prompt to the student; network failures surface instantly instead of silently desyncing books.",
      },
      {
        heading: "Results",
        body: "−99% manual reconciliation effort, payments reconciled in real time with no mismatches, refund delays eliminated.",
      },
    ],
  },
  {
    slug: "waitlist-automation",
    org: "newton",
    metric: "30% Waitlist Conversion, Zero Vacant Seats",
    outcome: "An automated waitlist filled seats directly — no CRM needed.",
    meta: [
      { label: "Project type", value: "Workflow automation" },
      { label: "Company", value: "Newton School" },
      { label: "Industry", value: "Edtech" },
      {
        label: "Role",
        value: "APM (user stories, acceptance criteria, UAT, release coordination)",
      },
    ],
    sections: [
      {
        heading: "Problem",
        body: "Refund-driven seat loss; operations proposed a full CRM to manage it.",
      },
      {
        heading: "Approach & key decisions",
        body: "Ran a cost-effort analysis showing a CRM added complexity while an automated waitlist could fulfil seats directly. Aligned stakeholders on the data (fewer manual calls, ~90% faster turnaround), then wrote the stories and acceptance criteria, facilitated UAT, and coordinated release.",
      },
      {
        heading: "Results",
        body: "60 of 200 waitlisted learners (30%) converted to enrolments and no seats went unfilled; CRM complexity avoided. Everyone aligned once the results landed.",
      },
    ],
  },
];

export function getImpactDetail(slug: string): ImpactDetail | undefined {
  return impactDetails.find((d) => d.slug === slug);
}

// ---------------------------------------------------------------------------
// Curated GitHub grid (the "Building in public" section). A hand-ordered list
// with hand-written descriptions, so the flagships always show regardless of
// API recency — no live "most-recent-N" fetch.
// ---------------------------------------------------------------------------
export type CuratedRepo = { name: string; description: string; url: string };

export const curatedRepos: CuratedRepo[] = [
  {
    name: "Signal",
    description:
      "Agentic LLM feedback-triage prototype: classifies, clusters and scores user feedback into ranked, evidence-linked recommendations, with an evaluation harness.",
    url: "https://github.com/FarazO7/Signal",
  },
  {
    name: "journey-mapper",
    description:
      "Event-driven growth CRM with drop-off detection and multi-channel re-engagement.",
    url: "https://github.com/FarazO7/journey-mapper",
  },
  {
    name: "cairn",
    description:
      "RAG coaching assistant prototype (cosine-similarity embedding search).",
    url: "https://github.com/FarazO7/cairn",
  },
  {
    name: "job-apply-assistant-1",
    description:
      "Agentic job-search assistant (FastAPI, MongoDB, OpenAI, Gmail).",
    url: "https://github.com/FarazO7/job-apply-assistant-1",
  },
  {
    name: "lighthouse-qa-monitor",
    description:
      "AI QA-monitoring agent for marketplaces: detects workflow failures, deduplicates issues, translates errors into seller-friendly insights.",
    url: "https://github.com/FarazO7/lighthouse-qa-monitor",
  },
];