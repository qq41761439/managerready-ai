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
  useEffect(() => {
    const key = "managerready_anonymous_id";
    const existing = window.localStorage.getItem(key);
    const resolvedAnonymousId = existing ?? crypto.randomUUID();
    const params = new URLSearchParams(window.location.search);
    const scenarioParam = params.get("scenario");
    const toneParam = params.get("tone");
    const lengthParam = params.get("length");

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
      });
      hasTrackedPageView.current = true;
    }

    if (scenarioParam || toneParam || lengthParam || params.get("utm_source")) {
      trackEvent("generator_prefilled_from_url", {
        scenario: hasOption(scenarios, scenarioParam) ? scenarioParam : undefined,
        tone: hasOption(tones, toneParam) ? toneParam : undefined,
        length: hasOption(lengths, lengthParam) ? lengthParam : undefined,
        utm_source: params.get("utm_source"),
        utm_campaign: params.get("utm_campaign"),
      });
    }
  }, []);

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
    });
  }

  async function handleGenerate() {
    const inputLength = inputText.trim().length;
    trackEvent("generate_clicked", {
      scenario,
      tone,
      length,
      input_length: inputLength,
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
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Refine failed";
      setError(message);
      trackEvent("refine_failed", {
        action_type: actionType,
        error: message,
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
          <span className="logo-mark">M</span>
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
        <div>
          <span className="badge">For non-native English professionals</span>
          <h1>Turn rough work notes into manager-ready English updates.</h1>
          <p className="lead">
            Paste messy Chinese, English, or mixed bullet points. Get a polished weekly update,
            manager update, client update, or promotion-ready summary in seconds.
          </p>
          <ul className="bullets">
            <li>Designed for remote teams, PMs, engineers, operators, and freelancers.</li>
            <li>Provider-agnostic AI backend: easy to switch models by quality and cost.</li>
            <li>Python FastAPI backend, ready for auth, payments, history, and analytics.</li>
          </ul>

          <div className="example">
            <div className="example-box">
              <h3>Before</h3>
              <p>修复 checkout bug；dashboard 跟设计对齐；analytics 下周上线；API 有 blocker。</p>
            </div>
            <div className="example-box">
              <h3>After</h3>
              <p>
                This week, I improved the checkout flow, aligned with design on the dashboard
                redesign, and prepared the analytics release while tracking one API dependency.
              </p>
            </div>
          </div>
        </div>

        <div className="card generator">
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
            Rough notes
            <textarea
              value={inputText}
              maxLength={5000}
              placeholder="Enter your work highlights, bullet points, blockers, or just rough thoughts..."
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
            <span className="status">
              {usageLabel}
            </span>
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
