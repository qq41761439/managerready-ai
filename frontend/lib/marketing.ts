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
  {
    slug: "weekly-update-generator-for-engineers",
    scenario: "engineering_update",
    title: "Weekly Update Generator for Engineers",
    metaTitle: "Weekly Update Generator for Engineers | ManagerReady AI",
    description:
      "Write clear engineering weekly updates from commits, incidents, PRs, blockers, and next-week technical plans.",
    audience: "software engineers who need to report progress in English",
    pain: "Engineering work is easy to describe in tickets, but hard to summarize for managers who need impact and risk.",
    before:
      "merged auth cleanup, fixed flaky checkout test, investigated Redis timeout, waiting infra review",
    after:
      "This week, I merged the authentication cleanup, fixed a flaky checkout test, and investigated Redis timeout issues. The main dependency is an infrastructure review. Next week, I plan to complete the review follow-up and monitor checkout test stability.",
    useCases: [
      "Engineering manager updates",
      "Sprint-end summaries",
      "Async team reports",
      "Release and blocker communication",
    ],
    faqs: [
      {
        question: "Can engineers paste ticket-style notes?",
        answer:
          "Yes. Short ticket notes, commit summaries, and blocker bullets work well as input.",
      },
      {
        question: "Will it make engineering updates less technical?",
        answer:
          "It keeps necessary technical detail but frames it around progress, impact, blockers, and next steps.",
      },
    ],
  },
  {
    slug: "weekly-update-generator-for-product-managers",
    scenario: "product_update",
    title: "Weekly Update Generator for Product Managers",
    metaTitle: "Weekly Update Generator for Product Managers | ManagerReady AI",
    description:
      "Turn product discovery notes, launch work, stakeholder updates, and risks into polished English weekly updates.",
    audience: "product managers working with cross-functional or remote teams",
    pain: "Product updates must connect decisions, user feedback, launch risks, and next steps without becoming too long.",
    before:
      "interviewed 5 beta users, pricing page copy drafted, dashboard scope still under discussion, next week align launch checklist",
    after:
      "This week, I interviewed five beta users, drafted pricing page copy, and continued dashboard scope discussions. The key risk is that dashboard scope is not yet finalized. Next week, I plan to align the launch checklist and confirm open scope decisions.",
    useCases: [
      "Product weekly updates",
      "Stakeholder summaries",
      "Launch readiness notes",
      "User research recap updates",
    ],
    faqs: [
      {
        question: "Can it summarize product discovery work?",
        answer:
          "Yes. Include interviews, insights, decisions, open questions, and planned follow-ups.",
      },
      {
        question: "Can it handle stakeholder language?",
        answer:
          "Yes. Product Update is written to be clear for engineering, design, business, and leadership audiences.",
      },
    ],
  },
  {
    slug: "freelancer-client-update-generator",
    scenario: "client_update",
    title: "Freelancer Client Update Generator",
    metaTitle: "Freelancer Client Update Generator | ManagerReady AI",
    description:
      "Create professional English client updates for freelance projects, milestones, blockers, and delivery plans.",
    audience: "freelancers who communicate with English-speaking clients",
    pain: "Freelance client updates need to build trust, show progress, and communicate delays without sounding defensive.",
    before:
      "landing page almost done, Stripe issue fixed, waiting client images, can review staging tomorrow",
    after:
      "The landing page is nearly complete, and the Stripe issue has been fixed. We are waiting on the final client images before the staging review. If the assets are confirmed today, staging can be reviewed tomorrow.",
    useCases: [
      "Weekly client emails",
      "Milestone progress notes",
      "Delay and blocker updates",
      "Freelance delivery reports",
    ],
    faqs: [
      {
        question: "Can it make my update sound more professional?",
        answer:
          "Yes. It turns rough delivery notes into clear, confident, client-appropriate English.",
      },
      {
        question: "Does it work for agencies too?",
        answer:
          "Yes. The same format works for freelancers, agencies, and small delivery teams.",
      },
    ],
  },
  {
    slug: "non-native-english-work-update-generator",
    scenario: "manager_update",
    title: "Non-Native English Work Update Generator",
    metaTitle: "Non-Native English Work Update Generator | ManagerReady AI",
    description:
      "Convert mixed-language work notes into natural, manager-ready English updates for non-native professionals.",
    audience: "non-native English speakers working in global teams",
    pain: "You may know exactly what you did, but still spend too long making the English sound natural and professional.",
    before:
      "修了登录 bug, checked data issue with ops, release blocked by approval, next week finish dashboard QA",
    after:
      "This week, I fixed a login bug, investigated a data issue with the operations team, and prepared dashboard QA. The release is currently blocked by approval. Next week, I plan to complete dashboard QA and follow up on the approval process.",
    useCases: [
      "Mixed Chinese and English notes",
      "Global team status updates",
      "Manager-ready English summaries",
      "Professional writing support",
    ],
    faqs: [
      {
        question: "Can I paste multilingual notes?",
        answer:
          "Yes. ManagerReady AI is designed for rough multilingual work notes and outputs polished English.",
      },
      {
        question: "Is this a grammar checker?",
        answer:
          "No. It restructures your work update, highlights progress and blockers, and makes the result manager-ready.",
      },
    ],
  },
  {
    slug: "remote-work-status-update-generator",
    scenario: "weekly_update",
    title: "Remote Work Status Update Generator",
    metaTitle: "Remote Work Status Update Generator | ManagerReady AI",
    description:
      "Write concise async status updates for remote teams, distributed managers, and cross-time-zone collaboration.",
    audience: "remote workers who rely on async written updates",
    pain: "Remote updates need enough context to replace a meeting, but not so much detail that people stop reading.",
    before:
      "finished onboarding doc, timezone issue with vendor, waiting QA result, tomorrow update release checklist",
    after:
      "I finished the onboarding documentation and identified a timezone coordination issue with the vendor. The release is waiting on QA results. Tomorrow, I will update the release checklist and follow up on the vendor timing issue.",
    useCases: [
      "Async daily updates",
      "Remote weekly summaries",
      "Cross-time-zone handoffs",
      "Distributed team progress notes",
    ],
    faqs: [
      {
        question: "What makes a good remote status update?",
        answer:
          "It should state progress, blockers, decisions needed, and next actions clearly enough for teammates in other time zones.",
      },
      {
        question: "Can it replace a standup note?",
        answer:
          "Yes. Use the Standup Summary or Weekly Update format depending on how much detail you need.",
      },
    ],
  },
  {
    slug: "status-update-email-generator",
    scenario: "manager_update",
    title: "Status Update Email Generator",
    metaTitle: "Status Update Email Generator | ManagerReady AI",
    description:
      "Draft professional English status update emails from rough work notes, blockers, and next steps.",
    audience: "professionals who need to send clear progress emails",
    pain: "Status emails need a polished structure, clear priorities, and the right tone for managers or stakeholders.",
    before:
      "data migration done, docs not done, legal review pending, next step coordinate release date",
    after:
      "The data migration is complete. Documentation is still in progress, and legal review remains pending. The next step is to coordinate the release date once the review status is confirmed.",
    useCases: [
      "Manager status emails",
      "Stakeholder progress emails",
      "Project follow-up notes",
      "Launch readiness updates",
    ],
    faqs: [
      {
        question: "Can I use the output as an email?",
        answer:
          "Yes. You can copy the result into email or chat, then adjust greeting and sign-off as needed.",
      },
      {
        question: "Can it make updates more concise?",
        answer:
          "Yes. Choose Concise or use the Make it shorter refine action after generating.",
      },
    ],
  },
  {
    slug: "project-status-update-generator",
    scenario: "client_update",
    title: "Project Status Update Generator",
    metaTitle: "Project Status Update Generator | ManagerReady AI",
    description:
      "Summarize project progress, milestones, risks, blockers, and next steps in clear professional English.",
    audience: "project owners, operators, consultants, and delivery teams",
    pain: "Project status updates must be specific enough to be useful and structured enough to be read quickly.",
    before:
      "phase 1 complete, vendor API unstable, finance approval pending, next week confirm rollout plan",
    after:
      "Phase 1 is complete. The main risk is vendor API instability, and finance approval is still pending. Next week, the priority is to confirm the rollout plan and align dependencies before moving forward.",
    useCases: [
      "Project milestone reports",
      "Risk and blocker summaries",
      "Stakeholder status notes",
      "Delivery planning updates",
    ],
    faqs: [
      {
        question: "What should a project status update include?",
        answer:
          "Include progress, milestones, blockers, risks, decisions needed, and next steps.",
      },
      {
        question: "Can it handle incomplete project notes?",
        answer:
          "Yes. It organizes what you provide and avoids inventing missing metrics or decisions.",
      },
    ],
  },
  {
    slug: "work-summary-generator",
    scenario: "weekly_update",
    title: "Work Summary Generator",
    metaTitle: "Work Summary Generator | ManagerReady AI",
    description:
      "Turn rough task notes into a clear English work summary for managers, teams, clients, or performance reviews.",
    audience: "professionals who need to summarize their work clearly",
    pain: "Daily tasks often look small in isolation, but a good work summary shows progress, impact, and priorities.",
    before:
      "answered support questions, fixed report export, helped new teammate, started dashboard QA checklist",
    after:
      "This week, I supported customer questions, fixed report export, helped onboard a new teammate, and started the dashboard QA checklist. These efforts improved support responsiveness and prepared the team for the next dashboard review.",
    useCases: [
      "Weekly work summaries",
      "Self-review notes",
      "Team update drafts",
      "Manager-ready progress reports",
    ],
    faqs: [
      {
        question: "Can it turn small tasks into a better summary?",
        answer:
          "Yes. It groups related tasks and explains them in terms of outcomes, blockers, and next steps.",
      },
      {
        question: "Can I use it for self-reviews?",
        answer:
          "Yes. For review season, try the Promotion Summary or Performance Review Summary page.",
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
