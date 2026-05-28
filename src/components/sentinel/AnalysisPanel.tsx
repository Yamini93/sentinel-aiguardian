import { Brain, FileText, ListChecks, AudioWaveform } from "lucide-react";
import { useState } from "react";

interface Props {
  transcript: string;
  reasoning: string;
  actions: string[];
}

const TABS = [
  { id: "transcript", label: "Transcript", icon: FileText },
  { id: "reasoning", label: "AI Reasoning", icon: Brain },
  { id: "actions", label: "Recommended Actions", icon: ListChecks },
] as const;

export function AnalysisPanel({ transcript, reasoning, actions }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("transcript");

  return (
    <section className="glow-card rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyber/10 border border-cyber/30">
            <Brain className="h-4 w-4 text-cyber" />
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-widest text-cyber uppercase">02 / Cognition</div>
            <h2 className="text-base font-bold">AI Analysis Panel</h2>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <AudioWaveform className="h-3.5 w-3.5 text-cyber" />
          MODEL: SENTINEL-CORE v4.2
        </div>
      </div>

      <div className="flex border-b border-border/60">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
                active ? "text-cyber" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
              {active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-cyber" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-6 min-h-[280px]">
        {tab === "transcript" && (
          <div className="space-y-3 font-mono text-sm leading-relaxed text-muted-foreground">
            {transcript.split("\n").filter(Boolean).map((line, i) => (
              <div key={i} className="flex gap-4 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="text-cyber/60 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-foreground/90">{line}</span>
              </div>
            ))}
          </div>
        )}
        {tab === "reasoning" && (
          <div className="prose prose-invert max-w-none">
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{reasoning}</p>
          </div>
        )}
        {tab === "actions" && (
          <ul className="space-y-3">
            {actions.map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="font-mono text-xs text-cyber mt-0.5 shrink-0">→ {String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm">{a}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
