"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { checkUsage, generateReport, refineReport, type GenerateResponse, type UsageStatus } from "../lib/api";
import { identifyAnonymousUser, initAnalytics, trackEvent } from "../lib/analytics";
import { SITE_URL } from "../lib/marketing";

const SAMPLE_NOTES = `- Fixed checkout bug and improved payment error handling
- 跟设计师确认了 dashboard 改版方向
- Analytics release is almost ready, waiting for API review
- Next week: ship analytics, validate dashboard UX, unblock API issue`;

const scenarios = [
  ["weekly_update", "Weekly Update"],
  ["manager_update", "Manager Update"],
  ["client_update", "Client Update"],
  ["engineering_update", "Engineering Update"],
  ["product_update", "Product Update"],
  ["standup_summary", "Standup Summary"],
  ["promotion_summary", "Promotion Summary"],
];

const tones = [
  ["formal", "Formal"],
  ["semi_formal", "Semi-formal"],
  ["data_driven", "Data-driven"],
];

const lengths = [
  ["concise", "Concise"],
  ["standard", "Standard"],
  ["detailed", "Detailed"],
];

const refineActions = [
  ["make_more_formal", "Make it more formal"],
  ["make_shorter", "Make it shorter"],
  ["make_more_data_driven", "Make it data-driven"],
  ["improve_clarity", "Improve clarity"],
];

