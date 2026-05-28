"""
app/routers/health.py
──────────────────────
Simple liveness / readiness endpoints.
Useful for Docker health checks, load-balancer probes, and CI smoke tests.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health", summary="Liveness probe")
async def health_check():
    """Returns 200 OK if the service is running."""
    return {"status": "ok", "service": "Sentinel AI"}


@router.get("/ready", summary="Readiness probe")
async def readiness_check():
    """
    Lightweight readiness probe.
    Extend this to verify DB / external service connectivity if needed.
    """
    return {"status": "ready"}
