import type { LucideIcon } from "lucide-react";
import {
  Fingerprint,
  PhoneCall,
  CreditCard,
  Mic,
  UserX,
  Link2,
  Zap,
  Skull,
  ShieldAlert,
} from "lucide-react";

export interface Threat {
  id: string;
  label: string;
  severity: "low" | "med" | "high";
  icon?: LucideIcon | string;
}

const ICONS = {
  Fingerprint,
  PhoneCall,
  CreditCard,
  Mic,
  UserX,
  Link2,
  Zap,
  Skull,
};

export function ThreatBadges({ threats }: { threats: Threat[] }) {
  return (
    <div className="glow-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-mono text-xs tracking-widest text-cyber uppercase">
            Threat Vectors
          </div>
          <h3 className="text-lg font-bold mt-0.5">
            {threats.length} indicators detected
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {threats.map((t, i) => {
          const severity = t.severity ?? "med";

          const Icon =
            typeof t.icon === "string"
              ? ICONS[t.icon as keyof typeof ICONS] || ShieldAlert
              : t.icon || ShieldAlert;

          const c =
            severity === "high"
              ? "var(--danger)"
              : severity === "med"
              ? "var(--warning)"
              : "var(--cyber)";

          return (
            <div
              key={t.id ?? i}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-mono"
              style={{
                color: c,
                borderColor: `color-mix(in oklab, ${c} 40%, transparent)`,
                background: `color-mix(in oklab, ${c} 8%, transparent)`,
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              {(t.label ?? "Unknown Threat").toUpperCase()}
              <span className="opacity-60">·</span>
              <span className="uppercase tracking-wider">
                {severity}
              </span>
            </div>
          );
        })}

        {threats.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No threat vectors identified.
          </div>
        )}
      </div>
    </div>
  );
}

export { ICONS as ThreatIcons };