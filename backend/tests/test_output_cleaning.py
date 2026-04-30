from app.ai_gateway import clean_model_output


def test_clean_model_output_removes_think_blocks():
    raw = "<think>private reasoning</think>\n\n# Manager Update\nActual report"

    assert clean_model_output(raw) == "# Manager Update\nActual report"


def test_clean_model_output_preserves_normal_text():
    raw = "# Weekly Update\n\n## Executive Summary\nDone"

    assert clean_model_output(raw) == raw
