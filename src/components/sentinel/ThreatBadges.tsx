import type { LucideIcon } from "lucide-react";
import { Fingerprint, PhoneCall, CreditCard, Mic, UserX, Link2, Zap, Skull } from "lucide-react";

export interface Threat {
  id: string;
  label: string;
  severity: "low" | "med" | "high";
  icon: LucideIcon;
}

const ICONS = { Fingerprint, PhoneCall, CreditCard, Mic, UserX, Link2, Zap, Skull };

export function ThreatBadges({ threats }: { threats: Threat[] }) {
  return (
    <div className="glow-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-mono text-xs tracking-widest text-cyber uppercase">Threat Vectors</div>
          <h3 className="text-lg font-bold mt-0.5">{threats.length} indicators detected</h3>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {threats.map((t) => {
          const Icon = t.icon;
          const c =
            t.severity === "high" ? "var(--danger)" :
            t.severity === "med" ? "var(--warning)" : "var(--cyber)";
          return (
            <div
              key={t.id}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-mono"
              style={{
                color: c,
                borderColor: `color-mix(in oklab, ${c} 40%, transparent)`,
                background: `color-mix(in oklab, ${c} 8%, transparent)`,
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label.toUpperCase()}
              <span className="opacity-60">·</span>
              <span className="uppercase tracking-wider">{t.severity}</span>
            </div>
          );
        })}
        {threats.length === 0 && (
          <div className="text-sm text-muted-foreground">No threat vectors identified.</div>
        )}
      </div>
    </div>
  );
}

export { ICONS as ThreatIcons };
