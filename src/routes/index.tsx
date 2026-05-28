import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeroHeader } from "@/components/sentinel/HeroHeader";
import { UploadPanel } from "@/components/sentinel/UploadPanel";
import { RiskMeter } from "@/components/sentinel/RiskMeter";
import { ThreatBadges } from "@/components/sentinel/ThreatBadges";
import { AnalysisPanel } from "@/components/sentinel/AnalysisPanel";
import { ThreatTimeline } from "@/components/sentinel/ThreatTimeline";
import { generateAnalysis, STAGES, type AnalysisResult } from "@/lib/sentinel-mock";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sentinel AI — Cybersecurity Threat Intelligence" },
      { name: "description", content: "Sentinel AI detects deepfakes, voice clones, and fraud attempts in any audio or video signal. Forensic-grade analysis in seconds." },
      { property: "og:title", content: "Sentinel AI — Cybersecurity Threat Intelligence" },
      { property: "og:description", content: "Forensic-grade deepfake and fraud detection for audio and video." },
    ],
  }),
});

function Index() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(STAGES[0]);

  const analyze = (file: File) => {
    setIsAnalyzing(true);
    setResult(null);
    setProgress(0);
    let step = 0;
    const total = STAGES.length;
    const tick = () => {
      step++;
      setStage(STAGES[Math.min(step, total - 1)]);
      setProgress((step / total) * 100);
      if (step >= total) {
        setTimeout(() => {
          setResult(generateAnalysis(file));
          setIsAnalyzing(false);
        }, 350);
        return;
      }
      setTimeout(tick, 380 + Math.random() * 250);
    };
    setTimeout(tick, 300);
  };

  return (
    <main className="min-h-screen">
      <HeroHeader />

      <div className="mx-auto max-w-7xl px-6 py-12 space-y-8">
        <UploadPanel onAnalyze={analyze} isAnalyzing={isAnalyzing} progress={progress} stage={stage} />

        {result && (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <RiskMeter score={result.fraudScore} label="Scam / Fraud Risk" />
              <RiskMeter score={result.deepfakeScore} label="Deepfake Suspicion" />
            </div>

            <ThreatBadges threats={result.threats} />

            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <AnalysisPanel
                  transcript={result.transcript}
                  reasoning={result.reasoning}
                  actions={result.actions}
                />
              </div>
              <div className="lg:col-span-2">
                <ThreatTimeline events={result.timeline} />
              </div>
            </div>
          </>
        )}

        {!result && !isAnalyzing && <EmptyState />}
      </div>

      <footer className="border-t border-border/40 mt-16">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-cyber" />
            SENTINEL AI · CLASSIFIED · FOR AUTHORIZED OPERATORS
          </div>
          <div>© {new Date().getFullYear()} SENTINEL DEFENSE GRID — ALL SIGNALS MONITORED</div>
        </div>
      </footer>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="glow-card rounded-2xl p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyber/10 border border-cyber/30 mb-4">
        <Shield className="h-6 w-6 text-cyber" />
      </div>
      <h3 className="text-lg font-bold">Awaiting signal</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
        Upload an audio or video file above to begin a full forensic analysis. Sentinel will return
        transcript, deepfake probability, threat vectors and recommended response.
      </p>
    </div>
  );
}
