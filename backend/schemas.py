"""
app/models/schemas.py
─────────────────────
Pydantic models that define the exact shape of every API response.
These act as both documentation and runtime validation.
"""

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Threat indicators
# ---------------------------------------------------------------------------

class ThreatScore(BaseModel):
    """A single detected threat dimension with score, confidence, and evidence."""

    score: float = Field(
        ...,
        ge=0.0, le=1.0,
        description="Probability / severity in [0, 1]. 0 = benign, 1 = highly likely.",
    )
    confidence: float = Field(
        ...,
        ge=0.0, le=1.0,
        description="Model's confidence in this score.",
    )
    evidence: list[str] = Field(
        default_factory=list,
        description="Verbatim phrases or observations that drove this score.",
    )
    explanation: str = Field(
        ...,
        description="Human-readable explanation of the finding.",
    )


class ThreatBreakdown(BaseModel):
    """All six threat dimensions Sentinel AI evaluates."""

    scam_probability: ThreatScore = Field(
        ..., description="Likelihood the content is a scam attempt."
    )
    urgency_manipulation: ThreatScore = Field(
        ..., description="Artificial urgency used to pressure the target."
    )
    authority_impersonation: ThreatScore = Field(
        ..., description="Impersonation of government, bank, tech support, etc."
    )
    credential_harvesting: ThreatScore = Field(
        ..., description="Attempts to obtain passwords, OTPs, or personal data."
    )
    emotional_coercion: ThreatScore = Field(
        ..., description="Fear, guilt, or emotional manipulation tactics."
    )
    deepfake_suspicion: ThreatScore = Field(
        ..., description="Linguistic/acoustic markers that suggest synthetic audio/video."
    )


# ---------------------------------------------------------------------------
# Full analysis response
# ---------------------------------------------------------------------------

class AnalysisResult(BaseModel):
    """Complete response returned by POST /api/v1/analyze."""

    # ── File metadata ──────────────────────────────────────────────────────
    filename: str
    content_type: str
    duration_seconds: float | None = Field(
        None, description="Media duration if determinable."
    )

    # ── Transcription ──────────────────────────────────────────────────────
    transcript: str = Field(..., description="Full Whisper transcript.")
    transcript_language: str | None = Field(
        None, description="ISO 639-1 language code detected by Whisper."
    )

    # ── Threat analysis ────────────────────────────────────────────────────
    overall_risk_score: float = Field(
        ..., ge=0.0, le=1.0,
        description="Composite risk score across all dimensions.",
    )
    risk_level: str = Field(
        ..., description="LOW | MEDIUM | HIGH | CRITICAL"
    )
    threats: ThreatBreakdown

    # ── Recommendations ────────────────────────────────────────────────────
    recommendations: list[str] = Field(
        default_factory=list,
        description="Actionable advice for the recipient.",
    )
    summary: str = Field(
        ..., description="One-paragraph plain-English summary of the analysis."
    )


# ---------------------------------------------------------------------------
# Error response
# ---------------------------------------------------------------------------

class ErrorResponse(BaseModel):
    error: str
    detail: str | None = None
