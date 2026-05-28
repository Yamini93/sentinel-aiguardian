"""
app/utils/file_validation.py
─────────────────────────────
Utility functions for validating uploaded files before processing.
Keeps validation logic out of the router so it stays testable.
"""

from fastapi import HTTPException, UploadFile

from app.config import settings

# Combine allowed types for easy lookup
ALLOWED_TYPES: set[str] = set(
    settings.allowed_audio_types + settings.allowed_video_types
)

MAX_BYTES = settings.max_file_size_mb * 1024 * 1024  # Convert MB → bytes


async def validate_and_read(file: UploadFile) -> tuple[bytes, str]:
    """
    Validate an uploaded file and return its bytes + content type.

    Raises HTTPException (400) if:
      - content type is not audio or video
      - file exceeds the configured size limit

    Returns
    -------
    (file_bytes, content_type)
    """

    content_type = file.content_type or ""

    # ── MIME-type check ───────────────────────────────────────────────────
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=(
                f"Unsupported file type '{content_type}'. "
                f"Accepted types: {', '.join(sorted(ALLOWED_TYPES))}"
            ),
        )

    # ── Read bytes ────────────────────────────────────────────────────────
    file_bytes = await file.read()

    # ── Size check ────────────────────────────────────────────────────────
    if len(file_bytes) > MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail=(
                f"File too large ({len(file_bytes) / 1_048_576:.1f} MB). "
                f"Maximum allowed: {settings.max_file_size_mb} MB."
            ),
        )

    return file_bytes, content_type
