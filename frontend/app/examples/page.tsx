import type { Metadata } from "next";
import Link from "next/link";
import { workExamples } from "../../lib/geo";
import { SITE_URL } from "../../lib/marketing";

export const metadata: Metadata = {
  title: "Manager-Ready Update Examples | ManagerReady AI",
  description:
    "Browse before-and-after examples that turn rough multilingual work notes into polished English manager updates, client updates, and weekly reports.",
  alternates: {
    canonical: `${SITE_URL}/examples`,
  },
  openGraph: {
    title: "Manager-Ready Update Examples",
    description:
      "Browse before-and-after examples that turn rough multilingual work notes into polished English manager updates, client updates, and weekly reports.",
    url: `${SITE_URL}/examples`,
    siteName: "ManagerReady AI",
    type: "website",
  },
};

export default function ExamplesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Manager-Ready Update Examples",
    description:
      "Before-and-after examples of rough work notes converted into manager-ready English updates.",
    url: `${SITE_URL}/examples`,
    hasPart: workExamples.map((example) => ({
      "@type": "CreativeWork",
      name: example.title,
      text: `${example.before}\n\n${example.after}`,
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
          <Link href="/templates">Templates</Link>
          <Link href="/">Generator</Link>
        </div>
      </nav>

      <section className="seo-hero">
        <div>
          <span className="badge">Examples</span>
          <h1>Before-and-after examples for English work updates.</h1>
          <p className="lead">
            See how rough task notes, blockers, and mixed-language bullets become clear manager-ready
            English updates.
          </p>
          <div className="actions">
            <Link className="primary" href="/?utm_source=examples&utm_campaign=examples-page">
              Try with your notes
            </Link>
            <Link className="secondary" href="/guides/how-to-write-a-manager-update">
              Read the guide
            </Link>
          </div>
        </div>
        <div className="seo-panel">
          <h2>Good examples are reusable</h2>
          <p>
            Copy the structure, replace the details, and use the generator to adjust tone, length,
            and clarity.
          </p>
        </div>
      </section>

      <section className="section example-list">
        {workExamples.map((example) => (
          <article className="example-card" key={example.title}>
            <div className="section-head">
              <span className="badge">{example.title}</span>
              <h2>{example.title}</h2>
            </div>
            <div className="example seo-example">
              <div className="example-box">
                <h3>Rough notes</h3>
                <p>{example.before}</p>
              </div>
              <div className="example-box">
                <h3>Manager-ready update</h3>
                <p>{example.after}</p>
              </div>
            </div>
            <div className="actions">
              <Link
                className="secondary"
                href={`/?scenario=${example.scenario}&utm_source=examples&utm_campaign=${example.scenario}`}
              >
                Use this format
              </Link>
            </div>
          </article>
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
