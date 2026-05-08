export type GuidePage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  steps: string[];
  example: {
    before: string;
    after: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export type WorkExample = {
  title: string;
  scenario: string;
  before: string;
  after: string;
};

export const guidePages: GuidePage[] = [
  {
    slug: "how-to-write-a-manager-update",
    title: "How to Write a Manager Update",
    metaTitle: "How to Write a Manager Update | ManagerReady AI",
    description:
      "Learn the structure of a clear manager update, with examples for accomplishments, blockers, risks, and next steps.",
    intro:
      "A good manager update helps your manager understand what changed, what is blocked, and what needs attention. It should be short enough to scan and specific enough to guide decisions.",
    steps: [
      "Start with a one or two sentence executive summary.",
      "List the most important accomplishments, not every task.",
      "Call out blockers, risks, or decisions needed.",
      "End with next steps for the coming week.",
      "Add numbers only when you actually have them.",
    ],
    example: {
      before:
        "fixed checkout bug, dashboard still under review, analytics release ready but API approval blocked",
      after:
        "This week, I fixed a checkout issue and prepared the analytics release. The dashboard update is still under review, and API approval is the main blocker. Next week, I plan to finalize the dashboard review and follow up on the API approval.",
    },
    faqs: [
      {
        question: "How long should a manager update be?",
        answer:
          "Most manager updates should be between 120 and 250 words unless your manager asks for more detail.",
      },
      {
        question: "Should I include blockers?",
        answer:
          "Yes. A clear blocker section helps your manager remove dependencies or adjust expectations early.",
      },
    ],
  },
  {
    slug: "how-to-write-a-weekly-work-update",
    title: "How to Write a Weekly Work Update",
    metaTitle: "How to Write a Weekly Work Update | ManagerReady AI",
    description:
      "A practical format for weekly work updates with accomplishments, blockers, risks, and plans for next week.",
    intro:
      "A weekly work update should turn a scattered week into a clear story of progress. The best updates show what was completed, what changed, what is blocked, and what happens next.",
    steps: [
      "Group related tasks into outcomes.",
      "Mention impact before implementation details.",
      "Separate blockers from normal in-progress work.",
      "Use next-week plans to show ownership.",
      "Keep the tone professional and factual.",
    ],
    example: {
      before:
        "worked on invoice export, talked to support, billing webhooks still flaky, next week retries",
      after:
        "This week, I progressed invoice export and gathered billing feedback from the support team. The main risk is webhook reliability, especially around retry behavior. Next week, I will improve retry handling and validate the billing flow end to end.",
    },
    faqs: [
      {
        question: "What sections should a weekly update include?",
        answer:
          "Use Executive Summary, Key Accomplishments, Blockers or Risks, and Plans for Next Week.",
      },
      {
        question: "Can a weekly update be written from rough notes?",
        answer:
          "Yes. Rough bullets are often enough if they include completed work, blockers, and next steps.",
      },
    ],
  },
  {
    slug: "chatgpt-prompts-for-weekly-updates",
    title: "ChatGPT Prompts for Weekly Updates",
    metaTitle: "ChatGPT Prompts for Weekly Updates | ManagerReady AI",
    description:
      "Copy practical prompts for turning rough work notes into professional English weekly updates.",
    intro:
      "If you use a general AI assistant, the prompt matters. A good prompt should define the output format, tone, length, and rules that prevent unsupported claims.",
    steps: [
      "Tell the model the audience for the update.",
      "Specify the structure you want.",
      "Ask it to preserve only provided facts.",
      "Ask for blockers and next steps as separate sections.",
      "Use a follow-up prompt to make the draft shorter or more data-driven.",
    ],
    example: {
      before:
        "Prompt: Turn these notes into a professional manager update. Use only the facts provided. Include Executive Summary, Key Accomplishments, Blockers / Risks, and Plans for Next Week. Notes: [paste notes].",
      after:
        "ManagerReady AI applies this structure automatically and adds scenario, tone, length, and one-click refinement controls.",
    },
    faqs: [
      {
        question: "Can I use ChatGPT instead of ManagerReady AI?",
        answer:
          "Yes. ChatGPT is flexible. ManagerReady AI is more focused on workplace update formats, multilingual notes, and repeatable manager-ready outputs.",
      },
      {
        question: "What is the most important prompt rule?",
        answer:
          "Ask the model to avoid inventing unsupported metrics, launch status, customer impact, or owners.",
      },
    ],
  },
];

export const workExamples: WorkExample[] = [
  {
    title: "Manager update from mixed notes",
    scenario: "manager_update",
    before:
      "修了 checkout bug；dashboard 跟设计对齐；analytics 下周上线；API review blocked",
    after:
      "This week, I fixed a checkout issue, aligned with design on the dashboard direction, and prepared the analytics release. The main blocker is the pending API review. Next week, I plan to ship analytics and validate the dashboard UX.",
  },
  {
    title: "Engineering weekly report",
    scenario: "engineering_update",
    before:
      "merged retry logs, reduced checkout 500s, dashboard API PR open, schema decision pending",
    after:
      "This week, I added retry logging, reduced checkout 500 errors, and opened the dashboard API pull request. The main blocker is a pending schema decision. Next week, I will finalize the API work and monitor checkout stability.",
  },
  {
    title: "Client project update",
    scenario: "client_update",
    before:
      "homepage done, Stripe fixed, waiting final images, staging review tomorrow if assets arrive",
    after:
      "The homepage is complete, and the Stripe issue has been fixed. We are waiting on the final images before staging review. If the assets are confirmed today, we can review staging tomorrow.",
  },
  {
    title: "Product manager weekly update",
    scenario: "product_update",
    before:
      "5 beta interviews, pricing copy drafted, dashboard scope unclear, launch checklist next week",
    after:
      "This week, I interviewed five beta users, drafted pricing page copy, and continued dashboard scope discussions. The key risk is that dashboard scope is not finalized. Next week, I will align the launch checklist and confirm open scope decisions.",
  },
  {
    title: "Remote async status update",
    scenario: "weekly_update",
    before:
      "finished onboarding doc, vendor timezone issue, QA result pending, tomorrow release checklist",
    after:
      "I finished the onboarding documentation and identified a timezone coordination issue with the vendor. The release is waiting on QA results. Tomorrow, I will update the release checklist and follow up on vendor timing.",
  },
  {
    title: "Performance review summary",
    scenario: "promotion_summary",
    before:
      "led analytics launch, helped support reduce manual work, mentored new teammate, improved dashboard reliability",
    after:
      "Over this period, I led the analytics launch, improved dashboard reliability, supported a new teammate, and helped reduce manual support work. These contributions improved execution quality and created a stronger foundation for future product decisions.",
  },
];

export function getGuidePage(slug: string) {
  return guidePages.find((page) => page.slug === slug);
}
