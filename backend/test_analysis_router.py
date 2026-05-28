"""
tests/test_analysis_router.py
──────────────────────────────
Integration smoke-tests for the analysis endpoints.
Uses FastAPI's TestClient (synchronous httpx wrapper).

Run with:
    pytest tests/ -v
"""

import pytest
from fastapi.testclient import TestClient

# The import will fail if OPENAI_API_KEY is not set; that is intentional —
# integration tests require real credentials.
from app.main import app

client = TestClient(app)


# ---------------------------------------------------------------------------
# Health checks
# ---------------------------------------------------------------------------

def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_ready():
    response = client.get("/api/v1/ready")
    assert response.status_code == 200


# ---------------------------------------------------------------------------
# Text-based analysis (no file upload needed)
# ---------------------------------------------------------------------------

SCAM_TRANSCRIPT = (
    "Hello, this is Officer Johnson from the IRS. Your Social Security number has been "
    "suspended due to suspicious activity. You must call us back immediately or you will "
    "be arrested today. Press 1 now to speak with a federal agent and avoid criminal "
    "charges. We need your bank account details to release the hold. Act now — this is "
    "your final warning."
)

BENIGN_TRANSCRIPT = (
    "Hey, it's Sarah. Just calling to remind you about dinner on Saturday at 7 PM. "
    "We're thinking the Italian place on Main Street. Let me know if that works for you!"
)


def test_text_analysis_scam():
    response = client.post(
        "/api/v1/analyze/text",
        json={"transcript": SCAM_TRANSCRIPT, "filename": "scam_test.txt"},
    )
    assert response.status_code == 200
    data = response.json()

    # A clear scam should score HIGH or CRITICAL
    assert data["risk_level"] in ("HIGH", "CRITICAL")
    assert data["overall_risk_score"] >= 0.5
    assert data["threats"]["scam_probability"]["score"] >= 0.5


def test_text_analysis_benign():
    response = client.post(
        "/api/v1/analyze/text",
        json={"transcript": BENIGN_TRANSCRIPT, "filename": "benign_test.txt"},
    )
    assert response.status_code == 200
    data = response.json()

    assert data["risk_level"] in ("LOW", "MEDIUM")
    assert data["overall_risk_score"] <= 0.4


def test_empty_transcript_returns_422():
    response = client.post(
        "/api/v1/analyze/text",
        json={"transcript": "   ", "filename": "empty.txt"},
    )
    assert response.status_code == 422


# ---------------------------------------------------------------------------
# File upload — type validation (no real file needed to test the guard)
# ---------------------------------------------------------------------------

def test_unsupported_file_type_rejected():
    response = client.post(
        "/api/v1/analyze",
        files={"file": ("document.pdf", b"fake pdf content", "application/pdf")},
    )
    assert response.status_code == 415
