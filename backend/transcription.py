"""
app/services/transcription.py
──────────────────────────────
Handles audio extraction and transcription via the OpenAI Whisper API.

For video files the audio is first stripped using ffmpeg (must be installed);
for audio-only files the bytes are sent directly.
"""

import io
import subprocess
import tempfile
from pathlib import Path

from openai import AsyncOpenAI

from app.config import settings

# Shared async OpenAI client (one per process is ideal)
_client = AsyncOpenAI(api_key=settings.openai_api_key)


async def transcribe(file_bytes: bytes, filename: str, content_type: str) -> dict:
    """
    Transcribe audio/video content.

    Parameters
    ----------
    file_bytes   : Raw bytes of the uploaded file.
    filename     : Original filename (used to hint the format to the API).
    content_type : MIME type from the multipart upload.

    Returns
    -------
    dict with keys:
        text        – full transcript string
        language    – detected ISO 639-1 language code (may be None)
        duration    – duration in seconds reported by Whisper (may be None)
    """

    is_video = content_type.startswith("video/")

    if is_video:
        # ── Extract audio track from video using ffmpeg ───────────────────
        audio_bytes = _extract_audio_from_video(file_bytes, filename)
        send_filename = Path(filename).stem + ".mp3"
    else:
        audio_bytes = file_bytes
        send_filename = filename

    # ── Call the Whisper API ──────────────────────────────────────────────
    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = send_filename          # OpenAI SDK reads .name for format

    response = await _client.audio.transcriptions.create(
        model=settings.whisper_model,
        file=audio_file,
        response_format="verbose_json",      # gives us language + duration
        timestamp_granularities=["segment"], # optional; useful for future features
    )

    return {
        "text": response.text,
        "language": getattr(response, "language", None),
        "duration": getattr(response, "duration", None),
    }


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _extract_audio_from_video(video_bytes: bytes, filename: str) -> bytes:
    """
    Use ffmpeg to strip the audio track from a video and return MP3 bytes.
    ffmpeg must be installed on the server (it is free and widely available).
    """

    suffix = Path(filename).suffix or ".mp4"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp_in:
        tmp_in.write(video_bytes)
        tmp_in_path = tmp_in.name

    tmp_out_path = tmp_in_path.replace(suffix, "_audio.mp3")

    try:
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", tmp_in_path,
                "-vn",                       # no video
                "-acodec", "libmp3lame",
                "-ar", "16000",              # 16 kHz — Whisper optimal
                "-ac", "1",                  # mono
                "-b:a", "64k",
                tmp_out_path,
            ],
            check=True,
            capture_output=True,
        )

        with open(tmp_out_path, "rb") as f:
            return f.read()

    except subprocess.CalledProcessError as exc:
        raise RuntimeError(
            f"ffmpeg audio extraction failed: {exc.stderr.decode(errors='replace')}"
        ) from exc

    finally:
        Path(tmp_in_path).unlink(missing_ok=True)
        Path(tmp_out_path).unlink(missing_ok=True)
