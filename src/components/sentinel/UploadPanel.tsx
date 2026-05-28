import { useRef, useState } from "react";
import { Upload, FileAudio, FileVideo, Loader2, Sparkles, X } from "lucide-react";

interface Props {
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
  progress: number;
  stage: string;
}

export function UploadPanel({ onAnalyze, isAnalyzing, progress, stage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);

  const pick = (f: File | undefined | null) => {
    if (!f) return;
    setFile(f);
  };

  return (
    <section className="glow-card rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-mono text-xs tracking-widest text-cyber uppercase">01 / Ingest</div>
          <h2 className="text-2xl font-bold mt-1">Upload signal for analysis</h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-cyber" />
          AI pipeline ready
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault(); setDrag(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all ${
          drag ? "border-cyber bg-cyber/5" : "border-border hover:border-cyber/50 hover:bg-cyber/[0.02]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,video/*"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />

        {!file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyber/10 border border-cyber/30">
              <Upload className="h-6 w-6 text-cyber" />
            </div>
            <div>
              <div className="font-semibold">Drop audio or video file</div>
              <div className="text-sm text-muted-foreground mt-1">
                MP3 · WAV · MP4 · MOV · WEBM — up to 500MB
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><FileAudio className="h-3.5 w-3.5" /> AUDIO</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5"><FileVideo className="h-3.5 w-3.5" /> VIDEO</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyber/15 border border-cyber/30">
              {file.type.startsWith("video") ? (
                <FileVideo className="h-5 w-5 text-cyber" />
              ) : (
                <FileAudio className="h-5 w-5 text-cyber" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{file.name}</div>
              <div className="text-xs font-mono text-muted-foreground mt-0.5">
                {(file.size / (1024 * 1024)).toFixed(2)} MB · {file.type || "unknown"}
              </div>
            </div>
            {!isAnalyzing && (
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {isAnalyzing && (
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-cyber">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {stage}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-cyber transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          disabled={!file || isAnalyzing}
          onClick={() => file && onAnalyze(file)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-cyber px-6 py-3 font-semibold text-primary-foreground shadow-glow disabled:opacity-40 disabled:shadow-none hover:brightness-110 transition"
        >
          {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isAnalyzing ? "Analyzing signal…" : "Run AI Analysis"}
        </button>
        <button
          disabled={isAnalyzing}
          onClick={() => { setFile(null); }}
          className="rounded-lg border border-border px-6 py-3 font-medium text-muted-foreground hover:text-foreground hover:border-cyber/40 transition"
        >
          Clear
        </button>
      </div>
    </section>
  );
}
