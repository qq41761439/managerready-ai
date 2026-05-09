import os

from app.ai_gateway import OpenAICompatibleProvider, build_gateway_from_env, load_environment_files


def test_build_gateway_auto_uses_openrouter_when_key_is_available(monkeypatch):
    monkeypatch.delenv("AI_PROVIDER", raising=False)
    monkeypatch.delenv("AI_API_KEY", raising=False)
    monkeypatch.delenv("AI_BASE_URL", raising=False)
    monkeypatch.delenv("AI_MODEL", raising=False)
    monkeypatch.setenv("OPENROUTER_API_KEY", "test-key")

    gateway = build_gateway_from_env(load_env=False)

    assert isinstance(gateway.primary, OpenAICompatibleProvider)
    assert gateway.primary.name == "openrouter"
    assert gateway.primary.base_url == "https://openrouter.ai/api/v1"
    assert gateway.primary.model == "openai/gpt-4o-mini"
    assert gateway.primary.reasoning_effort == "none"


def test_build_gateway_passes_reasoning_effort(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER", "openai_compatible")
    monkeypatch.setenv("AI_PROVIDER_NAME", "openrouter")
    monkeypatch.setenv("AI_API_KEY", "test-key")
    monkeypatch.setenv("AI_BASE_URL", "https://openrouter.ai/api/v1")
    monkeypatch.setenv("AI_MODEL", "test-model")
    monkeypatch.setenv("AI_REASONING_EFFORT", "none")

    gateway = build_gateway_from_env(load_env=False)

    assert isinstance(gateway.primary, OpenAICompatibleProvider)
    assert gateway.primary.reasoning_effort == "none"
    assert gateway.primary.fallback_models == ["nvidia/nemotron-3-super-120b-a12b:free"]


def test_build_gateway_passes_openrouter_fallback_models(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER", "openai_compatible")
    monkeypatch.setenv("AI_PROVIDER_NAME", "openrouter")
    monkeypatch.setenv("AI_API_KEY", "test-key")
    monkeypatch.setenv("AI_BASE_URL", "https://openrouter.ai/api/v1")
    monkeypatch.setenv("AI_MODEL", "old-free-model")
    monkeypatch.setenv("AI_FALLBACK_MODELS", "custom/free-model,nvidia/nemotron-3-super-120b-a12b:free")

    gateway = build_gateway_from_env(load_env=False)

    assert isinstance(gateway.primary, OpenAICompatibleProvider)
    assert gateway.primary.fallback_models == [
        "custom/free-model",
        "nvidia/nemotron-3-super-120b-a12b:free",
    ]


def test_build_gateway_allows_reasoning_effort_override(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER", "openai_compatible")
    monkeypatch.setenv("AI_PROVIDER_NAME", "openrouter")
    monkeypatch.setenv("AI_API_KEY", "test-key")
    monkeypatch.setenv("AI_BASE_URL", "https://openrouter.ai/api/v1")
    monkeypatch.setenv("AI_MODEL", "test-model")
    monkeypatch.setenv("AI_REASONING_EFFORT", "low")

    gateway = build_gateway_from_env(load_env=False)

    assert isinstance(gateway.primary, OpenAICompatibleProvider)
    assert gateway.primary.reasoning_effort == "low"


def test_build_gateway_auto_uses_openai_when_openrouter_is_missing(monkeypatch):
    monkeypatch.delenv("AI_PROVIDER", raising=False)
    monkeypatch.delenv("AI_API_KEY", raising=False)
    monkeypatch.delenv("AI_BASE_URL", raising=False)
    monkeypatch.delenv("AI_MODEL", raising=False)
    monkeypatch.delenv("AI_PROVIDER_NAME", raising=False)
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    gateway = build_gateway_from_env(load_env=False)

    assert isinstance(gateway.primary, OpenAICompatibleProvider)
    assert gateway.primary.name == "openai"
    assert gateway.primary.base_url == "https://api.openai.com/v1"
    assert gateway.primary.model == "gpt-4o-mini"


def test_load_environment_files_reads_project_env(tmp_path, monkeypatch):
    env_file = tmp_path / ".env"
    env_file.write_text("AI_PROVIDER=mock\nAI_TEST_VALUE=loaded\n", encoding="utf-8")
    monkeypatch.delenv("AI_TEST_VALUE", raising=False)

    load_environment_files(paths=[env_file])

    assert os.getenv("AI_TEST_VALUE") == "loaded"
