export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://managerready-ai.vercel.app";

export type SeoPage = {
  slug: string;
  scenario: string;
  title: string;
  metaTitle: string;
  description: string;
  audience: string;
  pain: string;
  before: string;
  after: string;
  useCases: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const seoPages: SeoPage[] = [
  {
    slug: "manager-update-generator",
    scenario: "manager_update",
    title: "Manager Update Generator",
    metaTitle: "Manager Update Generator | ManagerReady AI",
    description:
      "Turn rough work notes into clear English manager updates with accomplishments, blockers, and next steps.",
    audience: "non-native English professionals who report progress to a manager",
    pain: "Messy notes often hide the real progress, risks, and decisions your manager needs to see.",
    before:
      "fixed checkout bug, aligned dashboard direction with design, analytics waiting API review, next week ship tracking",
    after:
      "This week, I fixed a checkout issue, aligned with design on the dashboard direction, and prepared the analytics release. The main blocker is the pending API review. Next week, I plan to ship tracking and validate the dashboard UX.",
    useCases: [
      "Weekly one-on-one updates",
      "Async manager check-ins",
      "Progress notes before performance review cycles",
      "Status updates for remote teams",
    ],
    faqs: [
      {
        question: "What should I include in a manager update?",
        answer:
          "Include completed work, measurable impact, blockers, decisions needed, and next steps. ManagerReady AI keeps those sections clear and concise.",
      },
      {
        question: "Can I paste Chinese and English notes together?",
        answer:
          "Yes. The generator is designed for multilingual notes and returns a polished English update.",
      },
    ],
  },
  {
    slug: "weekly-update-generator",
    scenario: "weekly_update",
    title: "Weekly Update Generator",
    metaTitle: "Weekly Update Generator | ManagerReady AI",
    description:
      "Create professional English weekly updates from rough notes, blockers, and next-week plans.",
    audience: "professionals who need a readable weekly status report",
    pain: "Weekly reports take too long when your raw notes are scattered across chats, tickets, and memory.",
    before:
      "shipped invoice export, talked to support about billing issues, still blocked by webhook edge cases, next week fix retries",
    after:
      "This week, I shipped invoice export, gathered billing feedback from support, and identified webhook retry edge cases as the main risk. Next week, I will improve retry handling and validate the billing flow.",
    useCases: [
      "Friday weekly reports",
      "Team status updates",
      "Remote async summaries",
      "Cross-functional progress notes",
    ],
    faqs: [
      {
        question: "Is this only for software teams?",
        answer:
          "No. It works for product, operations, sales, freelancers, and anyone who needs a clear English work update.",
      },
      {
        question: "Can I make the update shorter?",
        answer:
          "Yes. Choose Concise before generating, or use the Make it shorter refine action after generation.",
      },
    ],
  },
  {
    slug: "client-update-generator",
    scenario: "client_update",
    title: "Client Update Generator",
    metaTitle: "Client Update Generator | ManagerReady AI",
    description:
      "Write polished English client updates from delivery notes, blockers, timelines, and next steps.",
    audience: "freelancers, agencies, and delivery teams serving English-speaking clients",
    pain: "Client updates need to sound confident, specific, and accountable without overpromising.",
    before:
      "homepage done, payment copy still waiting, client gave feedback on mobile, next milestone staging review",
    after:
      "We completed the homepage implementation and incorporated mobile feedback. The payment copy is still pending, which may affect final review timing. The next milestone is a staging review once the remaining copy is confirmed.",
    useCases: [
      "Freelancer weekly client emails",
      "Agency delivery reports",
      "Project milestone updates",
      "Risk and timeline communication",
    ],
    faqs: [
      {
        question: "Will it invent client-friendly progress?",
        answer:
          "No. The prompt is designed to use only facts you provide and to avoid unsupported metrics or claims.",
      },
      {
        question: "Can I use it for freelance projects?",
        answer:
          "Yes. Client Update is one of the core formats and is useful for freelancers and small delivery teams.",
      },
    ],
  },
  {
    slug: "engineering-weekly-report-generator",
    scenario: "engineering_update",
    title: "Engineering Weekly Report Generator",
    metaTitle: "Engineering Weekly Report Generator | ManagerReady AI",
    description:
      "Convert engineering notes, bugs, releases, blockers, and technical progress into manager-ready English reports.",
    audience: "engineers and engineering managers working in English-speaking teams",
    pain: "Engineering updates often become either too technical or too vague for managers and stakeholders.",
    before:
      "reduced checkout 500s, added retry logs, PR for dashboard API open, blocked by schema decision",
    after:
      "This week, I reduced checkout 500 errors, added retry logging for better debugging, and opened the dashboard API pull request. The main blocker is a pending schema decision. Next week, I plan to finalize the API and monitor checkout stability.",
    useCases: [
      "Engineering weekly reports",
      "Sprint summaries",
      "Incident follow-ups",
      "Technical progress updates for managers",
    ],
    faqs: [
      {
        question: "How technical should an engineering update be?",
        answer:
          "It should explain technical work in terms of progress, impact, risks, and next steps. The generator keeps technical details readable for managers.",
      },
      {
        question: "Can it include blockers?",
        answer:
          "Yes. If you mention blockers or dependencies, the output highlights them clearly.",
      },
    ],
  },
  {
    slug: "performance-review-summary-generator",
    scenario: "promotion_summary",
    title: "Performance Review Summary Generator",
    metaTitle: "Performance Review Summary Generator | ManagerReady AI",
    description:
      "Turn raw achievements into a promotion-ready English performance review summary.",
    audience: "professionals preparing self-reviews, promotion packets, or achievement summaries",
    pain: "Self-reviews are hard when your impact is spread across many small wins and undocumented contributions.",
    before:
      "led analytics launch, helped support reduce manual work, mentored new teammate, improved dashboard reliability",
    after:
      "Over this cycle, I led the analytics launch, improved dashboard reliability, supported a new teammate, and helped reduce manual support work. These contributions improved execution quality and created a stronger foundation for future product decisions.",
    useCases: [
      "Performance self-review drafts",
      "Promotion packet summaries",
      "Achievement recap emails",
      "Career growth documentation",
    ],
    faqs: [
      {
        question: "Will it exaggerate my achievements?",
        answer:
          "No. It is designed to polish and organize your own facts, not invent impact or unsupported metrics.",
      },
      {
        question: "Should I include numbers?",
        answer:
          "Yes. Add metrics where you have them. Numbers make review summaries more credible and easier to evaluate.",
      },
    ],
  },
];

export const updateTemplates = [
  {
    title: "Manager Update",
    scenario: "manager_update",
    template:
      "This week, I focused on [main priority]. I completed [specific work] and made progress on [workstream]. The main blocker is [blocker], and I need [decision/help] to move forward. Next week, I plan to [next step].",
  },
  {
    title: "Engineering Weekly Update",
    scenario: "engineering_update",
    template:
      "This week, I shipped [technical change], improved [system/process], and investigated [issue]. The key risk is [risk/dependency]. Next week, I will [implementation step] and validate [quality or metric].",
  },
  {
    title: "Client Update",
    scenario: "client_update",
    template:
      "This week, we completed [deliverable] and progressed [milestone]. We are waiting on [client input/dependency], which may affect [timeline/scope]. Next, we will [next milestone] and share [artifact/review].",
  },
  {
    title: "Standup Summary",
    scenario: "standup_summary",
    template:
      "Yesterday, I completed [work]. Today, I am focusing on [priority]. I am blocked by [blocker], and I need [support/decision] to continue.",
  },
  {
    title: "Promotion Summary",
    scenario: "promotion_summary",
    template:
      "Over this period, I delivered [major outcome], improved [process/system], and contributed to [team/customer impact]. These results show growth in [skill/level expectation] and create value by [business impact].",
  },
];

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}
