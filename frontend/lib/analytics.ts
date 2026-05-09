import posthog from "posthog-js";
import type { Properties } from "posthog-js";

export type AnalyticsEventName =
  | "page_view"
  | "try_sample_clicked"
  | "generate_clicked"
  | "generate_success"
  | "generate_failed"
  | "refine_clicked"
  | "refine_success"
  | "refine_failed"
  | "copy_clicked"
  | "seo_cta_clicked"
  | "template_copied"
  | "template_used"
  | "example_used"
  | "answer_cta_clicked"
  | "guide_cta_clicked"
  | "quota_reached"
  | "generator_prefilled_from_url";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

let initialized = false;

function hasBrowserWindow() {
  return typeof window !== "undefined";
}

export function isAnalyticsEnabled() {
  return Boolean(POSTHOG_KEY);
}

export function initAnalytics() {
  if (!hasBrowserWindow() || !POSTHOG_KEY || initialized) {
    return false;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    autocapture: false,
    person_profiles: "identified_only",
    loaded: (client) => {
      client.register({ app: "managerready-ai" });
    },
  });
  initialized = true;
  return true;
}

export function identifyAnonymousUser(anonymousId: string) {
  if (!hasBrowserWindow() || !POSTHOG_KEY || !anonymousId) {
    return;
  }

  initAnalytics();
  posthog.identify(anonymousId);
}

export function trackEvent(eventName: AnalyticsEventName, properties?: Properties) {
  if (!hasBrowserWindow() || !POSTHOG_KEY) {
    return;
  }

  initAnalytics();
  posthog.capture(eventName, properties);
}
