import type { Metadata } from "next";
import Link from "next/link";
import { seoPages, SITE_URL } from "../../lib/marketing";

export const metadata: Metadata = {
  title: "Use Cases | ManagerReady AI",
  description:
    "Explore generators for manager updates, weekly reports, client updates, engineering summaries, remote work updates, and performance reviews.",
  alternates: {
    canonical: `${SITE_URL}/use-cases`,
  },
  openGraph: {
    title: "ManagerReady AI Use Cases",
    description:
      "Explore generators for manager updates, weekly reports, client updates, engineering summaries, remote work updates, and performance reviews.",
    url: `${SITE_URL}/use-cases`,
    siteName: "ManagerReady AI",
    type: "website",
  },
};

export default function UseCasesPage() {
  return (
    <main className="page">
      <nav className="nav">
        <Link className="logo" href="/">
          <span className="logo-mark">M</span>
          <span>ManagerReady AI</span>
        </Link>
        <div className="nav-links">
          <Link href="/examples">Examples</Link>
          <Link href="/templates">Templates</Link>
          <Link href="/answers">Answers</Link>
          <Link href="/">Generator</Link>
        </div>
      </nav>

      <section className="seo-hero">
        <div>
          <span className="badge">Use cases</span>
          <h1>English work update generators for real workplace moments.</h1>
          <p className="lead">
            Choose a format for manager updates, engineering reports, client emails, remote work
            check-ins, project status notes, or performance review summaries.
          </p>
          <div className="actions">
            <Link className="primary" href="/?utm_source=use-cases&utm_campaign=index">
              Open generator
            </Link>
            <Link className="secondary" href="/templates">
              View templates
            </Link>
          </div>
        </div>
        <div className="seo-panel">
          <h2>Built for non-native English professionals</h2>
          <p>
            Paste rough bullets, mixed-language notes, blockers, and next steps. ManagerReady AI
            turns them into clear English updates that are easier for managers, clients, and teams
            to read.
          </p>
        </div>
      </section>

      <section className="section use-case-grid">
        {seoPages.map((page) => (
          <Link className="use-case-card" href={`/${page.slug}`} key={page.slug}>
            <span className="badge">{page.title}</span>
            <h2>{page.title}</h2>
            <p>{page.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
