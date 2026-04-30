from app.ai_gateway import OllamaProvider, build_gateway_from_env


def test_build_gateway_uses_ollama_when_configured(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER", "ollama")
    monkeypatch.setenv("OLLAMA_MODEL", "qwen3:8b")

    gateway = build_gateway_from_env(load_env=False)

    assert isinstance(gateway.primary, OllamaProvider)
    assert gateway.primary.name == "ollama"
    assert gateway.primary.model == "qwen3:8b"
    assert gateway.primary.base_url == "http://127.0.0.1:11434"
