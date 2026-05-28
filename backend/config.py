"""
app/config.py
─────────────
All environment-variable configuration lives here.
Uses pydantic-settings so values are validated at startup.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── OpenAI ────────────────────────────────────────────────────────────
    openai_api_key: str

    # ── Whisper ───────────────────────────────────────────────────────────
    whisper_model: str = "whisper-1"           # OpenAI Whisper API model name

    # ── GPT ───────────────────────────────────────────────────────────────
    gpt_model: str = "gpt-4o"                  # Model used for threat analysis

    # ── Upload limits ─────────────────────────────────────────────────────
    max_file_size_mb: int = 100                # Reject files larger than this
    allowed_audio_types: list[str] = [
        "audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg",
        "audio/webm", "audio/flac", "audio/x-m4a",
    ]
    allowed_video_types: list[str] = [
        "video/mp4", "video/webm", "video/ogg",
        "video/quicktime", "video/x-msvideo",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Single shared instance — import this everywhere
settings = Settings()
