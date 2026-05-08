"use client";

import Link from "next/link";
import { trackEvent } from "../../lib/analytics";

type SeoCtaProps = {
  href: string;
  label: string;
  slug: string;
  scenario: string;
  variant?: "primary" | "secondary";
};

export function SeoCta({ href, label, slug, scenario, variant = "primary" }: SeoCtaProps) {
  return (
    <Link
      className={variant}
      href={href}
      onClick={() =>
        trackEvent("seo_cta_clicked", {
          slug,
          scenario,
        })
      }
    >
      {label}
    </Link>
  );
}
