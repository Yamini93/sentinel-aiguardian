import {
  UserX,
  Skull,
  Fingerprint,
  PhoneCall,
  CreditCard
} from "lucide-react";

export async function generateAnalysis(
  file: File
) {

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await fetch(
      "https://bacon-avon-feb-badly.trycloudflare.com/analyze",
      {
        method:"POST",
        body:formData
      }
    );

  if (!response.ok) {
    throw new Error(
      "Analysis failed"
    );
  }

  const data =
    await response.json();

  console.log(
    "Backend:",
    data
  );

  const threats = [];

  // Impersonation
  if (
    (data.threats?.authority_impersonation?.score ?? 0)
    > .5
  ) {
    threats.push({
      id:"1",
      label:"Impersonation",
      severity:"high",
      icon:UserX
    });
  }

  // Urgency
  if (
    (data.threats?.urgency_manipulation?.score ?? 0)
    > .5
  ) {
    threats.push({
      id:"2",
      label:"Urgency Pressure",
      severity:"high",
      icon:Skull
    });
  }

  // OTP
  if (
    (data.threats?.credential_harvesting?.score ?? 0)
    > .5
  ) {
    threats.push({
      id:"3",
      label:"OTP Harvesting",
      severity:"high",
      icon:PhoneCall
    });
  }

  // Bank fraud
  if (
    data.transcript
    ?.toLowerCase()
    ?.includes("bank")
    ||
    data.transcript
    ?.toLowerCase()
    ?.includes("account")
  ) {
    threats.push({
      id:"4",
      label:"Bank Fraud",
      severity:"high",
      icon:CreditCard
    });
  }
  
if (
  (data.threats?.investment_fraud?.score ?? 0) > .5
) {
  threats.push({
    id:"6",
    label:"Investment Fraud",
    severity:"high",
    icon:CreditCard
  });
}
  // Deepfake
  if (
    (data.threats?.deepfake_suspicion?.score ?? 0)
    > .5
  ) {
    threats.push({
      id:"5",
      label:"Voice Clone",
      severity:"med",
      icon:Fingerprint
    });
  }

  return {

    fraudScore:
      Math.round(
        (data.overall_risk_score ?? 0)
        * 100
      ),

    deepfakeScore:
      Math.round(
        (data.threats?.deepfake_suspicion?.score ?? 0)
        * 100
      ),

    transcript:
      data.transcript
      ?? "No transcript",

    reasoning:
      data.reasoning
      ?? data.summary
      ?? "No reasoning",

    actions:
      data.recommendations
      ?? [],

    timeline:
      data.timeline
      ?? [],

    threats
  };
}

export const STAGES = [
  "Buffering signal",
  "Extracting audio stream",
  "Neural transcription",
  "Voiceprint fingerprinting",
  "Deepfake adversarial probe",
  "Social-engineering NLP scan",
  "Cross-referencing threat intel",
  "Compiling forensic report",
];