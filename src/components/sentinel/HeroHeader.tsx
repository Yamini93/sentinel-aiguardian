import { Shield, Activity } from "lucide-react";

export function HeroHeader() {
  return (
    <header className="relative overflow-hidden border-b border-border/40">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
        <div className="h-full w-1/3 scan-line" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-cyber shadow-glow">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-mono text-xs tracking-[0.3em] text-cyber uppercase">Sentinel</div>
              <div className="text-sm font-semibold -mt-0.5">AI Defense Grid</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="relative text-safe">
                <span className="pulse-dot block h-1.5 w-1.5 rounded-full bg-safe" />
              </span>
              <span className="ml-3">SYSTEM ONLINE</span>
            </span>
            <span>NODE: SEN-04.GLOBAL</span>
            <span className="flex items-center gap-1.5"><Activity className="h-3 w-3" /> 1.2M signals/s</span>
          </div>
        </nav>

        <div className="mt-20 mb-16 max-w-4xl animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber/30 bg-cyber/5 px-3 py-1 text-xs font-mono text-cyber mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-cyber animate-pulse" />
            REAL-TIME AI THREAT INTELLIGENCE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-glow">
            Detect deepfakes. <br />
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Neutralize fraud.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Sentinel AI ingests any audio or video signal and returns a forensic-grade
            risk profile in seconds — transcript, threat vectors, deepfake probability
            and recommended response.
          </p>
        </div>
      </div>
    </header>
  );
}
