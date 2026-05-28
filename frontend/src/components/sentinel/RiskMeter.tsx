import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";

interface Props {
  score: number; // 0-100
  label: string;
}

export function RiskMeter({ score, label }: Props) {
  const level = score >= 70 ? "critical" : score >= 40 ? "elevated" : "low";
  const color = level === "critical" ? "var(--danger)" : level === "elevated" ? "var(--warning)" : "var(--safe)";
  const Icon = level === "critical" ? ShieldAlert : level === "elevated" ? AlertTriangle : ShieldCheck;

  // arc
  const radius = 90;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="glow-card rounded-2xl p-6 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <div className="font-mono text-xs tracking-widest text-cyber uppercase">{label}</div>
        <div
          className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full border"
          style={{ color, borderColor: `color-mix(in oklab, ${color} 40%, transparent)`, background: `color-mix(in oklab, ${color} 10%, transparent)` }}
        >
          {level}
        </div>
      </div>

      <div className="relative w-[240px] h-[140px] mt-4">
        <svg viewBox="0 0 240 140" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="riskGrad" x1="0%" x2="100%">
              <stop offset="0%" stopColor="oklch(0.75 0.20 155)" />
              <stop offset="50%" stopColor="oklch(0.82 0.18 75)" />
              <stop offset="100%" stopColor="oklch(0.68 0.26 22)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path
            d="M 30 120 A 90 90 0 0 1 210 120"
            fill="none"
            stroke="oklch(0.30 0.03 250)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 30 120 A 90 90 0 0 1 210 120"
            fill="none"
            stroke="url(#riskGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter="url(#glow)"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)" }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-2 text-center">
          <div className="font-mono text-5xl font-bold" style={{ color }}>{score}</div>
          <div className="text-xs text-muted-foreground font-mono">/ 100 RISK INDEX</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm" style={{ color }}>
        <Icon className="h-4 w-4" />
        {level === "critical" && "Immediate intervention advised"}
        {level === "elevated" && "Human review recommended"}
        {level === "low" && "No adversarial intent detected"}
      </div>
    </div>
  );
}
