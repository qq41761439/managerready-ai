import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GrowthCta } from "../../marketing/GrowthCta";
import { TemplateCopyButton } from "../../marketing/TemplateCopyButton";
import { getGrowthTemplatePage, growthTemplatePages } from "../../../lib/growth";
import { SITE_URL } from "../../../lib/marketing";

type TemplateDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return growthTemplatePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: TemplateDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getGrowthTemplatePage(slug);

  if (!page) {
    return {};
  }

  const url = `${SITE_URL}/templates/${page.slug}`;
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

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { slug } = await params;
  const page = getGrowthTemplatePage(slug);

  if (!page) {
    notFound();
  }

  const generatorHref = `/?scenario=${page.scenario}&utm_source=template&utm_campaign=${page.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.title,
    description: page.description,
    url: `${SITE_URL}/templates/${page.slug}`,
    step: page.tips.map((tip, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: tip,
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
          <span className="badge">Template for {page.audience}</span>
          <h1>{page.title}</h1>
          <p className="lead">{page.description}</p>
          <div className="actions">
            <TemplateCopyButton
              title={page.title}
              template={page.template}
              sourcePage="template-detail"
              sourceSlug={page.slug}
            />
            <GrowthCta
              href={generatorHref}
              label="Use in generator"
              eventName="template_used"
              sourcePage="template-detail"
              sourceSlug={page.slug}
              scenario={page.scenario}
            />
          </div>
        </div>
        <div className="seo-panel">
          <h2>Template</h2>
          <p>{page.template}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="badge">Before and after</span>
          <h2>How this template becomes a polished update</h2>
        </div>
        <div className="example seo-example">
          <div className="example-box">
            <h3>Rough notes</h3>
            <p>{page.exampleInput}</p>
          </div>
          <div className="example-box">
            <h3>Manager-ready update</h3>
            <p>{page.exampleOutput}</p>
          </div>
        </div>
      </section>

      <section className="section seo-grid">
        <div>
          <span className="badge">Tips</span>
          <h2>How to use this template well</h2>
          <ol className="numbered-list">
            {page.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ol>
        </div>
        <div className="seo-panel">
          <h2>Make it faster</h2>
          <p>
            Paste rough notes into ManagerReady AI and choose the matching scenario. The generator
            will structure the update, polish the English, and keep blockers visible.
          </p>
        </div>
      </section>

      <section className="section final-cta">
        <h2>Use this template with your own notes</h2>
        <p>Start from rough bullets, then refine the result for tone, length, and clarity.</p>
        <GrowthCta
          href={generatorHref}
          label="Generate with this format"
          eventName="template_used"
          sourcePage="template-detail-final"
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
