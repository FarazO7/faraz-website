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
  location: string;
  dates: string;
  current?: boolean;
  bullets: Bullet[];
};

// The single `current: true` role comes first. The hero title, metadata and
// JSON-LD derive from it (see `currentRole`), so a job change is one edit here.
export const experience: Role[] = [
  {
    id: "zamplitude",
    title: "Product Manager",
    company: "Zamplitude",
    location: "Remote, Dubai",
    dates: "Mar 2026 – Present",
    current: true,
    bullets: [
      {
        text: "Ran discovery with four client-side compliance stakeholders across twelve requirement sessions to trace where KYC review stalled, defined the end-to-end review and approval workflow for a regulated GCC investment platform, and shipped it via PRDs, user stories, and UAT, lifting first-pass approval to 91%.",
        impact: "kyc-review-workflow",
      },
      {
        text: "Designed and shipped a compliance dashboard with a two-level approval flow spanning KYC and EDD question creation, review, and sign-off, plus EDD assignment to flagged users with integrated notifications, replacing an email-based approval trail and cutting question change cycle time from 5 days to same-day.",
        impact: "compliance-dashboard",
      },
      {
        text: "Replaced manual case-by-case approval with automated risk scoring built on Nafath-verified identity attributes, defining scoring bands and auto-approval thresholds with the client Compliance Officer, auto-clearing 68% of applications and cutting review turnaround from 72 hours to under 8.",
        impact: "risk-scoring",
      },
      {
        text: "Audited 30+ compliance actions against regulatory obligations to expose shared-login risk, prioritised a Roles and Permissions module over competing scope, and shipped it with acceptance criteria and QA sign-off, eliminating shared-access accounts entirely and reducing audit-preparation effort 60%.",
        impact: "roles-permissions",
      },
      {
        text: "Parsed a full AML screening vendor specification programmatically to derive field mappings and status enumerations, flagged two vendor contradictions before build, and shipped a mock service specification with API contracts, unblocking frontend and QA three weeks ahead of vendor sandbox access and averting an estimated 120 hours of rework.",
        impact: "aml-mock-service",
      },
    ],
  },
  {
    id: "newton",
    title: "Associate Product Manager",
    company: "Newton School",
    location: "Bengaluru",
    dates: "Mar 2025 – Mar 2026",
    bullets: [
      {
        text: "Owned acquisition-funnel optimisation, prioritising landing-page experiments by impact/effort and shipping iterative variants backed by self-serve dashboards (DAU/MAU, activation), raising sign-up conversion 10% → 19.1% (+91%).",
        impact: "signup-conversion",
      },
      {
        text: "Referral growth module end-to-end: +32% conversion; A/B tested monetary vs prep-material vs combined incentives (+15% signups at target CAC); reward pivot to ChatGPT Plus voucher lifted power-user referrals +20%",
        impact: "referral-growth",
      },
      {
        text: "AI exam monitoring: PRD through release; −70% manual effort over 15K+ sessions",
        impact: "ai-proctoring",
      },
      "Funnel instrumentation in Mixpanel: fixed copy-link drop-off (+18% interactions, +10% referral conversions); CleverTap re-engagement journeys (WhatsApp/email/SMS) re-activated dormant users (+12% signups)",
      {
        text: "Razorpay Route integration: split-payment rules, webhook error handling, payment-ID mapping; −99% manual reconciliation",
        impact: "razorpay-route",
      },
      {
        text: "Identified enrollment bottlenecks behind stalled waitlists, designed an automated seat-allocation workflow, and shipped it via user stories, UAT, and release, converting 30% of waitlisted users with zero vacant seats.",
        impact: "waitlist-automation",
      },
      "RICE-prioritized self-serve interview rescheduling: +8% completion, +2% downstream admissions",
      "Agile/Scrum in JIRA, ClickUp documentation, DAU/MAU growth dashboards",
    ],
  },
  {
    id: "healthkart",
    title: "Product Management Trainee",
    company: "HealthKart",
    location: "Gurugram",
    dates: "Aug 2024 – Mar 2025",
    bullets: [
      "ERP roadmap (SAP B1, Pharmacloud) unlocking a category worth 5% of total revenue; ERPNext migration requirements that unlocked SOC-2 compliance; PRDs, user stories, journey optimization",
    ],
  },
  {
    id: "healthmug",
    title: "Category Management Intern",
    company: "Healthmug",
    location: "New Delhi",
    dates: "Apr 2023 – Jul 2023",
    bullets: [
      "Purchase-data analytics: +25% repeat purchases; catalog expansion +18%, contributing to 35% MoM growth",
    ],
  },
];

