export type GrowthTemplatePage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  scenario: string;
  audience: string;
  template: string;
  exampleInput: string;
  exampleOutput: string;
  tips: string[];
};

export type GrowthExamplePage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  scenario: string;
  audience: string;
  examples: Array<{
    label: string;
    before: string;
    after: string;
  }>;
};

export type GrowthAnswerPage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  scenario: string;
  answer: string;
  keyPoints: string[];
  example: {
    before: string;
    after: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const growthTemplatePages: GrowthTemplatePage[] = [
  {
    slug: "manager-update-template",
    title: "Manager Update Template",
    metaTitle: "Manager Update Template | ManagerReady AI",
    description:
      "Copy a concise manager update template for accomplishments, blockers, decisions, and next steps.",
    scenario: "manager_update",
    audience: "professionals who report progress to a manager",
    template:
      "This week, I focused on [main priority]. I completed [specific work] and made progress on [workstream]. The main blocker is [blocker or decision needed]. Next week, I plan to [next step] and will need [support or approval] to move forward.",
    exampleInput:
      "fixed login issue, dashboard copy waiting review, talked to support about billing bug, next week release checklist",
    exampleOutput:
      "This week, I fixed a login issue, gathered support context on a billing bug, and prepared the next release checklist. The dashboard copy is still waiting for review. Next week, I plan to finalize the release checklist and follow up on the copy review.",
    tips: [
      "Mention the most important outcome first.",
      "Separate blockers from normal in-progress work.",
      "Ask for a decision only when one is actually needed.",
    ],
  },
  {
    slug: "weekly-work-update-template",
    title: "Weekly Work Update Template",
    metaTitle: "Weekly Work Update Template | ManagerReady AI",
    description:
      "Use a weekly work update template to summarize progress, risks, and plans in professional English.",
    scenario: "weekly_update",
    audience: "remote workers and professionals who send weekly updates",
    template:
      "This week, I completed [work completed], progressed [ongoing work], and learned [important context]. The main risk is [risk or blocker]. Next week, I will [priority 1], [priority 2], and [follow-up].",
    exampleInput:
      "invoice export shipped, onboarding doc draft done, webhook retries still flaky, next week QA billing flow",
    exampleOutput:
      "This week, I shipped invoice export and drafted the onboarding documentation. The main risk is that webhook retry behavior is still unstable. Next week, I will QA the billing flow, improve retry handling, and prepare the onboarding doc for review.",
    tips: [
      "Group small tasks into outcomes.",
      "Keep the update scannable.",
      "Include next-week ownership so the update feels actionable.",
    ],
  },
  {
    slug: "client-update-email-template",
    title: "Client Update Email Template",
    metaTitle: "Client Update Email Template | ManagerReady AI",
    description:
      "Copy a client update email template for freelance, agency, and delivery project communication.",
    scenario: "client_update",
    audience: "freelancers, agencies, consultants, and client-facing teams",
    template:
      "Hi [client name], here is this week's update. We completed [deliverable], progressed [milestone], and are currently waiting on [dependency]. The main risk is [risk], which may affect [timeline or scope]. Next, we will [next action] and share [artifact or review step].",
    exampleInput:
      "homepage done, Stripe fixed, waiting images, staging review tomorrow if assets arrive",
    exampleOutput:
      "The homepage is complete, and the Stripe issue has been fixed. We are waiting on the final images before staging review. If the assets are confirmed today, we can review staging tomorrow.",
    tips: [
      "Be specific without sounding defensive.",
      "State dependencies early.",
      "Avoid promising dates unless the dependency is clear.",
    ],
  },
  {
    slug: "engineering-weekly-report-template",
    title: "Engineering Weekly Report Template",
    metaTitle: "Engineering Weekly Report Template | ManagerReady AI",
    description:
      "Use an engineering weekly report template for releases, bugs, technical risks, and next steps.",
    scenario: "engineering_update",
    audience: "software engineers and engineering managers",
    template:
      "This week, I shipped [technical change], improved [system or workflow], and investigated [issue]. The main technical risk is [risk or dependency]. Next week, I will [implementation step], validate [quality signal], and follow up on [dependency].",
    exampleInput:
      "merged auth cleanup, fixed checkout flaky test, Redis timeout investigation, infra review pending",
    exampleOutput:
      "This week, I merged the authentication cleanup, fixed a flaky checkout test, and investigated Redis timeout issues. The main dependency is an infrastructure review. Next week, I plan to complete the review follow-up and monitor checkout test stability.",
    tips: [
      "Translate technical work into impact and risk.",
      "Keep implementation details short.",
      "Mention PRs or incidents only when they change status or risk.",
    ],
  },
  {
    slug: "product-manager-weekly-update-template",
    title: "Product Manager Weekly Update Template",
    metaTitle: "Product Manager Weekly Update Template | ManagerReady AI",
    description:
      "Copy a product manager weekly update template for discovery, launch work, risks, and stakeholder alignment.",
    scenario: "product_update",
    audience: "product managers working with cross-functional teams",
    template:
      "This week, I learned [customer or stakeholder insight], progressed [product work], and aligned on [decision or open topic]. The main risk is [risk]. Next week, I will [priority], confirm [decision], and share [artifact or plan].",
    exampleInput:
      "5 beta interviews, pricing page copy drafted, dashboard scope unclear, next week align launch checklist",
    exampleOutput:
      "This week, I interviewed five beta users, drafted pricing page copy, and continued dashboard scope discussions. The key risk is that dashboard scope is not finalized. Next week, I will align the launch checklist and confirm open scope decisions.",
    tips: [
      "Connect research and delivery work.",
      "Make unresolved decisions visible.",
      "Use next steps to show momentum.",
    ],
  },
  {
    slug: "remote-team-status-update-template",
    title: "Remote Team Status Update Template",
    metaTitle: "Remote Team Status Update Template | ManagerReady AI",
    description:
      "Use a remote team status update template for async updates across time zones.",
    scenario: "weekly_update",
    audience: "remote workers and distributed teams",
    template:
      "Since the last update, I completed [progress], continued [ongoing work], and found [risk or dependency]. I am currently blocked by [blocker]. My next actions are [next action 1] and [next action 2].",
    exampleInput:
      "finished onboarding doc, vendor timezone issue, QA result pending, tomorrow release checklist",
    exampleOutput:
      "I finished the onboarding documentation and identified a timezone coordination issue with the vendor. The release is waiting on QA results. Tomorrow, I will update the release checklist and follow up on vendor timing.",
    tips: [
      "Write enough context for people in other time zones.",
      "Make blockers easy to find.",
      "Keep the update useful without requiring a meeting.",
    ],
  },
  {
    slug: "self-review-summary-template",
    title: "Self-Review Summary Template",
    metaTitle: "Self-Review Summary Template | ManagerReady AI",
    description:
      "Copy a self-review summary template for achievements, impact, growth, and next development goals.",
    scenario: "promotion_summary",
    audience: "professionals preparing performance reviews",
    template:
      "Over this period, I delivered [major outcome], improved [process or system], and contributed to [team or customer impact]. I grew in [skill area] by [evidence]. Next, I want to focus on [development goal] and create more impact through [future contribution].",
    exampleInput:
      "led analytics launch, helped support reduce manual work, mentored teammate, improved dashboard reliability",
    exampleOutput:
      "Over this period, I led the analytics launch, improved dashboard reliability, supported a new teammate, and helped reduce manual support work. These contributions improved execution quality and created a stronger foundation for future product decisions.",
    tips: [
      "Use evidence instead of vague adjectives.",
      "Tie achievements to team or customer impact.",
      "Avoid inventing metrics you cannot support.",
    ],
  },
  {
    slug: "blockers-and-risks-update-template",
    title: "Blockers and Risks Update Template",
    metaTitle: "Blockers and Risks Update Template | ManagerReady AI",
    description:
      "Use a blockers and risks update template to communicate dependencies, decisions, and next actions clearly.",
    scenario: "manager_update",
    audience: "professionals who need help unblocking work",
    template:
      "Current status: [progress]. Main blocker: [blocker]. Risk if unresolved: [risk]. Decision or support needed: [decision/help]. Next action from my side: [next step].",
    exampleInput:
      "migration code done, legal review pending, release date depends on approval, I can prep rollout doc",
    exampleOutput:
      "Current status: the migration code is complete. The main blocker is pending legal review. If the review is delayed, the release date may need to move. I can prepare the rollout documentation while waiting for approval.",
    tips: [
      "Name the blocker directly.",
      "Explain the consequence of delay.",
      "Make the requested decision or support explicit.",
    ],
  },
];

export const growthExamplePages: GrowthExamplePage[] = [
  {
    slug: "manager-update-examples",
    title: "Manager Update Examples",
    metaTitle: "Manager Update Examples | ManagerReady AI",
    description:
      "See manager update examples that turn rough notes into clear English progress updates.",
    scenario: "manager_update",
    audience: "professionals reporting to a manager",
    examples: [
      {
        label: "Mixed-language manager update",
        before: "修了 checkout bug, dashboard design aligned, API review blocked, next week analytics release",
        after:
          "This week, I fixed a checkout bug, aligned with design on the dashboard direction, and prepared the analytics release. The main blocker is the pending API review. Next week, I plan to ship analytics and validate the dashboard UX.",
      },
      {
        label: "Decision-needed update",
        before: "billing migration ready, compliance question open, release cannot be scheduled, need legal input",
        after:
          "The billing migration is ready, but release scheduling is blocked by an open compliance question. I need legal input before confirming the release date. While waiting, I will prepare the rollout checklist and validation plan.",
      },
    ],
  },
  {
    slug: "weekly-update-examples",
    title: "Weekly Update Examples",
    metaTitle: "Weekly Update Examples | ManagerReady AI",
    description:
      "Browse weekly update examples for work summaries, blockers, risks, and next-week plans.",
    scenario: "weekly_update",
    audience: "professionals sending weekly status reports",
    examples: [
      {
        label: "Cross-functional weekly update",
        before: "invoice export shipped, support feedback reviewed, webhook retry edge cases open, next week QA",
        after:
          "This week, I shipped invoice export and reviewed billing feedback from support. The main risk is webhook retry behavior, which still needs validation. Next week, I will QA the billing flow and improve retry handling.",
      },
      {
        label: "Remote weekly summary",
        before: "onboarding draft done, vendor timezone issue, QA result pending, update release checklist tomorrow",
        after:
          "This week, I completed the onboarding draft and identified a timezone issue with the vendor. The release is waiting on QA results. Tomorrow, I will update the release checklist and follow up on vendor timing.",
      },
    ],
  },
  {
    slug: "client-update-email-examples",
    title: "Client Update Email Examples",
    metaTitle: "Client Update Email Examples | ManagerReady AI",
    description:
      "Use client update email examples for freelance projects, agency delivery, and milestone communication.",
    scenario: "client_update",
    audience: "freelancers, agencies, and delivery teams",
    examples: [
      {
        label: "Freelance milestone update",
        before: "homepage done, Stripe fixed, final images missing, staging tomorrow if assets arrive",
        after:
          "The homepage is complete, and the Stripe issue has been fixed. We are waiting on the final images before staging review. If the assets are confirmed today, we can review staging tomorrow.",
      },
      {
        label: "Delay with clear dependency",
        before: "API integration started, client credentials not working, can continue UI polish, need new token",
        after:
          "We started the API integration, but the current credentials are not working. This blocks full integration testing. In the meantime, we will continue UI polish and need an updated token to proceed with backend validation.",
      },
    ],
  },
  {
    slug: "engineering-weekly-report-examples",
    title: "Engineering Weekly Report Examples",
    metaTitle: "Engineering Weekly Report Examples | ManagerReady AI",
    description:
      "See engineering weekly report examples for bugs, releases, PRs, incidents, and blockers.",
    scenario: "engineering_update",
    audience: "software engineers and technical leads",
    examples: [
      {
        label: "Engineering progress and blocker",
        before: "retry logs merged, checkout 500s reduced, dashboard API PR open, schema decision pending",
        after:
          "This week, I added retry logging, reduced checkout 500 errors, and opened the dashboard API pull request. The main blocker is a pending schema decision. Next week, I will finalize the API work and monitor checkout stability.",
      },
      {
        label: "Incident follow-up",
        before: "Redis timeout root cause not confirmed, added metrics, rollback plan drafted, infra review tomorrow",
        after:
          "This week, I investigated Redis timeout behavior, added additional metrics, and drafted a rollback plan. The root cause is not confirmed yet, and the next dependency is tomorrow's infrastructure review.",
      },
    ],
  },
  {
    slug: "product-manager-update-examples",
    title: "Product Manager Update Examples",
    metaTitle: "Product Manager Update Examples | ManagerReady AI",
    description:
      "Read product manager update examples for discovery, launch planning, stakeholder alignment, and risks.",
    scenario: "product_update",
    audience: "product managers and product owners",
    examples: [
      {
        label: "Discovery and launch update",
        before: "5 beta interviews, pricing copy drafted, dashboard scope unclear, launch checklist next week",
        after:
          "This week, I interviewed five beta users, drafted pricing page copy, and continued dashboard scope discussions. The key risk is that dashboard scope is not finalized. Next week, I will align the launch checklist and confirm open scope decisions.",
      },
      {
        label: "Stakeholder alignment update",
        before: "sales asks export, design says too much scope, eng wants API freeze, need decision by Friday",
        after:
          "This week, I gathered export requirements from sales and reviewed scope concerns with design and engineering. The main decision is whether export remains in the current release before the API freeze. I need alignment by Friday to keep the launch plan clear.",
      },
    ],
  },
  {
    slug: "performance-review-summary-examples",
    title: "Performance Review Summary Examples",
    metaTitle: "Performance Review Summary Examples | ManagerReady AI",
    description:
      "Use performance review summary examples to turn raw achievements into polished self-review drafts.",
    scenario: "promotion_summary",
    audience: "professionals preparing self-reviews or promotion packets",
    examples: [
      {
        label: "Product impact summary",
        before: "led analytics launch, helped support reduce manual work, mentored teammate, improved dashboard reliability",
        after:
          "Over this period, I led the analytics launch, improved dashboard reliability, supported a new teammate, and helped reduce manual support work. These contributions improved execution quality and created a stronger foundation for future product decisions.",
      },
      {
        label: "Engineering growth summary",
        before: "owned billing retries, improved tests, handled incident follow-up, documented release process",
        after:
          "Over this cycle, I owned billing retry improvements, strengthened test coverage, supported incident follow-up, and documented the release process. These contributions improved reliability and made future releases easier for the team to execute.",
      },
    ],
  },
];

export const growthAnswerPages: GrowthAnswerPage[] = [
  {
    slug: "what-is-managerready-ai",
    title: "What is ManagerReady AI?",
    metaTitle: "What is ManagerReady AI? | ManagerReady AI",
    description:
      "A clear answer explaining what ManagerReady AI does and who uses it.",
    scenario: "manager_update",
    answer:
      "ManagerReady AI is a focused writing tool that turns rough multilingual work notes into polished English workplace updates. It is built for people who need manager updates, weekly reports, client updates, standup summaries, and performance review summaries.",
    keyPoints: [
      "It is designed for workplace updates, not generic long-form writing.",
      "It supports rough notes and mixed-language input.",
      "It keeps progress, blockers, risks, and next steps clear.",
      "It avoids inventing unsupported metrics or completed work.",
    ],
    example: {
      before: "修了 bug, API review blocked, next week dashboard QA",
      after:
        "This week, I fixed a bug and prepared for dashboard QA. The main blocker is the pending API review. Next week, I plan to complete dashboard QA once the review is resolved.",
    },
    faqs: [
      {
        question: "Is ManagerReady AI a grammar checker?",
        answer:
          "No. It restructures rough work notes into complete manager-ready updates instead of only correcting grammar.",
      },
      {
        question: "Can it handle non-English notes?",
        answer:
          "Yes. It is designed for multilingual notes and produces polished English output.",
      },
    ],
  },
  {
    slug: "who-is-managerready-ai-for",
    title: "Who is ManagerReady AI for?",
    metaTitle: "Who is ManagerReady AI for? | ManagerReady AI",
    description:
      "ManagerReady AI is for non-native English professionals, remote workers, engineers, PMs, and client-facing teams.",
    scenario: "weekly_update",
    answer:
      "ManagerReady AI is for professionals who know what they accomplished but need help turning rough notes into clear English updates. It is especially useful for non-native English speakers, remote team members, engineers, product managers, freelancers, and client-facing teams.",
    keyPoints: [
      "Engineers can summarize PRs, bugs, incidents, and blockers.",
      "Product managers can summarize discovery, launch work, and risks.",
      "Freelancers can write more confident client updates.",
      "Remote workers can send clearer async status updates.",
    ],
    example: {
      before: "interviews done, launch checklist not aligned, dashboard scope pending",
      after:
        "This week, I completed user interviews and continued launch planning. The main risk is that dashboard scope is still pending. Next week, I will align the launch checklist and confirm open scope decisions.",
    },
    faqs: [
      {
        question: "Is it only for engineers?",
        answer:
          "No. It supports engineering, product, client, weekly, standup, and promotion summary formats.",
      },
      {
        question: "Is it useful for native English speakers?",
        answer:
          "Yes, but the strongest use case is helping non-native speakers write faster and more confidently in English.",
      },
    ],
  },
  {
    slug: "best-ai-weekly-update-generator-for-non-native-english-speakers",
    title: "Best AI Weekly Update Generator for Non-Native English Speakers",
    metaTitle: "Best AI Weekly Update Generator for Non-Native English Speakers | ManagerReady AI",
    description:
      "Why non-native English professionals use a focused weekly update generator instead of starting from a blank page.",
    scenario: "weekly_update",
    answer:
      "A good AI weekly update generator for non-native English speakers should accept rough notes, preserve facts, improve structure, and produce natural workplace English. ManagerReady AI focuses on exactly that workflow.",
    keyPoints: [
      "Paste rough bullets instead of writing a full draft.",
      "Choose a workplace scenario and tone.",
      "Get a structured update with progress, blockers, and next steps.",
      "Refine the result to make it shorter, clearer, or more data-driven.",
    ],
    example: {
      before: "billing flow QA, support feedback reviewed, webhook bug still open",
      after:
        "This week, I reviewed support feedback and continued QA for the billing flow. The main open issue is a webhook bug that still needs investigation. Next week, I will validate the billing flow and follow up on the webhook fix.",
    },
    faqs: [
      {
        question: "What makes a weekly update manager-ready?",
        answer:
          "It should be specific, structured, easy to scan, and honest about blockers or risks.",
      },
      {
        question: "Should I include metrics?",
        answer:
          "Yes, when you have real metrics. If you do not, use factual qualitative wording instead.",
      },
    ],
  },
  {
    slug: "managerready-ai-vs-chatgpt-for-weekly-updates",
    title: "ManagerReady AI vs ChatGPT for Weekly Updates",
    metaTitle: "ManagerReady AI vs ChatGPT for Weekly Updates | ManagerReady AI",
    description:
      "Compare ManagerReady AI and ChatGPT for writing weekly updates, manager updates, and client status emails.",
    scenario: "weekly_update",
    answer:
      "ChatGPT is flexible and can write many kinds of text. ManagerReady AI is narrower: it is built around repeatable workplace update formats, scenario controls, copy actions, refinement actions, and prompts that avoid unsupported claims.",
    keyPoints: [
      "Use ChatGPT when you need a general assistant.",
      "Use ManagerReady AI when you repeatedly write work updates.",
      "ManagerReady AI gives predefined scenarios, tone, and length controls.",
      "The tool is optimized for rough notes, blockers, and next steps.",
    ],
    example: {
      before: "shipping delayed by QA, docs ready, need PM decision on rollout scope",
      after:
        "The documentation is ready, but shipping is delayed by QA. The main decision needed is rollout scope confirmation from product. Once that decision is made, I can finalize the release plan.",
    },
    faqs: [
      {
        question: "Can I do the same thing with ChatGPT?",
        answer:
          "Yes, if you write a strong prompt each time. ManagerReady AI packages that workflow into a focused generator.",
      },
      {
        question: "Does ManagerReady AI replace ChatGPT?",
        answer:
          "No. It is a focused tool for a recurring workplace writing task.",
      },
    ],
  },
  {
    slug: "how-managerready-ai-works",
    title: "How ManagerReady AI Works",
    metaTitle: "How ManagerReady AI Works | ManagerReady AI",
    description:
      "Learn how ManagerReady AI turns rough work notes into structured English updates.",
    scenario: "manager_update",
    answer:
      "ManagerReady AI asks for rough work notes, a scenario, tone, and length. It then rewrites the notes into a structured update with executive summary, accomplishments, blockers or risks, and next steps.",
    keyPoints: [
      "The user provides the facts.",
      "The scenario selects the output format.",
      "The tone and length controls shape the draft.",
      "Refinement actions help improve the result without starting over.",
    ],
    example: {
      before: "phase 1 done, vendor API unstable, finance approval pending",
      after:
        "Phase 1 is complete. The main risk is vendor API instability, and finance approval is still pending. Next week, the priority is to confirm the rollout plan and align dependencies before moving forward.",
    },
    faqs: [
      {
        question: "Does it save my notes?",
        answer:
          "The current public generator is designed as a lightweight preview. Product storage behavior should be checked in the current product interface before sharing sensitive data.",
      },
      {
        question: "Does it invent details?",
        answer:
          "The prompt is designed to use only user-provided facts and avoid unsupported metrics or claims.",
      },
    ],
  },
  {
    slug: "can-ai-write-manager-updates-from-rough-notes",
    title: "Can AI Write Manager Updates from Rough Notes?",
    metaTitle: "Can AI Write Manager Updates from Rough Notes? | ManagerReady AI",
    description:
      "Yes, AI can turn rough notes into manager updates when the notes include progress, blockers, and next steps.",
    scenario: "manager_update",
    answer:
      "AI can write useful manager updates from rough notes if the notes include the facts a manager needs: completed work, impact, blockers, decisions needed, and next steps. The output is strongest when the AI is instructed not to invent unsupported details.",
    keyPoints: [
      "Rough bullets are usually enough.",
      "Blockers and decisions should be explicit.",
      "Numbers help when they are real.",
      "The final update should be reviewed before sending.",
    ],
    example: {
      before: "report export fixed, onboarding doc started, blocked by data access",
      after:
        "This week, I fixed report export and started the onboarding documentation. The main blocker is data access. Next week, I plan to continue the onboarding doc and move forward once data access is resolved.",
    },
    faqs: [
      {
        question: "What should I paste into the generator?",
        answer:
          "Paste rough bullets about completed work, blockers, risks, metrics, and next steps.",
      },
      {
        question: "Should I edit the result?",
        answer:
          "Yes. Treat the result as a strong draft and adjust names, dates, and sensitive details before sending.",
      },
    ],
  },
  {
    slug: "best-chatgpt-prompts-for-work-updates",
    title: "Best ChatGPT Prompts for Work Updates",
    metaTitle: "Best ChatGPT Prompts for Work Updates | ManagerReady AI",
    description:
      "Use prompt patterns for weekly updates, manager updates, client updates, and performance summaries.",
    scenario: "weekly_update",
    answer:
      "The best prompts for work updates specify the audience, format, tone, length, and factuality rules. A strong prompt asks the model to use only provided facts and separate accomplishments, blockers, and next steps.",
    keyPoints: [
      "Name the audience: manager, client, team, or reviewer.",
      "Specify the sections you want.",
      "Ask for professional but natural English.",
      "Tell the model not to invent metrics, owners, or completed work.",
    ],
    example: {
      before:
        "Prompt: Turn these rough notes into a concise manager update. Use only the facts provided. Include progress, blockers, and next steps. Notes: [paste notes].",
      after:
        "ManagerReady AI applies this structure automatically with scenario, tone, length, and refinement controls.",
    },
    faqs: [
      {
        question: "What is the most important prompt rule?",
        answer:
          "Ask the model to use only the facts provided and avoid unsupported claims.",
      },
      {
        question: "Why use ManagerReady AI instead of prompting manually?",
        answer:
          "It removes repeated prompt writing and gives a focused interface for common workplace update formats.",
      },
    ],
  },
  {
    slug: "how-non-native-speakers-can-write-clear-work-updates",
    title: "How Non-Native Speakers Can Write Clear Work Updates",
    metaTitle: "How Non-Native Speakers Can Write Clear Work Updates | ManagerReady AI",
    description:
      "A practical answer for non-native English professionals who need clearer weekly updates and manager summaries.",
    scenario: "weekly_update",
    answer:
      "Non-native English speakers can write clearer work updates by separating facts from wording. First list completed work, blockers, impact, and next steps in any language. Then turn those facts into short professional English sections.",
    keyPoints: [
      "Start with facts, not perfect sentences.",
      "Use repeated sections to reduce writing stress.",
      "Keep blockers direct and factual.",
      "Use AI to polish structure and tone after the facts are clear.",
    ],
    example: {
      before: "修了登录 bug, 和 ops 查数据问题, approval 卡住, 下周 dashboard QA",
      after:
        "This week, I fixed a login bug, investigated a data issue with the operations team, and prepared dashboard QA. The release is currently blocked by approval. Next week, I plan to complete dashboard QA and follow up on the approval process.",
    },
    faqs: [
      {
        question: "Do my notes need to be in English?",
        answer:
          "No. Mixed-language notes can work well if they include the key facts.",
      },
      {
        question: "How can I sound more professional?",
        answer:
          "Use specific outcomes, clear blockers, and next steps. Avoid vague claims that are not supported by your notes.",
      },
    ],
  },
];

export function getGrowthTemplatePage(slug: string) {
  return growthTemplatePages.find((page) => page.slug === slug);
}

export function getGrowthExamplePage(slug: string) {
  return growthExamplePages.find((page) => page.slug === slug);
}

export function getGrowthAnswerPage(slug: string) {
  return growthAnswerPages.find((page) => page.slug === slug);
}
