// ---------------------------------------------------------------------------
// All site copy and data lives here. Edit this file to change content —
// components only render what they're given.
// ---------------------------------------------------------------------------

export const identity = {
  name: "Faraz Ali",
  title: "Associate Product Manager",
  location: "Bengaluru, India",
  company: "Incanus Technologies (Newton School)",
  tenure: "Mar 2025 – Present",
  positioning:
    "Product manager with 2+ years across edtech, e-commerce, and D2C — shipping growth, AI, and payments features that move revenue, retention, and operational efficiency.",
  companyShort: "Newton School",
  greeting: "Hello there!",
  bio:
    "I'm a product manager focused on growth, AI, and payments — the work that moves revenue, retention, and operational efficiency. Two-plus years across edtech, e-commerce, and D2C, turning fuzzy problems into shipped features and measurable outcomes.",
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
  headshotAlt: "Faraz Ali — Associate Product Manager",
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
};

export const metrics: Metric[] = [
  {
    value: 32,
    prefix: "+",
    suffix: "%",
    label: "Referral conversion lift",
    detail:
      "Owned roadmap and lifecycle of the referral growth module; OKRs, cohort and funnel analysis, incentive experiments.",
    slug: "referral-growth",
  },
  {
    value: 70,
    prefix: "−",
    suffix: "%",
    label: "Manual proctoring effort, across 15,000+ sessions",
    detail:
      "AI-powered exam monitoring: lightweight screenshot cadence, predefined malpractice flags, human-review pipeline.",
    slug: "ai-proctoring",
  },
  {
    value: 99,
    prefix: "−",
    suffix: "%",
    label: "Payment reconciliation effort, with 100% real-time transaction accuracy",
    detail:
      "Razorpay Route API split payments between two accounts, webhook-driven failure handling.",
    slug: "razorpay-route",
  },
  {
    value: 30,
    suffix: "%",
    label: "Waitlist-to-seat conversion, zero vacant seats",
    detail:
      "Automated waitlisting workflows replacing a proposed CRM; cut turnaround ~90%.",
    slug: "waitlist-automation",
  },
];

export type Role = {
  title: string;
  company: string;
  location: string;
  dates: string;
  current?: boolean;
  bullets: string[];
};

export const experience: Role[] = [
  {
    title: "Associate Product Manager",
    company: "Incanus Technologies (Newton School)",
    location: "Bengaluru",
    dates: "Mar 2025 – Present",
    current: true,
    bullets: [
      "Owned acquisition-funnel optimisation, raising sign-up conversion 10% → 19.1% (+91%)",
      "Referral growth module end-to-end: +32% conversion; A/B tested monetary vs prep-material vs combined incentives (+15% signups at target CAC); reward pivot to ChatGPT Plus voucher lifted power-user referrals +20%",
      "AI exam monitoring: PRD through release; −70% manual effort over 15K+ sessions",
      "Funnel instrumentation in Mixpanel: fixed copy-link drop-off (+18% interactions, +10% referral conversions); CleverTap re-engagement journeys (WhatsApp/email/SMS) re-activated dormant users (+12% signups)",
      "Razorpay Route integration: split-payment rules, webhook error handling, payment-ID mapping; −99% manual reconciliation",
      "RICE-prioritized self-serve interview rescheduling: +8% completion, +2% downstream admissions",
      "Agile/Scrum in JIRA, Click-Up documentation, DAU/MAU growth dashboards",
    ],
  },
  {
    title: "Product Management Trainee",
    company: "Healthkart",
    location: "Gurugram",
    dates: "Aug 2024 – Mar 2025",
    bullets: [
      "ERP roadmap (SAP B1, Pharmacloud) unlocking a category worth 5% of total revenue; ERPNext migration requirements toward SOC-2 compliance; PRDs, user stories, journey optimization",
    ],
  },
  {
    title: "Category Management Intern",
    company: "Healthmug",
    location: "New Delhi",
    dates: "Apr 2023 – Jul 2023",
    bullets: [
      "Purchase-data analytics: +25% repeat purchases; catalog expansion +18%, contributing to 35% MoM growth",
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
    href: "/case-studies/bumble.pdf",
  },
  {
    title: "MakeMyTrip",
    subtitle: "Product teardown",
    slug: "makemytrip",
    // REVIEW(Faraz): summary written from the deck — adjust wording as you like.
    summary:
      "A Growth-team teardown answering MakeMyTrip's mandate to crack trip planning — an unsolved gap in travel — with a GenAI-powered planner. Works through the business model, competitor and actor mapping, and a structured problem breakdown.",
    href: "/case-studies/makemytrip.pdf",
  },
  {
    title: "Zepto",
    subtitle: "Product teardown",
    slug: "zepto",
    // REVIEW(Faraz): summary written from the deck — adjust wording as you like.
    summary:
      "A Growth teardown targeting Zepto's low average order value — the lever for quick-commerce unit economics. Maps the business outcome (profitability) to product outcomes (higher basket quantity and unit price), with problem validation and framing.",
    href: "/case-studies/zepto.pdf",
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
        href: "/case-studies/zomato-1-product-outcomes.pdf",
      },
      {
        title: "Deriving Insights from Users",
        href: "/case-studies/zomato-2-user-insights.pdf",
      },
      {
        title: "Product Note",
        href: "/case-studies/zomato-3-product-note.pdf",
      },
      {
        title: "PRD",
        href: "/case-studies/zomato-4-prd.pdf",
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
    title: "PGDM — Marketing & Supply Chain Management",
    company: "Management Development Institute (MDI)",
    location: "Murshidabad",
    dates: "", // TODO(Faraz): add years, e.g. "2023 – 2025"
    bullets: [],
  },
  {
    title: "B.Tech, Electronics & Telecommunication Engineering",
    company: "KIIT University",
    location: "Bhubaneswar",
    dates: "", // TODO(Faraz): add years
    bullets: [],
  },
];

export const architectureMap = {
  label: "Built with Next.js — architecture map in the repo",
  // Deploy-independent GitHub-hosted path to the committed map file, so the
  // link can't 404 against a stale export (unlike the old /graphify-out/ path).
  href: "https://github.com/FarazO7/faraz-website/blob/main/public/graphify-out/graph.html",
} as const;

// ---------------------------------------------------------------------------
// Impact detail pages (Phase 7). Each hero metric tile links to /impact/{slug}.
// Narratives are the owner's, transcribed verbatim — no invented numbers.
// ---------------------------------------------------------------------------

export type ImpactMeta = { label: string; value: string };
export type ImpactSection = { heading: string; body: string };
export type ImpactDetail = {
  slug: string;
  metric: string;
  outcome: string;
  meta: ImpactMeta[];
  sections: ImpactSection[];
};

export const impactDetails: ImpactDetail[] = [
  {
    slug: "referral-growth",
    metric: "+32% Referral Conversion",
    outcome: "Referrals became a core growth lever for the platform.",
    meta: [
      { label: "Project type", value: "Growth module, end-to-end ownership" },
      { label: "Company", value: "Newton School (Incanus Technologies)" },
      { label: "Industry", value: "Edtech" },
      { label: "Role", value: "Associate Product Manager" },
      { label: "Collaboration", value: "PM + engineering + program team" },
      { label: "Timeline", value: "Mar 2025 – Present" },
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