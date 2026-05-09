import type { Metadata } from "next";
import Link from "next/link";
import { growthAnswerPages } from "../../lib/growth";
import { SITE_URL } from "../../lib/marketing";

export const metadata: Metadata = {
  title: "Answers About AI Work Updates | ManagerReady AI",
  description:
    "Clear answers about AI weekly updates, manager updates, ChatGPT prompts, and writing better English work summaries.",
  alternates: {
    canonical: `${SITE_URL}/answers`,
  },
  openGraph: {
    title: "Answers About AI Work Updates",
    description:
      "Clear answers about AI weekly updates, manager updates, ChatGPT prompts, and writing better English work summaries.",
    url: `${SITE_URL}/answers`,
    siteName: "ManagerReady AI",
    type: "website",
  },
};

export default function AnswersIndexPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Answers About AI Work Updates",
    description:
      "Answer pages for AI weekly updates, manager updates, ChatGPT prompts, and English workplace writing.",
    url: `${SITE_URL}/answers`,
    hasPart: growthAnswerPages.map((page) => ({
      "@type": "QAPage",
      name: page.title,
      url: `${SITE_URL}/answers/${page.slug}`,
    })),
  };

  return (
    <main className="page">
      <nav className="nav">
        <Link className="logo" href="/">
          <span className="logo-mark">M</span>
          <span>ManagerReady AI</span>
        </Link>
        <div className="nav-links">
          <Link href="/use-cases">Use cases</Link>
          <Link href="/examples">Examples</Link>
          <Link href="/templates">Templates</Link>
          <Link href="/answers">Answers</Link>
          <Link href="/">Generator</Link>
        </div>
      </nav>

      <section className="seo-hero">
        <div>
          <span className="badge">Answers</span>
          <h1>Clear answers about AI work updates.</h1>
          <p className="lead">
            Short, direct pages for people and AI search systems looking for weekly update,
            manager update, and workplace writing guidance.
          </p>
          <div className="actions">
            <Link className="primary" href="/?utm_source=answers&utm_campaign=answers-index">
              Try the generator
            </Link>
          </div>
        </div>
        <div className="seo-panel">
          <h2>Built for GEO</h2>
          <p>
            These pages explain what ManagerReady AI does, who it helps, and how it compares with
            general AI assistants for recurring workplace writing tasks.
          </p>
        </div>
      </section>

      <section className="section use-case-grid">
        {growthAnswerPages.map((page) => (
          <Link className="use-case-card" href={`/answers/${page.slug}`} key={page.slug}>
            <span className="badge">Answer</span>
            <h2>{page.title}</h2>
            <p>{page.description}</p>
          </Link>
        ))}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </main>
  );
}
