import pytest

from app.ai_gateway import AIGateway, AIResult, MockProvider, OpenAICompatibleProvider, ProviderError


@pytest.mark.asyncio
async def test_ai_gateway_uses_primary_provider():
    gateway = AIGateway(primary=MockProvider(name="mock-primary"))

    result = await gateway.complete(messages=[{"role": "user", "content": "hello"}], purpose="generate")

    assert result.provider == "mock-primary"
    assert result.model == "mock-weekly-report"
    assert "Executive Summary" in result.content
    assert result.latency_ms >= 0


@pytest.mark.asyncio
async def test_ai_gateway_falls_back_when_primary_fails():
    gateway = AIGateway(
        primary=MockProvider(name="broken", should_fail=True),
        fallback=MockProvider(name="fallback"),
    )

    result = await gateway.complete(messages=[{"role": "user", "content": "hello"}], purpose="generate")

    assert result.provider == "fallback"
    assert "Executive Summary" in result.content


@pytest.mark.asyncio
async def test_ai_gateway_raises_when_all_providers_fail():
    gateway = AIGateway(
        primary=MockProvider(name="broken", should_fail=True),
        fallback=MockProvider(name="fallback", should_fail=True),
    )

    with pytest.raises(ProviderError):
        await gateway.complete(messages=[{"role": "user", "content": "hello"}], purpose="generate")


@pytest.mark.asyncio
async def test_openai_compatible_provider_tries_fallback_model(monkeypatch):
    provider = OpenAICompatibleProvider(
        name="openrouter",
        base_url="https://openrouter.ai/api/v1",
        api_key="test-key",
        model="old-free-model",
        fallback_models=["new-free-model"],
    )
    attempted_models: list[str] = []

    async def fake_complete_with_model(*, model: str, messages: list[dict[str, str]]) -> AIResult:
        attempted_models.append(model)
        if model == "old-free-model":
            raise ProviderError("Provider openrouter returned 404")
        return AIResult(
            content="fallback result",
            provider="openrouter",
            model=model,
            latency_ms=0,
        )

    monkeypatch.setattr(provider, "_complete_with_model", fake_complete_with_model)

    result = await provider.complete(messages=[{"role": "user", "content": "hello"}], purpose="generate")

    assert attempted_models == ["old-free-model", "new-free-model"]
    assert result.model == "new-free-model"
    assert result.content == "fallback result"
