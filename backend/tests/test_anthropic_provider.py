from app.ai_gateway import AnthropicProvider, build_gateway_from_env


def test_build_gateway_auto_uses_anthropic_when_other_keys_are_missing(monkeypatch):
    monkeypatch.delenv("AI_PROVIDER", raising=False)
    monkeypatch.delenv("AI_API_KEY", raising=False)
    monkeypatch.delenv("AI_BASE_URL", raising=False)
    monkeypatch.delenv("AI_MODEL", raising=False)
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-key")

    gateway = build_gateway_from_env(load_env=False)

    assert isinstance(gateway.primary, AnthropicProvider)
    assert gateway.primary.name == "anthropic"
    assert gateway.primary.model == "claude-3-5-haiku-latest"
