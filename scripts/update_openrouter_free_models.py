#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
MODELS_URL = "https://openrouter.ai/api/v1/models?output_modalities=text"
CONFIG_PATH = REPO_ROOT / "backend" / "app" / "openrouter_free_models.py"
RENDER_PATH = REPO_ROOT / "render.yaml"
MAX_MODELS = 9


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Refresh OpenRouter free text model fallbacks from the official models API.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print selected models without writing files.")
    parser.add_argument("--max-models", type=int, default=MAX_MODELS)
    args = parser.parse_args()

    models = fetch_models()
    selected_models = select_free_text_models(models, limit=args.max_models)
    if not selected_models:
        print("No free text models found in OpenRouter response.", file=sys.stderr)
        return 1

    print("Selected OpenRouter free fallback models:")
    for model in selected_models:
        print(f"- {model}")

    if args.dry_run:
        return 0

    updated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    write_if_changed(CONFIG_PATH, render_config(selected_models, updated_at))
    update_render_yaml(selected_models)
    return 0


def fetch_models() -> list[dict[str, Any]]:
    request = urllib.request.Request(
        MODELS_URL,
        headers={
            "User-Agent": "managerready-ai-openrouter-free-model-updater/1.0",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    data = payload.get("data")
    if not isinstance(data, list):
        raise RuntimeError("OpenRouter models API response did not include a data list.")
    return data


def select_free_text_models(models: list[dict[str, Any]], *, limit: int) -> list[str]:
    candidates = [model for model in models if is_free_text_chat_model(model)]
    candidates.sort(
        key=lambda model: (
            int(model.get("created") or 0),
            int(model.get("context_length") or 0),
            model.get("id") or "",
        ),
        reverse=True,
    )

    selected: list[str] = []
    for model in candidates:
        model_id = model.get("id")
        if isinstance(model_id, str) and model_id not in selected:
            selected.append(model_id)
        if len(selected) >= limit - 1:
            break

    if "openrouter/free" not in selected:
        selected.append("openrouter/free")
    return selected[:limit]


def is_free_text_chat_model(model: dict[str, Any]) -> bool:
    model_id = model.get("id")
    if not isinstance(model_id, str):
        return False

    if model_id != "openrouter/free" and not model_id.endswith(":free"):
        return False

    architecture = model.get("architecture") or {}
    if architecture.get("modality") != "text->text" and model_id != "openrouter/free":
        return False
    if "text" not in architecture.get("input_modalities", []):
        return False
    if "text" not in architecture.get("output_modalities", []):
        return False

    supported_parameters = model.get("supported_parameters") or []
    if "temperature" not in supported_parameters:
        return False

    pricing = model.get("pricing") or {}
    return is_zero(pricing.get("prompt")) and is_zero(pricing.get("completion")) and is_zero(
        pricing.get("request", "0"),
    )


def is_zero(value: Any) -> bool:
    try:
        return Decimal(str(value)) == 0
    except (InvalidOperation, TypeError, ValueError):
        return False


def render_config(models: list[str], updated_at: str) -> str:
    model_lines = "\n".join(f'    "{model}",' for model in models)
    return f'''"""Generated OpenRouter free-model fallback list.

Run `python3 scripts/update_openrouter_free_models.py` from the repo root to refresh.
"""

OPENROUTER_FREE_MODELS_UPDATED_AT = "{updated_at}"

OPENROUTER_FREE_FALLBACK_MODELS = [
{model_lines}
]
'''


def update_render_yaml(models: list[str]) -> None:
    content = RENDER_PATH.read_text(encoding="utf-8")
    fallback_value = ",".join(models)
    pattern = r"(\n\s+- key: AI_FALLBACK_MODELS\n\s+value: ).*"
    updated, count = re.subn(pattern, lambda match: f"{match.group(1)}{fallback_value}", content)
    if count == 0:
        raise RuntimeError("Could not find AI_FALLBACK_MODELS in render.yaml")
    write_if_changed(RENDER_PATH, updated)


def write_if_changed(path: Path, content: str) -> None:
    current = path.read_text(encoding="utf-8") if path.exists() else None
    if current != content:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")


if __name__ == "__main__":
    raise SystemExit(main())
