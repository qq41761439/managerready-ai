from fastapi.testclient import TestClient

from app.ai_gateway import AIGateway, MockProvider
from app.main import create_app


def make_test_app(**kwargs):
    return create_app(gateway=AIGateway(primary=MockProvider(name="mock-primary")), **kwargs)


def test_health_endpoint_returns_ok():
    client = TestClient(make_test_app())

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "managerready-api"}


def test_generate_endpoint_returns_report_and_usage():
    client = TestClient(make_test_app())

    response = client.post(
        "/api/generate",
        json={
            "input_text": "- Fixed checkout bug\n- 下周准备上线 analytics",
            "scenario": "manager_update",
            "tone": "formal",
            "length": "standard",
        },
        headers={"X-Anonymous-Id": "test-anon"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert "Executive Summary" in payload["output_text"]
    assert payload["usage"]["remaining"] == 4
    assert payload["metadata"]["provider"] == "mock-primary"


def test_generate_endpoint_blocks_when_quota_is_exhausted():
    client = TestClient(make_test_app(default_daily_limit=1))
    body = {
        "input_text": "- Fixed checkout bug",
        "scenario": "manager_update",
        "tone": "formal",
        "length": "standard",
    }

    first = client.post("/api/generate", json=body, headers={"X-Anonymous-Id": "quota-anon"})
    second = client.post("/api/generate", json=body, headers={"X-Anonymous-Id": "quota-anon"})

    assert first.status_code == 200
    assert second.status_code == 429
    assert second.json()["detail"] == "Daily free generation limit reached"


def test_refine_endpoint_returns_refined_output():
    client = TestClient(make_test_app())

    response = client.post(
        "/api/refine",
        json={
            "original_input": "- shipped analytics",
            "current_output": "Weekly Update\n- Shipped analytics.",
            "action_type": "make_shorter",
        },
        headers={"X-Anonymous-Id": "refine-anon"},
    )

    assert response.status_code == 200
    assert "Executive Summary" in response.json()["output_text"]
