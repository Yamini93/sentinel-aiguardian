import { Fingerprint, PhoneCall, CreditCard, UserX, Link2, Skull, Mic } from "lucide-react";
import type { Threat } from "@/components/sentinel/ThreatBadges";
import type { TimelineEvent } from "@/components/sentinel/ThreatTimeline";

export interface AnalysisResult {
  fraudScore: number;
  deepfakeScore: number;
  transcript: string;
  reasoning: string;
  actions: string[];
  threats: Threat[];
  timeline: TimelineEvent[];
}

// Deterministic-ish mock so it feels real
export function generateAnalysis(file: File): AnalysisResult {
  const seed = (file.name.length + Math.floor(file.size / 1000)) % 100;
  const fraud = Math.min(95, 55 + (seed % 40));
  const deep = Math.min(98, 40 + ((seed * 3) % 50));

  return {
    fraudScore: fraud,
    deepfakeScore: deep,
    transcript: [
      "Hello, this is Daniel from your bank's fraud prevention team.",
      "We've detected three unauthorized wire transfers from your account in the last hour.",
      "To secure your funds, I need you to verify your full card number and CVV right now.",
      "Please do not hang up — this call is being recorded for your protection.",
      "If you don't act in the next ten minutes, your account will be permanently frozen.",
      "I can also walk you through installing a remote support tool so we can help directly.",
    ].join("\n"),
    reasoning:
      "Voice biometric fingerprint shows a 92% match to known synthetic-speech models (ElevenLabs / Tortoise family). " +
      "Prosody and breath patterns are statistically flat, consistent with neural TTS rather than a live speaker. " +
      "Linguistic content exhibits five high-confidence social-engineering markers: impersonation of authority, " +
      "manufactured urgency, threat of account loss, request for sensitive credentials, and a remote-access escalation path. " +
      "Cross-referencing the caller ID metadata against 14 OSINT feeds returned 3 prior fraud reports within 48 hours.",
    actions: [
      "Do not provide card number, CVV, OTP, or install any remote-access software.",
      "Terminate the call and independently re-dial your bank using the number on the back of your card.",
      "Report the incident to your national fraud authority and forward the audio to fraud@your-bank.com.",
      "Enable transaction alerts and freeze the affected card from your banking app.",
      "Submit this signal to Sentinel's threat-sharing network to inoculate other users.",
    ],
    threats: [
      { id: "1", label: "Voice Cloning", severity: "high", icon: Mic },
      { id: "2", label: "Impersonation", severity: "high", icon: UserX },
      { id: "3", label: "Card Harvesting", severity: "high", icon: CreditCard },
      { id: "4", label: "Urgency Pressure", severity: "med", icon: Skull },
      { id: "5", label: "Vishing", severity: "high", icon: PhoneCall },
      { id: "6", label: "Remote Access Lure", severity: "med", icon: Link2 },
      { id: "7", label: "Biometric Spoof", severity: "med", icon: Fingerprint },
    ],
    timeline: [
      { t: "00:02", title: "Synthetic voice signature detected", detail: "Neural TTS prosody markers exceed 0.91 confidence.", severity: "high" },
      { t: "00:08", title: "Authority impersonation", detail: "Caller claims affiliation with bank fraud team — unverifiable.", severity: "high" },
      { t: "00:21", title: "Credential harvesting attempt", detail: "Request for card number and CVV — never legitimate.", severity: "high" },
      { t: "00:34", title: "Urgency tactic deployed", detail: "Artificial 10-minute deadline introduced.", severity: "med" },
      { t: "00:47", title: "Remote-access escalation", detail: "Offer to install remote support tool — common scam vector.", severity: "high" },
      { t: "01:02", title: "Call ID mismatch flagged", detail: "Source number absent from official bank registry.", severity: "med" },
    ],
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
