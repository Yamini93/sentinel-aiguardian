import { AlertCircle, Clock } from "lucide-react";

export interface TimelineEvent {
  t: string; // mm:ss
  title: string;
  detail: string;
  severity: "low" | "med" | "high";
}

export function ThreatTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <section className="glow-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-mono text-xs tracking-widest text-cyber uppercase">03 / Forensic Timeline</div>
          <h2 className="text-lg font-bold mt-0.5">Detected threat events</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {events.length} EVENTS
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[88px] top-2 bottom-2 w-px bg-gradient-to-b from-cyber/40 via-border to-transparent" />
        <ul className="space-y-5">
          {events.map((e, i) => {
            const c =
              e.severity === "high" ? "var(--danger)" :
              e.severity === "med" ? "var(--warning)" : "var(--cyber)";
            return (
              <li
                key={i}
                className="relative flex gap-5 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-[72px] shrink-0 text-right">
                  <div className="font-mono text-sm text-foreground">{e.t}</div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">timestamp</div>
                </div>
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 z-10"
                  style={{
                    background: `color-mix(in oklab, ${c} 15%, var(--background))`,
                    borderColor: c,
                    boxShadow: `0 0 20px color-mix(in oklab, ${c} 50%, transparent)`,
                  }}
                >
                  <AlertCircle className="h-4 w-4" style={{ color: c }} />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{e.title}</h4>
                    <span
                      className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ color: c, background: `color-mix(in oklab, ${c} 10%, transparent)` }}
                    >
                      {e.severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{e.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
