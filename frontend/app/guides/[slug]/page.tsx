import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuidePage, guidePages } from "../../../lib/geo";
import { SITE_URL } from "../../../lib/marketing";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return guidePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getGuidePage(slug);

  if (!page) {
    return {};
  }

  const url = `${SITE_URL}/guides/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.description,
      url,
      siteName: "ManagerReady AI",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.description,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const page = getGuidePage(slug);

  if (!page) {
    notFound();
  }

  const guideUrl = `${SITE_URL}/guides/${page.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: page.title,
      description: page.description,
      url: guideUrl,
      step: page.steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        text: step,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

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
          <Link href="/">Generator</Link>
        </div>
      </nav>

      <article>
        <section className="seo-hero">
          <div>
            <span className="badge">Guide</span>
            <h1>{page.title}</h1>
            <p className="lead">{page.intro}</p>
            <div className="actions">
              <Link className="primary" href="/?utm_source=guide&utm_campaign=work-update-guide">
                Try the generator
              </Link>
              <Link className="secondary" href="/examples">
                View examples
              </Link>
            </div>
          </div>
          <div className="seo-panel">
            <h2>Quick answer</h2>
            <p>{page.description}</p>
          </div>
        </section>

        <section className="section seo-grid">
          <div>
            <span className="badge">Structure</span>
            <h2>What to include</h2>
            <ol className="numbered-list">
              {page.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="seo-panel">
            <h2>Use ManagerReady AI when</h2>
            <ul className="bullets">
              <li>Your notes are messy or multilingual.</li>
              <li>You need a manager-ready English draft quickly.</li>
              <li>You want consistent sections and tone.</li>
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <span className="badge">Example</span>
            <h2>Before and after</h2>
          </div>
          <div className="example seo-example">
            <div className="example-box">
              <h3>Rough notes</h3>
              <p>{page.example.before}</p>
            </div>
            <div className="example-box">
              <h3>Polished update</h3>
              <p>{page.example.after}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <span className="badge">FAQ</span>
            <h2>Common questions</h2>
          </div>
          <div className="faq-list">
            {page.faqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </main>
  );
}
