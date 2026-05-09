import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGrowthExamplePage, growthExamplePages } from "../../../lib/growth";
import { SITE_URL } from "../../../lib/marketing";

type ExampleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return growthExamplePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: ExampleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getGrowthExamplePage(slug);

  if (!page) {
    return {};
  }

  const url = `${SITE_URL}/examples/${page.slug}`;
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

export default async function ExampleDetailPage({ params }: ExampleDetailPageProps) {
  const { slug } = await params;
  const page = getGrowthExamplePage(slug);

  if (!page) {
    notFound();
  }

  const generatorHref = `/?scenario=${page.scenario}&utm_source=example&utm_campaign=${page.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.title,
    description: page.description,
    url: `${SITE_URL}/examples/${page.slug}`,
    hasPart: page.examples.map((example) => ({
      "@type": "CreativeWork",
      name: example.label,
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
          <Link href="/examples">Examples</Link>
          <Link href="/answers">Answers</Link>
          <Link href="/">Generator</Link>
        </div>
      </nav>

      <section className="seo-hero">
        <div>
          <span className="badge">Examples for {page.audience}</span>
          <h1>{page.title}</h1>
          <p className="lead">{page.description}</p>
          <div className="actions">
            <Link className="primary" href={generatorHref}>
              Try this format
            </Link>
            <Link className="secondary" href="/templates">
              View templates
            </Link>
          </div>
        </div>
        <div className="seo-panel">
          <h2>What to copy</h2>
          <p>
            Use the structure: clear progress, visible blockers, and next steps. Replace the details
            with your own work notes before sending.
          </p>
        </div>
      </section>

      <section className="section example-list">
        {page.examples.map((example) => (
          <article className="example-card" key={example.label}>
            <div className="section-head">
              <span className="badge">{example.label}</span>
              <h2>{example.label}</h2>
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
          </article>
        ))}
      </section>

      <section className="section final-cta">
        <h2>Turn your own rough notes into this style</h2>
        <p>Choose the matching scenario and let ManagerReady AI polish the structure and English.</p>
        <Link className="primary" href={generatorHref}>
          Use this example style
        </Link>
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
