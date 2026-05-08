import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoCta } from "../marketing/SeoCta";
import { getSeoPage, seoPages, SITE_URL } from "../../lib/marketing";

type SeoGeneratorPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: SeoGeneratorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page) {
    return {};
  }

  const url = `${SITE_URL}/${page.slug}`;
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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.description,
    },
  };
}

export default async function SeoGeneratorPage({ params }: SeoGeneratorPageProps) {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page) {
    notFound();
  }

  const generatorHref = `/?scenario=${page.scenario}&utm_source=seo&utm_campaign=${page.slug}`;
  const faqSchema = {
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
          <span className="badge">For {page.audience}</span>
          <h1>{page.title}</h1>
          <p className="lead">{page.description}</p>
          <div className="actions">
            <SeoCta href={generatorHref} label="Try the generator" slug={page.slug} scenario={page.scenario} />
            <SeoCta
              href="/templates"
              label="View templates"
              slug={page.slug}
              scenario={page.scenario}
              variant="secondary"
            />
          </div>
        </div>
        <div className="seo-panel">
          <h2>Why this helps</h2>
          <p>{page.pain}</p>
          <ul className="bullets">
            {page.useCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="badge">Before and after</span>
          <h2>From rough notes to manager-ready English</h2>
        </div>
        <div className="example seo-example">
          <div className="example-box">
            <h3>Before</h3>
            <p>{page.before}</p>
          </div>
          <div className="example-box">
            <h3>After</h3>
            <p>{page.after}</p>
          </div>
        </div>
      </section>

      <section className="section seo-grid">
        <div>
          <span className="badge">How to use it</span>
          <h2>Paste notes, choose a format, copy the result</h2>
          <p className="lead compact">
            Use short bullets, mixed Chinese and English, rough blockers, or incomplete next steps. The
            generator organizes them into a polished update without inventing unsupported details.
          </p>
        </div>
        <div className="seo-panel">
          <h2>Best input format</h2>
          <ul className="bullets">
            <li>Completed work</li>
            <li>Metrics or impact, if available</li>
            <li>Blockers or risks</li>
            <li>Next steps and decisions needed</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="badge">FAQ</span>
          <h2>Common questions</h2>
        </div>
        <div className="faq-list">
          {page.faqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section final-cta">
        <h2>Try it with your own rough notes</h2>
        <p>Start with a few bullets. Add metrics, blockers, and next steps if you have them.</p>
        <SeoCta href={generatorHref} label="Generate an update" slug={page.slug} scenario={page.scenario} />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </main>
  );
}