/** Sectors worked in, shown as chips atop Experience and reused in the skills index. */
export const domains = [
  "Regulated Fintech",
  "KYC/AML",
  "Compliance Workflows",
  "Roles & Permissions",
  "Payments",
  "Proptech",
  "Edtech",
  "E-commerce",
  "D2C",
  "B2B SaaS",
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
  // Resume summary, sentence one.
  positioning:
    "Product Manager who builds AI, fintech, and growth products end-to-end, from discovery to launch, across regulated financial services, edtech, e-commerce, and direct-to-consumer platforms, driving conversion, compliance, and delivery predictability.",
  companyShort: currentRole.companyShort ?? currentRole.company,
  greeting: "Hello there!",
  // REVIEW(Faraz): drafted for the September 2026 resume sync (sign-off S1).
  bio:
    "I'm a product manager who builds AI, fintech, and growth products end-to-end, from discovery to launch. At Zamplitude I design and ship KYC and compliance workflows for a regulated GCC investment platform; before that I owned growth, AI, and payments work at Newton School, from referral funnels and Razorpay split-payments to AI exam-proctoring, turning fuzzy problems into measurable outcomes. Lately I build AI products myself: agentic systems with their own evaluation harnesses, explainable scoring, and human-in-the-loop review.",
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
    { name: "Zamplitude", mark: "Z", descriptor: "Fintech", accent: "#FFD68A" },
    { name: "Newton School", mark: "NS", descriptor: "EdTech", accent: "#4F7CFF", logo: "/logos/newton-school.png" },
    { name: "HealthKart", mark: "HK", descriptor: "E-commerce", accent: "#18C6B4", logo: "/logos/healthkart.png" },
    { name: "Healthmug", mark: "hm", descriptor: "D2C", accent: "#9DB8FF", logo: "/logos/healthmug.png" },
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

export const metricGroups: MetricGroup[] = [
  {
    org: "zamplitude",
    label: "Zamplitude",
    metrics: [
      {
        // An absolute approval rate: never prefix it with "+".
        value: 91,
        suffix: "%",
        label: "First-pass KYC approval rate",
        detail:
          "End-to-end review and approval workflow, defined across twelve requirement sessions with four compliance stakeholders.",
        slug: "kyc-review-workflow",
        resumeEvidence: "first-pass approval to 91%",
      },
      {
        value: 68,
        suffix: "%",
        label: "Applications auto-cleared",
        detail:
          "Automated risk scoring on Nafath-verified identity attributes; review turnaround cut from 72 hours to under 8.",
        slug: "risk-scoring",
        resumeEvidence: "auto-clearing 68% of applications",
      },
      {
        value: 60,
        prefix: "−",
        suffix: "%",
        label: "Audit-preparation effort",
        detail:
          "Roles and Permissions module, prioritised from an audit of 30+ compliance actions; shared-access accounts eliminated.",
        slug: "roles-permissions",
        resumeEvidence: "audit-preparation effort 60%",
      },
      {
        value: 120,
        suffix: "h",
        label: "Rework averted, estimated",
        detail:
          "Mock AML service with API contracts unblocked frontend and QA three weeks ahead of vendor sandbox access.",
        slug: "aml-mock-service",
        resumeEvidence: "estimated 120 hours of rework",
      },
    ],
  },
  {
    org: "newton",
    label: "Newton School",
    metrics: [
      {
        value: 32,
        prefix: "+",
        suffix: "%",
        label: "Referral conversion lift",
        detail:
          "Owned roadmap and lifecycle of the referral growth module; OKRs, cohort and funnel analysis, incentive experiments.",
        slug: "referral-growth",
        resumeEvidence: "lifting conversion 32%",
      },
      {
        value: 70,
        prefix: "−",
        suffix: "%",
        label: "Manual proctoring effort, across 15,000+ sessions",
        detail:
          "AI-powered exam monitoring: lightweight screenshot cadence, predefined malpractice flags, human-review pipeline.",
        slug: "ai-proctoring",
        resumeEvidence: "cutting proctoring effort 70%",
      },
      {
        value: 99,
        prefix: "−",
        suffix: "%",
        label: "Payment reconciliation effort, with 100% real-time transaction accuracy",
        detail:
          "Razorpay Route API split payments between two accounts, webhook-driven failure handling.",
        slug: "razorpay-route",
        resumeEvidence: "cutting manual effort 99%",
      },
      {
        value: 30,
        suffix: "%",
        label: "Waitlist-to-seat conversion, zero vacant seats",
        detail:
          "Automated waitlisting workflows replacing a proposed CRM; cut turnaround ~90%.",
        slug: "waitlist-automation",
        resumeEvidence: "converting 30% of waitlisted users",
      },
    ],
  },
];

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
// Shipped products / build-in-public projects (the "Built" section). Signal is
// the flagship; the rest are secondary cards. Descriptions are the owner's,
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
    subtitle: "AI Product Feedback Intelligence Platform",
    year: "2026",
    highlights: [
      "Built Signal to turn hundreds of scattered user-feedback items into a trustworthy roadmap: an AI platform that classifies, clusters, and scores feedback into prioritised, evidence-backed recommendations on what to build next.",
      "Engineered for trust and adoption: explainable scoring, a human-in-the-loop review step, and an evaluation framework measuring theme recall, precision, and hallucination rate, so PMs can act on recommendations with confidence.",
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
    tagline: "RAG · Life-coaching",
    description:
      "A retrieval-augmented life-coaching app — retrieves the most relevant material from a coaching knowledge base (OpenAI embeddings + cosine retrieval) to ground each reply, behind a glassmorphism UI.",
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

export const skills: SkillHub[] = [
  {
    name: "Core PM",
    accent: "#4F7CFF", // indigo
    nodes: [
      { label: "Product Strategy" },
      { label: "Roadmapping" },
      { label: "Discovery" },
      { label: "PRDs & User Stories" },
      { label: "GTM" },
      { label: "Agile/Scrum" },
      { label: "Release Management" },
      { label: "UAT" },
      { label: "Stakeholder Management" },
      { label: "OKRs/KPIs" },
    ],
  },
  {
    name: "Data & Analytics",
    accent: "#18C6B4", // teal
    nodes: [
      { label: "SQL" },
      { label: "Python", slug: "python" },
      { label: "Funnel & Cohort Analysis" },
      { label: "A/B Testing" },
      { label: "Mixpanel", slug: "mixpanel" },
      { label: "Product Analytics" },
      { label: "DAU/MAU" },
      { label: "Dashboarding" },
    ],
  },
  {
    name: "AI & Automation",
    accent: "#FFB454", // amber
    nodes: [
      { label: "AI-Powered Products" },
      { label: "LLMs" },
      { label: "Prompt Engineering" },
      { label: "AI Agents" },
      { label: "Workflow Automation" },
    ],
  },
  {
    name: "Tools",
    accent: "#8B5CF6", // violet
    nodes: [
      { label: "JIRA", slug: "jira" },
      { label: "Confluence", slug: "confluence" },
      { label: "GA", slug: "googleanalytics" },
      { label: "Firebase", slug: "firebase" },
      { label: "CleverTap" }, // no simple-icons mark → text node
      { label: "Tableau" }, // removed from simple-icons → text node
      { label: "Metabase", slug: "metabase" },
    ],
  },
];

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
  // Wire an href here if/when the PDF is supplied; it becomes a link.
  { title: "Founder’s Recommendation Letter", icon: "fileBadge" },
];

export const certifications: Credential[] = [
  { text: "Lean Six Sigma — KPMG" },
  { text: "Business Analytics with Excel — Coursera" },
  { text: "Google Analytics Certification" },
  { text: "SQL for Data Science — Coursera" },
  { text: "Business Analysis & Process Management — Coursera" },
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
// Narratives are the owner's, transcribed verbatim — no invented numbers.
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
    "Specific internal data is summarized at the level Newton School permits publicly — happy to discuss details in conversation.",
};

// Shared by every Zamplitude page. The client stays anonymous everywhere.
const ZAMPLITUDE_META: ImpactMeta[] = [
  {
    label: "Company",
    value: "Zamplitude (client: regulated GCC investment platform)",
  },
  { label: "Industry", value: "Regulated Fintech (KYC/AML)" },
  { label: "Role", value: "Product Manager" },
];

export const impactDetails: ImpactDetail[] = [
  {
    slug: "kyc-review-workflow",
    org: "zamplitude",
    metric: "91% First-Pass Approval",
    outcome:
      "KYC review moved from stalling to a defined end-to-end approval workflow.",
    meta: [
      { label: "Project type", value: "Compliance workflow, discovery to UAT" },
      ...ZAMPLITUDE_META,
      { label: "Collaboration", value: "Four client-side compliance stakeholders" },
      { label: "Discovery", value: "Twelve requirement sessions" },
    ],
    sections: [
      {
        heading: "Problem",
        // REVIEW(Faraz): restructured from the resume bullet.
        body: "KYC review was stalling on a regulated GCC investment platform.",
      },
      {
        heading: "Approach & key decisions",
        body: "Ran discovery with four client-side compliance stakeholders across twelve requirement sessions to trace where review stalled. Defined the end-to-end review and approval workflow, then shipped it via PRDs, user stories, and UAT.",
      },
      { heading: "Results", body: "First-pass approval lifted to 91%." },
    ],
  },
  {
    slug: "compliance-dashboard",
    org: "zamplitude",
    metric: "5 Days → Same-Day Question Changes",
    outcome: "A two-level approval flow replaced an email-based approval trail.",
    meta: [
      { label: "Project type", value: "Compliance dashboard, design to launch" },
      ...ZAMPLITUDE_META,
      { label: "Scope", value: "KYC and EDD questions" },
    ],
    sections: [
      {
        heading: "Problem",
        // REVIEW(Faraz): restructured from the resume bullet.
        body: "KYC and EDD question changes ran through an email-based approval trail, with a change cycle of 5 days.",
      },
      {
        heading: "Approach & key decisions",
        body: "Designed and shipped a compliance dashboard with a two-level approval flow spanning question creation, review, and sign-off for KYC and EDD, plus EDD assignment to flagged users with integrated notifications.",
      },
      {
        heading: "Results",
        body: "Question change cycle time cut from 5 days to same-day.",
      },
    ],
  },
  {
    slug: "risk-scoring",
    org: "zamplitude",
    metric: "68% Auto-Cleared",
    outcome: "Review turnaround cut from 72 hours to under 8.",
    meta: [
      { label: "Project type", value: "Risk-scoring automation" },
      ...ZAMPLITUDE_META,
      { label: "Collaboration", value: "Client Compliance Officer" },
      { label: "Identity basis", value: "Nafath-verified attributes" },
    ],
    sections: [
      {
        heading: "Problem",
        // REVIEW(Faraz): restructured from the resume bullet.
        body: "Applications were approved manually, case by case, and review turnaround stood at 72 hours.",
      },
      {
        heading: "Approach & key decisions",
        body: "Replaced manual approval with automated risk scoring built on Nafath-verified identity attributes, and defined the scoring bands and auto-approval thresholds with the client Compliance Officer.",
      },
      {
        heading: "Results",
        body: "68% of applications auto-cleared; review turnaround cut from 72 hours to under 8.",
      },
    ],
  },
  {
    slug: "roles-permissions",
    org: "zamplitude",
    metric: "−60% Audit-Prep Effort",
    outcome: "Shared-access accounts eliminated entirely.",
    meta: [
      { label: "Project type", value: "Access control, audit to QA sign-off" },
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
        body: "Audited 30+ compliance actions against regulatory obligations to expose the shared-login risk, prioritised a Roles and Permissions module over competing scope, and shipped it with acceptance criteria and QA sign-off.",
      },
      {
        heading: "Results",
        body: "Shared-access accounts eliminated entirely; audit-preparation effort down 60%.",
      },
    ],
  },
  {
    slug: "aml-mock-service",
    org: "zamplitude",
    metric: "120 Hours of Rework Averted (est.)",
    outcome:
      "Frontend and QA unblocked three weeks ahead of vendor sandbox access.",
    meta: [
      { label: "Project type", value: "Vendor integration, API contracts" },
      ...ZAMPLITUDE_META,
      { label: "Deliverable", value: "Mock service specification" },
    ],
    sections: [
      {
        heading: "Problem",
        // REVIEW(Faraz): restructured from the resume bullet.
        body: "Frontend and QA were waiting on sandbox access from the AML screening vendor.",
      },
      {
        heading: "Approach & key decisions",
        body: "Parsed the full AML screening vendor specification programmatically to derive field mappings and status enumerations, flagged two vendor contradictions before build, and shipped a mock service specification with API contracts.",
      },
      {
        heading: "Results",
        body: "Frontend and QA unblocked three weeks ahead of vendor sandbox access; an estimated 120 hours of rework averted.",
      },
    ],
  },
  {
    slug: "signup-conversion",
    org: "newton",
    metric: "+91% Sign-Up Conversion",
    outcome: "Sign-up conversion raised from 10% to 19.1%.",
    meta: [
      { label: "Project type", value: "Acquisition-funnel optimisation" },
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
        body: "Owned acquisition-funnel optimisation: prioritised landing-page experiments by impact and effort, and shipped iterative variants backed by self-serve dashboards (DAU/MAU, activation).",
      },
      {
        heading: "Results",
        body: "Sign-up conversion raised from 10% to 19.1%, a 91% lift.",
      },
    ],
  },
  {
    slug: "referral-growth",
    org: "newton",
    metric: "+32% Referral Conversion",
    outcome: "Referrals became a core growth lever for the platform.",
    meta: [
      { label: "Project type", value: "Growth module, end-to-end ownership" },
      { label: "Company", value: "Newton School" },
      { label: "Industry", value: "Edtech" },
      { label: "Role", value: "Associate Product Manager" },
      { label: "Collaboration", value: "PM + engineering + program team" },
    ],
    sections: [
      {
        heading: "Problem",
        body: "Referral signups were declining; analysis of user behavior showed monetary rewards alone weren't motivating students to share.",
      },
      {
        heading: "Approach & key decisions",
        body: "Proposed collaborative prep materials as an incentive and ran a three-arm A/B test — monetary vs prep-material vs combined. The tradeoff was explicit: removing money risked immediate referrals (the monetary-only cohort dropped ~10%), but the combined arm lifted overall referral signups 15% while holding acquisition cost within target — balancing short-term incentive seekers against long-term engagement.",
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
        body: "+32% referral conversion; referrals became a core growth lever.",
      },
    ],
  },
  {
    slug: "ai-proctoring",
    org: "newton",
    metric: "−70% Manual Proctoring Effort",
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
        body: "Manual effort down 70% across 15,000+ sessions, scaled with no memory overload.",
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
        body: "−99% manual reconciliation effort, 100% real-time transaction accuracy, refund delays eliminated.",
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
        body: "Ran a cost-effort analysis showing a CRM added complexity while an automated waitlist could fulfill seats directly. Aligned stakeholders on the data — fewer manual calls, ~90% faster turnaround — then wrote the stories and acceptance criteria, facilitated UAT, and coordinated release.",
      },
      {
        heading: "Results",
        body: "30% of waitlisted users converted, zero vacant seats, CRM complexity avoided. Everyone aligned once the results landed.",
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
      "AI feedback-triage agent: clusters user feedback into themes, grounds every recommendation in real source quotes, routes low-confidence calls to a human, and evaluates its own output.",
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
      "RAG life-coaching chat app (OpenAI embeddings + cosine retrieval).",
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