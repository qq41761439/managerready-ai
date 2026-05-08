from __future__ import annotations

import os
import re
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

import httpx
from dotenv import load_dotenv


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
        reasoning_effort: str | None = None,
        extra_headers: dict[str, str] | None = None,
    ):
        self.name = name
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model
        self.timeout_seconds = timeout_seconds
        self.reasoning_effort = reasoning_effort
        self.extra_headers = extra_headers or {}

    async def complete(self, messages: list[dict[str, str]], purpose: str) -> AIResult:
        start = time.perf_counter()
        headers = {"Authorization": f"Bearer {self.api_key}"}
        headers.update(self.extra_headers)
        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds, trust_env=False) as client:
                payload = {
                    "model": self.model,
                    "messages": messages,
                    "temperature": 0.4,
                }
                if self.reasoning_effort:
                    payload["reasoning"] = {
                        "effort": self.reasoning_effort,
                        "exclude": True,
                    }
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                )
        except httpx.TimeoutException as exc:
            raise ProviderError(f"Provider {self.name} timed out after {self.timeout_seconds}s") from exc
        except httpx.HTTPError as exc:
            raise ProviderError(f"Provider {self.name} request failed: {exc}") from exc
        if response.status_code >= 400:
            raise ProviderError(f"Provider {self.name} returned {response.status_code}: {response.text}")

        payload = response.json()
        content = clean_model_output(payload["choices"][0]["message"]["content"])
        usage = payload.get("usage", {})
        return AIResult(
            content=content,
            provider=self.name,
            model=self.model,
            latency_ms=int((time.perf_counter() - start) * 1000),
            input_tokens=usage.get("prompt_tokens"),
            output_tokens=usage.get("completion_tokens"),
        )


class OllamaProvider:
    name = "ollama"

    def __init__(
        self,
        *,
        model: str = "qwen3:8b",
        base_url: str = "http://127.0.0.1:11434",
        timeout_seconds: int = 60,
    ):
        self.model = model
        self.base_url = base_url.rstrip("/")
        self.timeout_seconds = timeout_seconds

    async def complete(self, messages: list[dict[str, str]], purpose: str) -> AIResult:
        start = time.perf_counter()
        async with httpx.AsyncClient(timeout=self.timeout_seconds, trust_env=False) as client:
            response = await client.post(
                f"{self.base_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False,
                    "options": {"temperature": 0.4},
                },
            )
        if response.status_code >= 400:
            raise ProviderError(f"Provider {self.name} returned {response.status_code}: {response.text}")

        payload = response.json()
        content = clean_model_output(payload.get("message", {}).get("content", ""))
        return AIResult(
            content=content,
            provider=self.name,
            model=self.model,
            latency_ms=int((time.perf_counter() - start) * 1000),
            input_tokens=payload.get("prompt_eval_count"),
            output_tokens=payload.get("eval_count"),
        )


