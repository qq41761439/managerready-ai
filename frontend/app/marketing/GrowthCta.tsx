"use client";

import Link from "next/link";
import { trackEvent, type AnalyticsEventName } from "../../lib/analytics";

type GrowthCtaProps = {
  href: string;
  label: string;
  eventName: Extract<
    AnalyticsEventName,
    "template_used" | "example_used" | "answer_cta_clicked" | "guide_cta_clicked"
  >;
  sourcePage: string;
  sourceSlug: string;
  scenario: string;
  variant?: "primary" | "secondary";
};

export function GrowthCta({
  href,
  label,
  eventName,
  sourcePage,
  sourceSlug,
  scenario,
  variant = "primary",
}: GrowthCtaProps) {
  return (
    <Link
      className={variant}
      href={href}
      onClick={() =>
        trackEvent(eventName, {
          source_page: sourcePage,
          source_slug: sourceSlug,
          scenario,
        })
      }
    >
      {label}
    </Link>
  );
}
