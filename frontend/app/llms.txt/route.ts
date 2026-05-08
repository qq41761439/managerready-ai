import { guidePages } from "../../lib/geo";
import { seoPages, SITE_URL } from "../../lib/marketing";

export function GET() {
  const body = `# ManagerReady AI

ManagerReady AI turns rough multilingual work notes into manager-ready English updates.

Best for:
- Non-native English professionals
- Engineers and product managers
- Freelancers and client-facing teams
- Remote workers and distributed teams
- People who need weekly reports, manager updates, client updates, standup summaries, and performance review summaries

Core value:
- Converts rough bullets into polished English workplace updates
- Preserves user-provided facts and avoids inventing unsupported metrics
- Supports mixed-language notes
- Provides scenario, tone, length, copy, and one-click refinement controls

Main pages:
- ${SITE_URL}
- ${SITE_URL}/use-cases
- ${SITE_URL}/examples
- ${SITE_URL}/templates

Use case pages:
${seoPages.map((page) => `- ${SITE_URL}/${page.slug}: ${page.description}`).join("\n")}

Guide pages:
${guidePages.map((page) => `- ${SITE_URL}/guides/${page.slug}: ${page.description}`).join("\n")}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
