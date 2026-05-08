import type { Metadata } from "next";
import Link from "next/link";
import { TemplateCopyButton } from "../marketing/TemplateCopyButton";
import { SITE_URL, updateTemplates } from "../../lib/marketing";

export const metadata: Metadata = {
  title: "Manager-Ready English Update Templates | ManagerReady AI",
  description:
    "Copy practical English templates for manager updates, client updates, standup summaries, and performance review summaries.",
  alternates: {
    canonical: `${SITE_URL}/templates`,
  },
  openGraph: {
    title: "Manager-Ready English Update Templates",
    description:
      "Copy practical English templates for manager updates, client updates, standup summaries, and performance review summaries.",
    url: `${SITE_URL}/templates`,
    siteName: "ManagerReady AI",
    type: "website",
  },
};

export default function TemplatesPage() {
  return (
    <main className="page">
      <nav className="nav">
        <Link className="logo" href="/">
          <span className="logo-mark">M</span>
          <span>ManagerReady AI</span>
        </Link>
        <div className="nav-links">
          <Link href="/use-cases">Use cases</Link>
          <Link href="/">Generator</Link>
        </div>
      </nav>

      <section className="seo-hero">
        <div>
          <span className="badge">Template pack</span>
          <h1>Manager-ready English update templates.</h1>
          <p className="lead">
            Copy a reusable structure for weekly reports, manager updates, client emails, standups,
            and performance summaries.
          </p>
          <div className="actions">
            <Link className="primary" href="/?utm_source=templates&utm_campaign=template-pack">
              Open generator
            </Link>
          </div>
        </div>
        <div className="seo-panel">
          <h2>How to use these</h2>
          <p>
            Replace bracketed placeholders with your own work details, then paste the draft into the
            generator to polish tone, length, and clarity.
          </p>
        </div>
      </section>

      <section className="section template-grid">
        {updateTemplates.map((template) => (
          <article className="template-card" key={template.title}>
            <div>
              <span className="badge">{template.title}</span>
              <p>{template.template}</p>
            </div>
            <div className="actions">
              <TemplateCopyButton title={template.title} template={template.template} />
              <Link
                className="secondary"
                href={`/?scenario=${template.scenario}&utm_source=templates&utm_campaign=${template.scenario}`}
              >
                Use in generator
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
