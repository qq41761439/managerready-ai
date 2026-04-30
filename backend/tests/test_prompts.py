import pytest

from app.prompts import BuildPromptRequest, build_generation_messages, build_refine_messages


def test_generation_prompt_preserves_user_notes_and_selected_options():
    request = BuildPromptRequest(
        input_text="- Fixed checkout bug\n- 跟设计确认 dashboard 改版",
        scenario="manager_update",
        tone="formal",
        length="concise",
    )

    messages = build_generation_messages(request)

    assert messages[0]["role"] == "system"
    assert "manager-ready English update" in messages[0]["content"]
    assert "Manager Update" in messages[0]["content"]
    assert "Formal" in messages[0]["content"]
    assert "Concise" in messages[0]["content"]
    assert messages[1] == {
        "role": "user",
        "content": "- Fixed checkout bug\n- 跟设计确认 dashboard 改版",
    }


def test_generation_prompt_rejects_empty_input():
    with pytest.raises(ValueError, match="input_text is required"):
        build_generation_messages(
            BuildPromptRequest(
                input_text="   ",
                scenario="weekly_update",
                tone="semi_formal",
                length="standard",
            )
        )


def test_refine_prompt_includes_current_output_and_action():
    messages = build_refine_messages(
        original_input="- shipped analytics",
        current_output="Weekly Update\n- Shipped analytics.",
        action_type="make_more_data_driven",
    )

    assert messages[0]["role"] == "system"
    assert "Make it more data-driven" in messages[0]["content"]
    assert "Weekly Update" in messages[1]["content"]
    assert "- shipped analytics" in messages[1]["content"]