class AnthropicProvider:
    name = "anthropic"

    def __init__(
        self,
        *,
        api_key: str,
        model: str = "claude-3-5-haiku-latest",
        timeout_seconds: int = 30,
    ):
        self.api_key = api_key
        self.model = model
        self.timeout_seconds = timeout_seconds

    async def complete(self, messages: list[dict[str, str]], purpose: str) -> AIResult:
        start = time.perf_counter()
        system_prompt = "\n\n".join(
            message["content"] for message in messages if message["role"] == "system"
        )
        anthropic_messages = [
            {"role": message["role"], "content": message["content"]}
            for message in messages
            if message["role"] in {"user", "assistant"}
        ]
        async with httpx.AsyncClient(timeout=self.timeout_seconds, trust_env=False) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": self.api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": self.model,
                    "max_tokens": 1200,
                    "temperature": 0.4,
                    "system": system_prompt,
                    "messages": anthropic_messages,
                },
            )
        if response.status_code >= 400:
            raise ProviderError(f"Provider {self.name} returned {response.status_code}: {response.text}")

        payload = response.json()
        content_blocks = payload.get("content", [])
        content = clean_model_output("".join(
            block.get("text", "") for block in content_blocks if block.get("type") == "text"
        ))
        usage = payload.get("usage", {})
        return AIResult(
            content=content,
            provider=self.name,
            model=self.model,
            latency_ms=int((time.perf_counter() - start) * 1000),
            input_tokens=usage.get("input_tokens"),
            output_tokens=usage.get("output_tokens"),
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


def load_environment_files(paths: list[Path] | None = None) -> None:
    env_paths = paths or [
        Path.cwd() / ".env",
        Path.cwd().parent / ".env",
        Path.home() / ".hermes" / ".env",
    ]
    for env_path in env_paths:
        if env_path.exists():
            load_dotenv(env_path, override=False)


def build_gateway_from_env(*, load_env: bool = True) -> AIGateway:
    if load_env:
        load_environment_files()

    provider = os.getenv("AI_PROVIDER", "auto").lower()
    if provider == "auto":
        provider = _auto_detect_provider()

    if provider == "openai_compatible":
        timeout_seconds = _env_int("AI_TIMEOUT_SECONDS", 90)
        reasoning_effort = os.getenv("AI_REASONING_EFFORT")
        extra_headers = {}
        if os.getenv("AI_PROVIDER_NAME") == "openrouter":
            extra_headers = {
                "HTTP-Referer": "https://managerready.ai",
                "X-Title": "ManagerReady AI",
            }
        primary = OpenAICompatibleProvider(
            name=os.getenv("AI_PROVIDER_NAME", "openai-compatible"),
            base_url=os.environ["AI_BASE_URL"],
            api_key=os.environ["AI_API_KEY"],
            model=os.environ["AI_MODEL"],
            timeout_seconds=timeout_seconds,
            reasoning_effort=reasoning_effort,
            extra_headers=extra_headers,
        )
        fallback = MockProvider(name="mock-fallback") if os.getenv("AI_ENABLE_MOCK_FALLBACK") == "1" else None
        return AIGateway(primary=primary, fallback=fallback)

    if provider == "openrouter":
        timeout_seconds = _env_int("AI_TIMEOUT_SECONDS", 90)
        reasoning_effort = os.getenv("AI_REASONING_EFFORT")
        primary = OpenAICompatibleProvider(
            name="openrouter",
            base_url="https://openrouter.ai/api/v1",
            api_key=os.environ["OPENROUTER_API_KEY"],
            model=os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
            timeout_seconds=timeout_seconds,
            reasoning_effort=reasoning_effort,
            extra_headers={
                "HTTP-Referer": "https://managerready.ai",
                "X-Title": "ManagerReady AI",
            },
        )
        fallback = MockProvider(name="mock-fallback") if os.getenv("AI_ENABLE_MOCK_FALLBACK") == "1" else None
        return AIGateway(primary=primary, fallback=fallback)

    if provider == "openai":
        primary = OpenAICompatibleProvider(
            name="openai",
            base_url="https://api.openai.com/v1",
            api_key=os.environ["OPENAI_API_KEY"],
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        )
        fallback = MockProvider(name="mock-fallback") if os.getenv("AI_ENABLE_MOCK_FALLBACK") == "1" else None
        return AIGateway(primary=primary, fallback=fallback)

    if provider == "anthropic":
        primary = AnthropicProvider(
            api_key=os.environ["ANTHROPIC_API_KEY"],
            model=os.getenv("ANTHROPIC_MODEL", "claude-3-5-haiku-latest"),
        )
        fallback = MockProvider(name="mock-fallback") if os.getenv("AI_ENABLE_MOCK_FALLBACK") == "1" else None
        return AIGateway(primary=primary, fallback=fallback)

    if provider == "ollama":
        primary = OllamaProvider(
            model=os.getenv("OLLAMA_MODEL", "qwen3:8b"),
            base_url=os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434"),
        )
        fallback = MockProvider(name="mock-fallback") if os.getenv("AI_ENABLE_MOCK_FALLBACK") == "1" else None
        return AIGateway(primary=primary, fallback=fallback)

    return AIGateway(primary=MockProvider(name="mock-primary"))


def _auto_detect_provider() -> str:
    if os.getenv("AI_API_KEY") and os.getenv("AI_BASE_URL") and os.getenv("AI_MODEL"):
        return "openai_compatible"
    if os.getenv("OPENROUTER_API_KEY"):
        return "openrouter"
    if os.getenv("OPENAI_API_KEY"):
        return "openai"
    if os.getenv("ANTHROPIC_API_KEY"):
        return "anthropic"
    return "mock"


def _env_int(name: str, default: int) -> int:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    try:
        return int(raw_value)
    except ValueError:
        return default


def clean_model_output(content: str) -> str:
    without_think = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL | re.IGNORECASE)
    return without_think.strip()


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