function hasOption(options: string[][], value: string | null) {
  return Boolean(value && options.some(([optionValue]) => optionValue === value));
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [scenario, setScenario] = useState("manager_update");
  const [tone, setTone] = useState("formal");
  const [length, setLength] = useState("standard");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [anonymousId, setAnonymousId] = useState("local-anonymous");
  const [usageStatus, setUsageStatus] = useState<UsageStatus | null>(null);
  const [isUsageLoading, setIsUsageLoading] = useState(true);
  const hasTrackedPageView = useRef(false);
  const hasTrackedQuotaReached = useRef(false);
  const sourceAttributionRef = useRef<Record<string, string | null>>({});

  useEffect(() => {
    const key = "managerready_anonymous_id";
    const existing = window.localStorage.getItem(key);
    const resolvedAnonymousId = existing ?? crypto.randomUUID();
    const params = new URLSearchParams(window.location.search);
    const scenarioParam = params.get("scenario");
    const toneParam = params.get("tone");
    const lengthParam = params.get("length");
    sourceAttributionRef.current = {
      utm_source: params.get("utm_source"),
      utm_campaign: params.get("utm_campaign"),
      source_page: params.get("utm_source"),
      source_slug: params.get("utm_campaign"),
      referrer: document.referrer || null,
    };

    if (!existing) {
      window.localStorage.setItem(key, resolvedAnonymousId);
    }

    if (hasOption(scenarios, scenarioParam)) {
      setScenario(scenarioParam as string);
    }
    if (hasOption(tones, toneParam)) {
      setTone(toneParam as string);
    }
    if (hasOption(lengths, lengthParam)) {
      setLength(lengthParam as string);
    }

    setAnonymousId(resolvedAnonymousId);
    checkUsage(resolvedAnonymousId)
      .then(setUsageStatus)
      .catch(() => setUsageStatus(null))
      .finally(() => setIsUsageLoading(false));
    initAnalytics();
    identifyAnonymousUser(resolvedAnonymousId);

    if (!hasTrackedPageView.current) {
      trackEvent("page_view", {
        path: window.location.pathname,
        search: window.location.search,
        ...sourceAttributionRef.current,
      });
      hasTrackedPageView.current = true;
    }

    if (scenarioParam || toneParam || lengthParam || params.get("utm_source")) {
      trackEvent("generator_prefilled_from_url", {
        scenario: hasOption(scenarios, scenarioParam) ? scenarioParam : undefined,
        tone: hasOption(tones, toneParam) ? toneParam : undefined,
        length: hasOption(lengths, lengthParam) ? lengthParam : undefined,
        ...sourceAttributionRef.current,
      });
    }
  }, []);

  useEffect(() => {
    if (usageStatus?.allowed === false && !hasTrackedQuotaReached.current) {
      trackEvent("quota_reached", {
        used: usageStatus.used,
        limit: usageStatus.limit,
        remaining: usageStatus.remaining,
        ...sourceAttributionRef.current,
      });
      hasTrackedQuotaReached.current = true;
    }
  }, [usageStatus]);

  const canSubmit = useMemo(
    () =>
      inputText.trim().length > 0 &&
      !isLoading &&
      !isUsageLoading &&
      usageStatus?.allowed !== false,
    [inputText, isLoading, isUsageLoading, usageStatus],
  );

  const usageLabel = useMemo(() => {
    if (isUsageLoading) return "Checking free uses...";
    if (!usageStatus) return "Free preview: 5/day";
    return `Free generations left: ${usageStatus.remaining}`;
  }, [isUsageLoading, usageStatus]);

  function handleTrySample() {
    setInputText(SAMPLE_NOTES);
    trackEvent("try_sample_clicked", {
      scenario,
      tone,
      length,
      sample_length: SAMPLE_NOTES.length,
      ...sourceAttributionRef.current,
    });
  }

  async function handleGenerate() {
    const inputLength = inputText.trim().length;
    trackEvent("generate_clicked", {
      scenario,
      tone,
      length,
      input_length: inputLength,
      ...sourceAttributionRef.current,
    });
    setIsLoading(true);
    setError(null);
    setCopied(false);
    try {
      const response = await generateReport(
        {
          input_text: inputText,
          scenario,
          tone,
          length,
        },
        anonymousId,
      );
      setResult(response);
      setUsageStatus(response.usage);
      trackEvent("generate_success", {
        scenario,
        tone,
        length,
        input_length: inputLength,
        output_length: response.output_text.length,
        usage_remaining: response.usage.remaining,
        provider: response.metadata.provider,
        model: response.metadata.model,
        latency_ms: response.metadata.latency_ms,
        ...sourceAttributionRef.current,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      setError(message);
      checkUsage(anonymousId)
        .then(setUsageStatus)
        .catch(() => undefined);
      trackEvent("generate_failed", {
        scenario,
        tone,
        length,
        input_length: inputLength,
        error: message,
        ...sourceAttributionRef.current,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefine(actionType: string) {
    if (!result) return;
    trackEvent("refine_clicked", {
      action_type: actionType,
      output_length: result.output_text.length,
      ...sourceAttributionRef.current,
    });
    setIsLoading(true);
    setError(null);
    try {
      const response = await refineReport(
        {
          original_input: inputText,
          current_output: result.output_text,
          action_type: actionType,
        },
        anonymousId,
      );
      setResult(response);
      trackEvent("refine_success", {
        action_type: actionType,
        output_length: response.output_text.length,
        usage_remaining: response.usage.remaining,
        provider: response.metadata.provider,
        model: response.metadata.model,
        latency_ms: response.metadata.latency_ms,
        ...sourceAttributionRef.current,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Refine failed";
      setError(message);
      trackEvent("refine_failed", {
        action_type: actionType,
        error: message,
        ...sourceAttributionRef.current,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.output_text);
    setCopied(true);
    trackEvent("copy_clicked", {
      output_length: result.output_text.length,
      scenario,
      tone,
      length,
      ...sourceAttributionRef.current,
    });
  }

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "ManagerReady AI",
            applicationCategory: "ProductivityApplication",
            operatingSystem: "Web",
            url: SITE_URL,
            description: "Turn rough multilingual work notes into manager-ready English updates.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
      <nav className="nav">
        <div className="logo">
          <span className="logo-mark">MR</span>
          <span>ManagerReady AI</span>
        </div>
        <div className="nav-links">
          <span>Free preview</span>
          <a href="/use-cases">Use cases</a>
          <a href="/examples">Examples</a>
          <a href="/templates">Templates</a>
          <a href="/answers">Answers</a>
          <span>Pro coming next</span>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="badge">For non-native English professionals</span>
          <h1>Turn messy work notes into manager-ready updates.</h1>
          <p className="lead">
            Paste rough Chinese, English, or mixed bullet points. Get a clear weekly update,
            manager update, client email, or review summary without wrestling with prompts.
          </p>

          <div className="hero-actions">
            <a className="primary hero-link" href="#generator">Try the generator</a>
            <button className="secondary hero-link" onClick={handleTrySample} type="button">
              Load sample notes
            </button>
          </div>

          <div className="audience-row" aria-label="Common use cases">
            <span>Weekly updates</span>
            <span>Client emails</span>
            <span>Engineering reports</span>
            <span>Review summaries</span>
          </div>

          <div className="before-after" aria-label="Before and after example">
            <div className="example-box">
              <span className="example-label">Rough notes</span>
              <p>fixed login bug<br />billing QA pending<br />waiting design review<br />next week release checklist</p>
            </div>
            <div className="example-box">
              <span className="example-label accent">Manager-ready update</span>
              <p>
                This week, I fixed the login issue and continued QA for billing. The main
                dependency is design review. Next week, I will finalize release prep.
              </p>
            </div>
          </div>
        </div>

        <div className="card generator" id="generator">
          <div className="generator-head">
            <div>
              <span className="eyebrow">Generate now</span>
              <h2>Write the update</h2>
            </div>
            <span className="status">{usageLabel}</span>
          </div>

          <div className="toolbar">
            <label>
              Scenario
              <select value={scenario} onChange={(event) => setScenario(event.target.value)}>
                {scenarios.map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tone
              <select value={tone} onChange={(event) => setTone(event.target.value)}>
                {tones.map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Length
              <select value={length} onChange={(event) => setLength(event.target.value)}>
                {lengths.map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Paste rough notes
            <textarea
              value={inputText}
              maxLength={5000}
              placeholder="Example: fixed login bug, billing QA pending, waiting design review, next week release checklist..."
              onChange={(event) => setInputText(event.target.value)}
            />
          </label>

          <div className="actions">
            <button className="primary" onClick={handleGenerate} disabled={!canSubmit}>
              {isLoading ? "Working..." : "Generate update"}
            </button>
            <button className="secondary" onClick={handleTrySample} disabled={isLoading}>
              Try sample
            </button>
          </div>

          {isLoading ? (
            <p className="status">Generating with the free model... this may take 20–60 seconds.</p>
          ) : null}

          {error ? <div className="error">{error}</div> : null}

          {result ? (
            <section className="output">
              <div className="output-head">
                <strong>Generated update</strong>
                <button className="secondary" onClick={handleCopy}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre>{result.output_text}</pre>
              <div className="refine-panel" aria-label="Quick improvement actions">
                <div className="refine-panel-head">
                  <span>Quick improve</span>
                  <small>Adjust this draft with one click</small>
                </div>
                <div className="refine-actions">
                  {refineActions.map(([value, label]) => (
                    <button className="refine-button" key={value} onClick={() => handleRefine(value)} disabled={isLoading}>
                      <span className="refine-button-icon">↻</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="status">
                Model route: {result.metadata.provider} / {result.metadata.model} · {result.metadata.latency_ms}ms
              </p>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
