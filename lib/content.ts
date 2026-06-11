// ---------------------------------------------------------------------------
// All site copy and data lives here. Edit this file to change content —
// components only render what they're given.
// ---------------------------------------------------------------------------

import type { Repo } from "./github";

export const identity = {
  name: "Faraz Ali",
  title: "Associate Product Manager",
  location: "Bengaluru, India",
  company: "Incanus Technologies (Newton School)",
  tenure: "Mar 2025 – Present",
  positioning:
    "Product manager with 2+ years across edtech, e-commerce, and D2C — shipping growth, AI, and payments features that move revenue, retention, and operational efficiency.",
  phone: "+91 79911 93433",
  phoneHref: "tel:+917991193433",
  email: "faraz139@gmail.com",
  linkedin: "https://linkedin.com/in/-faraz",
  github: "https://github.com/FarazO7",
  githubUsername: "FarazO7",
  // Place the PDF at public/resume/Faraz-Ali-Product-Manager.pdf
  resumePath: "/resume/Faraz-Ali-Product-Manager.pdf",
  // Place the headshot at public/images/faraz-ali.jpg
  headshotPath: "/images/faraz-ali.jpg",
  headshotAlt: "Faraz Ali — Associate Product Manager",
} as const;

export const navLinks = [
  { label: "Work", href: "#work" },
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
};

export const metrics: Metric[] = [
  {
    value: 32,
    prefix: "+",
    suffix: "%",
    label: "Referral conversion lift",
    detail:
      "Owned roadmap and lifecycle of the referral growth module; OKRs, cohort and funnel analysis, incentive experiments.",
  },
  {
    value: 70,
    prefix: "−",
    suffix: "%",
    label: "Manual proctoring effort, across 15,000+ sessions",
    detail:
      "AI-powered exam monitoring: lightweight screenshot cadence, predefined malpractice flags, human-review pipeline.",
  },
  {
    value: 99,
    prefix: "−",
    suffix: "%",
    label: "Payment reconciliation effort, with 100% real-time transaction accuracy",
    detail:
      "Razorpay Route API split payments between two accounts, webhook-driven failure handling.",
  },
  {
    value: 30,
    suffix: "%",
    label: "Waitlist-to-seat conversion, zero vacant seats",
    detail:
      "Automated waitlisting workflows replacing a proposed CRM; cut turnaround ~90%.",
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
  docs?: { title: string; href: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    title: "Bumble — “Date Vibe”",
    subtitle: "Growth strategy",
    summary:
      "Simplified pre-date planning from user research; gamified solution projected ₹10 Cr annual revenue and +20% profile interactions.",
    href: "https://assets.nextleap.app/submissions/NLBumble-da078847-c1b6-4b73-b9c3-760f63b97b4c.pdf",
  },
  {
    title: "MakeMyTrip",
    subtitle: "Product teardown",
    href: "https://assets.nextleap.app/submissions/Makemytrip-9eb8bfaa-0280-463f-a9df-6ca31ed1887f.pdf",
  },
  {
    title: "Zepto",
    subtitle: "Product teardown",
    href: "https://assets.nextleap.app/submissions/Zepto-da51ae3f-a48d-40c6-9f3a-7615f18849e7.pdf",
  },
  {
    title: "Zomato — Increasing Reviews",
    subtitle: "Outcomes → insights → product note → PRD",
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

export type SkillGroup = { name: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    name: "Core PM",
    items: [
      "Product Strategy",
      "Roadmapping",
      "Discovery",
      "PRDs & User Stories",
      "GTM",
      "Agile/Scrum",
      "Release Management",
      "UAT",
      "Stakeholder Management",
      "OKRs/KPIs",
    ],
  },
  {
    name: "Data & Analytics",
    items: [
      "SQL",
      "Python",
      "Funnel & Cohort Analysis",
      "A/B Testing",
      "Mixpanel",
      "Product Analytics",
      "DAU/MAU",
      "Dashboarding",
    ],
  },
  {
    name: "AI & Automation",
    items: [
      "AI-Powered Products",
      "LLMs",
      "Prompt Engineering",
      "AI Agents",
      "Workflow Automation",
    ],
  },
  {
    name: "Tools",
    items: [
      "JIRA",
      "Confluence",
      "GA",
      "Firebase",
      "CleverTap",
      "Tableau",
      "Power BI",
      "Metabase",
      "SAP",
      "Advanced Excel",
    ],
  },
];

export type Credential = { text: string; href?: string };

export const achievements: Credential[] = [
  { text: "NextLeap Product Manager Top Fellow (2024)" },
  { text: "Runner-Up, “Call for Article” — Analytics Club, IIM Rohtak (2023)" },
  // Wire an href here if/when the PDF is supplied.
  { text: "Founder’s Recommendation Letter" },
];

export const certifications: Credential[] = [
  { text: "Lean Six Sigma — KPMG" },
  { text: "Business Analytics with Excel — Coursera" },
  { text: "Google Analytics Certification" },
  { text: "SQL for Data Science — Coursera" },
  { text: "Business Analysis & Process Management — Coursera" },
];

export const education: Credential[] = [
  {
    text: "PGDM, Marketing & Operations — Management Development Institute (MDI), Murshidabad",
  },
  {
    text: "B.Tech, Electronics & Telecommunication Engineering — KIIT University",
  },
];

export const architectureMap = {
  label: "Built with Next.js — architecture map in the repo",
  href: "/graphify-out/graph.html",
} as const;

/**
 * Static snapshot served when the GitHub API and the localStorage cache are
 * both unavailable. Mirrors the live API response captured on 2026-06-11.
 * (The spec's `Product-Management` repo is no longer returned by the API, so
 * the snapshot carries the four repos that actually exist.)
 */
export const fallbackRepos: Repo[] = [
  {
    name: "job-apply-assistant-1",
    description: "Automates job search process",
    language: "Python",
    stars: 0,
    url: "https://github.com/FarazO7/job-apply-assistant-1",
    pushedAt: "2026-06-10T03:02:58Z",
  },
  {
    name: "journey-mapper",
    description: "AI-Powered Growth CRM",
    language: "JavaScript",
    stars: 0,
    url: "https://github.com/FarazO7/journey-mapper",
    pushedAt: "2026-06-09T02:20:46Z",
  },
  {
    name: "everhope-website",
    description: "Technical Product Manager assignment for Everhope Oncology",
    language: "JavaScript",
    stars: 0,
    url: "https://github.com/FarazO7/everhope-website",
    pushedAt: "2026-06-06T01:30:18Z",
  },
  {
    name: "lighthouse-qa-monitor",
    description:
      "AI-powered QA monitoring agent for online marketplaces that proactively detects critical workflow failures, deduplicates recurring issues, translates technical errors into seller-friendly insights using LLMs, and delivers actionable Slack alerts before sellers encounter or report problems.",
    language: "Python",
    stars: 0,
    url: "https://github.com/FarazO7/lighthouse-qa-monitor",
    pushedAt: "2026-06-03T21:18:06Z",
  },
];
