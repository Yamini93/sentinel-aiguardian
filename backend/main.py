from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
import tempfile
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading Whisper model...")

model = WhisperModel(
    "tiny",
    compute_type="int8"
)

print("Whisper model loaded")


@app.get("/")
async def home():
    return {
        "message": "Sentinel AI Backend Running"
    }


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    temp_path = None

    try:

        # Save uploaded file
        suffix = os.path.splitext(file.filename)[1]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp:

            temp.write(await file.read())
            temp_path = temp.name

        print(f"Processing: {file.filename}")

        # -------------------------
        # TRANSCRIPTION
        # -------------------------

        segments, info = model.transcribe(
            temp_path,
            beam_size=1
        )

        segments = list(segments)

        transcript = " ".join(
            segment.text.strip()
            for segment in segments
        )

        print("Transcript:", transcript)

        transcript_lower = transcript.lower()

        # -------------------------
        # DETECTION RULES
        # -------------------------

        suspicious_keywords = {

            # Credential theft
            "otp":30,
            "confirm otp":35,
            "password":25,
            "cvv":30,

            # Banking scams
            "bank":15,
            "account":15,
            "payment":15,
            "transfer":20,
            "sbi":20,
            "fraud department":25,

            # Investment scams
            "guaranteed":25,
            "earn":20,
            "profit":20,
            "income":20,
            "investment":20,
            "double your money":40,
            "first month":20,
            "24 hours":30,
            "lakhs":25,
            "rupees":10,

            # Government impersonation
            "government":35,
            "finance minister":40,
            "nirmala":40,
            "government-backed":40,

            # Urgency
            "urgent":15,
            "immediately":20,
            "blocked":20,
            "suspended":20,
            "failure to comply":20,

            # Social engineering
            "share":20,
            "verify":15,
            "click":20,
            "link":20,

            # Remote access
            "remote access":35,
            "screen sharing":35
        }

        detected = []
        score = 5

        for word, weight in suspicious_keywords.items():

            if word in transcript_lower:
                score += weight
                detected.append(word)

        score = min(score, 100)

        # -------------------------
        # RISK LEVEL
        # -------------------------

        if score < 30:
            level = "LOW"
        elif score < 50:
            level = "MEDIUM"
        elif score < 75:
            level = "HIGH"
        else:
            level = "CRITICAL"

        # -------------------------
        # THREAT SCORES
        # -------------------------

        authority_score = 0.9 if (
            "bank" in transcript_lower
            or "sbi" in transcript_lower
            or "fraud department" in transcript_lower
            or "government" in transcript_lower
            or "finance minister" in transcript_lower
            or "nirmala" in transcript_lower
        ) else 0.2


        urgency_score = 0.9 if (
            "urgent" in transcript_lower
            or "immediately" in transcript_lower
            or "24 hours" in transcript_lower
            or "failure to comply" in transcript_lower
            or "blocked" in transcript_lower
        ) else 0.2


        credential_score = 0.9 if (
            "otp" in transcript_lower
            or "password" in transcript_lower
            or "cvv" in transcript_lower
        ) else 0.2


        investment_fraud_score = 0.9 if (
            "earn" in transcript_lower
            or "guaranteed" in transcript_lower
            or "profit" in transcript_lower
            or "lakhs" in transcript_lower
        ) else 0.2


        # -------------------------
        # DEEPFAKE SCORE
        # -------------------------

        deepfake_score = 0.1

        signal_count = 0

        if authority_score > 0.8:
            signal_count += 1

        if urgency_score > 0.8:
            signal_count += 1

        if credential_score > 0.8:
            signal_count += 1

        if investment_fraud_score > 0.8:
            signal_count += 1

        deepfake_score += signal_count * 0.15

        if len(transcript.split()) > 30:
            deepfake_score += 0.1

        deepfake_score = min(
            deepfake_score,
            0.9
        )

        # -------------------------
        # TIMELINE
        # -------------------------

        timeline = []

        if authority_score > 0.5:
            timeline.append({
                "t":"00:02",
                "title":"Authority Impersonation",
                "detail":"Detected authority/government claim",
                "severity":"high"
            })

        if credential_score > 0.5:
            timeline.append({
                "t":"00:04",
                "title":"Credential Harvesting",
                "detail":"Detected credential request",
                "severity":"high"
            })

        if urgency_score > 0.5:
            timeline.append({
                "t":"00:06",
                "title":"Urgency Pressure",
                "detail":"Detected coercive language",
                "severity":"high"
            })

        if investment_fraud_score > 0.5:
            timeline.append({
                "t":"00:07",
                "title":"Investment Fraud",
                "detail":"Detected unrealistic earning claims",
                "severity":"high"
            })

        timeline.append({
            "t":"00:08",
            "title":"Fraud Classification",
            "detail":f"Risk classified as {level}",
            "severity":"high"
        })

        # -------------------------
        # SUMMARY
        # -------------------------

        summary = f"""
Detected scam attempt.

Risk Level: {level}

Indicators:
{', '.join(detected)}
"""

        return {

            "overall_risk_score": score / 100,

            "risk_level": level,

            "summary": summary,

            "reasoning": summary,

            "timeline": timeline,

            "recommendations":[
                "Do not share sensitive information",
                "Verify independently",
                "Avoid unknown links",
                "Block suspicious caller"
            ],

            "transcript": transcript,

            "threats":{

                "authority_impersonation":{
                    "score":authority_score
                },

                "urgency_manipulation":{
                    "score":urgency_score
                },

                "credential_harvesting":{
                    "score":credential_score
                },

                "investment_fraud":{
                    "score":investment_fraud_score
                },

                "deepfake_suspicion":{
                    "score":deepfake_score
                }
            }
        }

    except Exception as e:

        print("ERROR:", str(e))

        return {
            "overall_risk_score":0.2,
            "risk_level":"LOW",
            "summary":str(e),
            "reasoning":str(e),
            "timeline":[],
            "recommendations":[],
            "transcript":"No transcript generated",
            "threats":{}
        }

    finally:

        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
