from __future__ import annotations

import os
import time
from dataclasses import dataclass
from typing import Protocol

import httpx


class ProviderError(RuntimeError):
    pass


@dataclass(frozen=True)
class AIResult:
    content: str
    provider: str
    model: str
    latency_ms: int
    input_tokens: int | None = None
    output_tokens: int | None = None
    cost_estimate: float | None = None


class AIProvider(Protocol):
    name: str
    model: str

    async def complete(self, messages: list[dict[str, str]], purpose: str) -> AIResult:
        ...


class MockProvider:
    name: str
    model: str = "mock-weekly-report"

    def __init__(self, name: str = "mock-primary", should_fail: bool = False):
        self.name = name
        self.should_fail = should_fail

    async def complete(self, messages: list[dict[str, str]], purpose: str) -> AIResult:
        start = time.perf_counter()
        if self.should_fail:
            raise ProviderError(f"Provider {self.name} failed")

        user_content = "\n".join(message["content"] for message in messages if message["role"] == "user")
        report = _mock_report_from_notes(user_content=user_content, purpose=purpose)
        return AIResult(
            content=report,
            provider=self.name,
            model=self.model,
            latency_ms=int((time.perf_counter() - start) * 1000),
        )


class OpenAICompatibleProvider:
    def __init__(
        self,
        *,
        name: str,
        base_url: str,
        api_key: str,
        model: str,
        timeout_seconds: int = 30,
    ):
        self.name = name
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model
        self.timeout_seconds = timeout_seconds

    async def complete(self, messages: list[dict[str, str]], purpose: str) -> AIResult:
        start = time.perf_counter()
        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": 0.4,
                },
            )
        if response.status_code >= 400:
            raise ProviderError(f"Provider {self.name} returned {response.status_code}")

        payload = response.json()
        content = payload["choices"][0]["message"]["content"]
        usage = payload.get("usage", {})
        return AIResult(
            content=content,
            provider=self.name,
            model=self.model,
            latency_ms=int((time.perf_counter() - start) * 1000),
            input_tokens=usage.get("prompt_tokens"),
            output_tokens=usage.get("completion_tokens"),
        )


class AIGateway:
    def __init__(self, *, primary: AIProvider, fallback: AIProvider | None = None):
        self.primary = primary
        self.fallback = fallback

    async def complete(self, messages: list[dict[str, str]], purpose: str) -> AIResult:
        errors: list[str] = []
        for provider in [self.primary, self.fallback]:
            if provider is None:
                continue
            try:
                return await provider.complete(messages=messages, purpose=purpose)
            except Exception as exc:  # noqa: BLE001 - provider failures are normalized here
                errors.append(f"{provider.name}: {exc}")

        raise ProviderError("All AI providers failed: " + "; ".join(errors))


def build_gateway_from_env() -> AIGateway:
    provider = os.getenv("AI_PROVIDER", "mock").lower()
    if provider == "openai_compatible":
        primary = OpenAICompatibleProvider(
            name=os.getenv("AI_PROVIDER_NAME", "openai-compatible"),
            base_url=os.environ["AI_BASE_URL"],
            api_key=os.environ["AI_API_KEY"],
            model=os.environ["AI_MODEL"],
        )
        fallback = MockProvider(name="mock-fallback") if os.getenv("AI_ENABLE_MOCK_FALLBACK") == "1" else None
        return AIGateway(primary=primary, fallback=fallback)

    return AIGateway(primary=MockProvider(name="mock-primary"))


def _mock_report_from_notes(*, user_content: str, purpose: str) -> str:
    compact_notes = " ".join(line.strip("-* ") for line in user_content.splitlines() if line.strip())
    if not compact_notes:
        compact_notes = "No detailed notes provided."

    action_line = "The update has been refined based on the requested style." if purpose == "refine" else ""
    return f"""# Weekly Update

## Executive Summary
This week focused on progressing key work items and turning rough updates into a clear, manager-ready status report. {action_line}

## Key Accomplishments
- Organized the provided work notes into a professional English update.
- Highlighted completed work, visible progress, and communication-ready outcomes.
- Source notes: {compact_notes[:240]}

## Blockers / Risks
- No major blockers reported. Add specific risks if there are dependencies, delays, or unresolved decisions.

## Plans for Next Week
- Continue execution on the highest-priority workstreams.
- Add measurable outcomes and next-step owners where available.
""".strip()
