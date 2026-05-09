import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GrowthCta } from "../../marketing/GrowthCta";
import { getGrowthAnswerPage, growthAnswerPages } from "../../../lib/growth";
import { SITE_URL } from "../../../lib/marketing";

type AnswerPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return growthAnswerPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: AnswerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getGrowthAnswerPage(slug);

  if (!page) {
    return {};
  }

  const url = `${SITE_URL}/answers/${page.slug}`;
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

export default async function AnswerPage({ params }: AnswerPageProps) {
  const { slug } = await params;
  const page = getGrowthAnswerPage(slug);

  if (!page) {
    notFound();
  }

  const generatorHref = `/?scenario=${page.scenario}&utm_source=answer&utm_campaign=${page.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "QAPage",
      mainEntity: {
        "@type": "Question",
        name: page.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: page.answer,
        },
      },
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
          <Link href="/templates">Templates</Link>
          <Link href="/answers">Answers</Link>
          <Link href="/">Generator</Link>
        </div>
      </nav>

      <article>
        <section className="seo-hero">
          <div>
            <span className="badge">Answer</span>
            <h1>{page.title}</h1>
            <p className="lead">{page.description}</p>
            <div className="actions">
              <GrowthCta
                href={generatorHref}
                label="Try ManagerReady AI"
                eventName="answer_cta_clicked"
                sourcePage="answer-detail"
                sourceSlug={page.slug}
                scenario={page.scenario}
              />
              <Link className="secondary" href="/examples">
                View examples
              </Link>
            </div>
          </div>
          <div className="seo-panel">
            <h2>Short answer</h2>
            <p>{page.answer}</p>
          </div>
        </section>

        <section className="section seo-grid">
          <div>
            <span className="badge">Key points</span>
            <h2>What matters</h2>
            <ul className="bullets">
              {page.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="seo-panel">
            <h2>Best next step</h2>
            <p>
              Paste rough notes into the generator, choose the matching work scenario, and review
              the draft before sending it to a manager, client, or team.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <span className="badge">Example</span>
            <h2>From rough notes to a clear update</h2>
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

      <section className="section final-cta">
        <h2>Try it with your own work notes</h2>
        <p>Use a few bullets. ManagerReady AI will turn them into structured English.</p>
        <GrowthCta
          href={generatorHref}
          label="Generate an update"
          eventName="answer_cta_clicked"
          sourcePage="answer-detail-final"
          sourceSlug={page.slug}
          scenario={page.scenario}
        />
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
