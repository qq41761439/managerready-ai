import pytest

from app.ai_gateway import AIGateway, MockProvider, ProviderError


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
