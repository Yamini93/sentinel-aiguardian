# 🛡️ Sentinel AI — Backend

AI-powered audio/video threat detection API built with **FastAPI**, **OpenAI Whisper**, and **GPT-4o**.

Upload any phone call, voicemail, video, or paste a transcript — Sentinel AI returns a
detailed JSON threat report covering six social-engineering and deepfake dimensions.

---

## ✨ Detected Threat Dimensions

| Dimension | What it catches |
|---|---|
| **Scam Probability** | General fraud / scam likelihood |
| **Urgency Manipulation** | "Act now or face arrest / account closure" |
| **Authority Impersonation** | Fake IRS, bank, tech support, police, etc. |
| **Credential Harvesting** | Requests for passwords, OTPs, SSN, bank details |
| **Emotional Coercion** | Fear, guilt, shame used as levers |
| **Deepfake Suspicion** | Linguistic markers of synthetic/AI-generated speech |

---

## 🗂️ Project Structure

```
sentinel-ai/
├── app/
│   ├── main.py                  # FastAPI app factory + middleware
│   ├── config.py                # Env-var configuration (pydantic-settings)
│   ├── models/
│   │   └── schemas.py           # Pydantic request/response models
│   ├── routers/
│   │   ├── health.py            # GET /health, GET /ready
│   │   └── analysis.py          # POST /analyze, POST /analyze/text
│   ├── services/
│   │   ├── transcription.py     # Whisper API integration
│   │   └── analysis.py          # GPT-4o threat analysis + prompt
│   └── utils/
│       └── file_validation.py   # MIME type + size guards
├── tests/
│   └── test_analysis_router.py  # Pytest integration tests
├── .env.example                 # Environment variable template
├── requirements.txt
└── README.md
```

---

## 🚀 Quick Start (5 steps)

### 1. Clone & enter the project

```bash
git clone <your-repo-url>
cd sentinel-ai
```

### 2. Create a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure your API key

```bash
cp .env.example .env
# Open .env and set: OPENAI_API_KEY=sk-...your-key...
```

### 5. Start the server

```bash
uvicorn app.main:app --reload
```

The API is now running at **http://localhost:8000**

📖 Interactive docs: **http://localhost:8000/docs**

---

## 📡 API Endpoints

### `POST /api/v1/analyze`
Upload an audio or video file for full transcription + analysis.

```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -F "file=@/path/to/call.mp3"
```

**Supported formats:** mp3, mp4, wav, ogg, webm, flac, m4a, mov, avi

---

### `POST /api/v1/analyze/text`
Analyse a pre-existing transcript (skips Whisper; great for testing).

```bash
curl -X POST http://localhost:8000/api/v1/analyze/text \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Your Social Security number has been suspended. Call us immediately.",
    "filename": "test.txt"
  }'
```

---

### `GET /api/v1/health` · `GET /api/v1/ready`
Liveness and readiness probes.

---

## 📦 Example Response

```json
{
  "filename": "suspicious_call.mp3",
  "content_type": "audio/mpeg",
  "duration_seconds": 47.3,
  "transcript": "Hello, this is Officer Johnson from the IRS...",
  "transcript_language": "en",
  "overall_risk_score": 0.94,
  "risk_level": "CRITICAL",
  "summary": "This recording exhibits strong indicators of an IRS impersonation scam...",
  "recommendations": [
    "Do not call back any number provided.",
    "Report to the FTC at reportfraud.ftc.gov",
    "Block this number."
  ],
  "threats": {
    "scam_probability":        { "score": 0.97, "confidence": 0.95, "evidence": [...], "explanation": "..." },
    "urgency_manipulation":    { "score": 0.92, "confidence": 0.90, "evidence": [...], "explanation": "..." },
    "authority_impersonation": { "score": 0.96, "confidence": 0.94, "evidence": [...], "explanation": "..." },
    "credential_harvesting":   { "score": 0.88, "confidence": 0.85, "evidence": [...], "explanation": "..." },
    "emotional_coercion":      { "score": 0.89, "confidence": 0.87, "evidence": [...], "explanation": "..." },
    "deepfake_suspicion":      { "score": 0.45, "confidence": 0.55, "evidence": [...], "explanation": "..." }
  }
}
```

---

## 🧪 Running Tests

```bash
pip install pytest pytest-asyncio
pytest tests/ -v
```

> ⚠️ Integration tests make real OpenAI API calls. Ensure `OPENAI_API_KEY` is set in `.env`.

---

## 🔧 Configuration

All settings are in `.env`. Here are the available options:

| Variable | Default | Description |
|---|---|---|
| `OPENAI_API_KEY` | *(required)* | Your OpenAI API key |
| `WHISPER_MODEL` | `whisper-1` | Whisper model name |
| `GPT_MODEL` | `gpt-4o` | GPT model for analysis |
| `MAX_FILE_SIZE_MB` | `100` | Max upload size in MB |

---

## 🖥️ System Requirements

- **Python 3.11+**
- **ffmpeg** — required for video file support

  ```bash
  # macOS
  brew install ffmpeg

  # Ubuntu / Debian
  sudo apt install ffmpeg

  # Windows (via Chocolatey)
  choco install ffmpeg
  ```

---

## 🔒 Security Notes

- Never commit `.env` to version control (it's in `.gitignore` by default).
- In production, set `allow_origins` in `main.py` to your frontend domain.
- Consider rate-limiting `/analyze` to prevent API cost abuse.
- File bytes are processed in-memory and never persisted to disk (except temporary ffmpeg files which are deleted immediately).

---

## 📄 License

MIT — use freely, attribute kindly.
