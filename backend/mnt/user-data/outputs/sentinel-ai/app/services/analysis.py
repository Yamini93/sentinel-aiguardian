@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    return {
        "overall_risk_score": 0.95,
        "risk_level": "CRITICAL",
        "transcript": "TEST TRANSCRIPT: This is a fake bank call asking for OTP and CVV.",
        "summary": "Detected high confidence fraud indicators",
        "recommendations": [
            "Do not share OTP",
            "Block caller"
        ],
        "threats": {
            "authority_impersonation": {
                "score": 0.95
            },
            "urgency_manipulation": {
                "score": 0.90
            },
            "deepfake_suspicion": {
                "score": 0.70
            }
        }
    }
