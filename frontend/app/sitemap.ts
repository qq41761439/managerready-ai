import type { MetadataRoute } from "next";
import { guidePages } from "../lib/geo";
import { growthAnswerPages, growthExamplePages, growthTemplatePages } from "../lib/growth";
import { seoPages, SITE_URL } from "../lib/marketing";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/use-cases", "/examples", "/templates", "/answers", "/llms.txt"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...seoPages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...guidePages.map((page) => ({
      url: `${SITE_URL}/guides/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...growthTemplatePages.map((page) => ({
      url: `${SITE_URL}/templates/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
    ...growthExamplePages.map((page) => ({
      url: `${SITE_URL}/examples/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
    ...growthAnswerPages.map((page) => ({
      url: `${SITE_URL}/answers/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
