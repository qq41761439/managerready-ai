from pydantic import BaseModel, Field


SCENARIO_LABELS = {
    "weekly_update": "Weekly Update",
    "manager_update": "Manager Update",
    "client_update": "Client Update",
    "engineering_update": "Engineering Update",
    "product_update": "Product Update",
    "standup_summary": "Standup Summary",
    "promotion_summary": "Promotion Summary",
}

TONE_LABELS = {
    "formal": "Formal",
    "semi_formal": "Semi-formal",
    "data_driven": "Data-driven",
}

LENGTH_LABELS = {
    "concise": "Concise",
    "standard": "Standard",
    "detailed": "Detailed",
}

REFINE_ACTION_LABELS = {
    "make_more_formal": "Make it more formal",
    "make_shorter": "Make it shorter",
    "make_more_data_driven": "Make it more data-driven",
    "improve_clarity": "Improve clarity",
}


class BuildPromptRequest(BaseModel):
    input_text: str = Field(..., max_length=5000)
    scenario: str = "weekly_update"
    tone: str = "semi_formal"
    length: str = "standard"


def _label(mapping: dict[str, str], key: str, fallback: str) -> str:
    return mapping.get(key, fallback)


def build_generation_messages(request: BuildPromptRequest) -> list[dict[str, str]]:
    input_text = request.input_text.strip()
    if not input_text:
        raise ValueError("input_text is required")

    scenario_label = _label(SCENARIO_LABELS, request.scenario, "Weekly Update")
    tone_label = _label(TONE_LABELS, request.tone, "Semi-formal")
    length_label = _label(LENGTH_LABELS, request.length, "Standard")

    system_prompt = f"""
You are a professional weekly report generator for non-native English professionals.
Turn rough multilingual work notes into a manager-ready English update.

Output type: {scenario_label}
Tone: {tone_label}
Length: {length_label}

Rules:
- Accept mixed Chinese and English notes.
- Use only facts explicitly provided by the user.
- Do not invent unsupported metrics, QA status, launch status, owners, customer impact, or completed work.
- If metrics or blockers are missing, say they were not specified or use qualitative wording.
- Make the writing clear, polished, and business-appropriate.
- Prefer concrete outcomes, blockers, and next steps.
- Return only the final report, no explanations, no internal reasoning, no <think> tags.
- If you are a reasoning model, use /no_think mode.

Required structure:
# {scenario_label}

## Executive Summary
A short summary of the week.

## Key Accomplishments
- Bullet points.

## Blockers / Risks
- Bullet points, or "No major blockers reported." if absent.

## Plans for Next Week
- Bullet points.
""".strip()

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"{input_text}\n\n/no_think"},
    ]


def build_refine_messages(
    *, original_input: str, current_output: str, action_type: str
) -> list[dict[str, str]]:
    if not current_output.strip():
        raise ValueError("current_output is required")

    action_label = _label(REFINE_ACTION_LABELS, action_type, "Improve clarity")
    system_prompt = f"""
You improve professional English workplace updates.
Action: {action_label}

Rules:
- Preserve facts from the original input and current output.
- Do not invent unsupported metrics.
- Return only the revised report.
""".strip()

    user_prompt = f"""
Original rough notes:
{original_input.strip()}

Current output:
{current_output.strip()}

/no_think
""".strip()

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
