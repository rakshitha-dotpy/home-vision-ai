import { useState, useCallback } from "react";
import { Upload, Camera, Check } from "lucide-react";

type Mood = "calm" | "luxury" | "cozy" | "energy";

const moods: { id: Mood; label: string; emoji: string }[] = [
  { id: "calm", label: "Calm", emoji: "🌿" },
  { id: "luxury", label: "Luxury", emoji: "✨" },
  { id: "cozy", label: "Cozy", emoji: "🛋️" },
  { id: "energy", label: "Energy", emoji: "⚡" },
];

const styles = ["Modern", "Minimal", "Japandi", "Boho", "Classic"];

const steps = [
  { num: 1, label: "Upload Room" },
  { num: 2, label: "Choose Mood" },
  { num: 3, label: "Set Budget" },
  { num: 4, label: "Generate" },
];

interface Props {
  onGenerate: (config: { mood: Mood; budget: number; style: string; image: string | null }) => void;
  isGenerating: boolean;
}

export default function DesignSidebar({ onGenerate, isGenerating }: Props) {
  const [mood, setMood] = useState<Mood>("calm");
  const [budget, setBudget] = useState(25000);
  const [style, setStyle] = useState("Modern");
  const [image, setImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const currentStep = image ? (mood ? (budget ? 4 : 3) : 2) : 1;

  const handleMood = useCallback((m: Mood) => {
    setMood(m);
    document.body.className = `mood-${m}`;
  }, []);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const formatBudget = (v: number) => `₹${v.toLocaleString("en-IN")}`;

  return (
    <aside className="w-full lg:w-[340px] shrink-0 glass-panel border-t-0 border-l-0 border-b-0 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Step progress */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-1">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex items-center gap-1.5 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-500 ${
                    s.num < currentStep
                      ? "bg-success/20 text-success"
                      : s.num === currentStep
                      ? "gradient-primary text-primary-foreground glow-primary"
                      : "bg-white/5 text-muted-foreground"
                  }`}
                >
                  {s.num < currentStep ? <Check className="w-3 h-3" /> : s.num}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 transition-colors duration-500 ${s.num < currentStep ? "bg-success/30" : "bg-white/5"}`} />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {steps.map((s) => (
            <span key={s.num} className={`text-[9px] transition-colors duration-300 ${s.num <= currentStep ? "text-foreground/60" : "text-muted-foreground/40"}`}>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 pt-2 space-y-5">
        {/* Step 1: Upload */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 1</span>
            <span className="text-xs text-muted-foreground">Upload your room</span>
          </div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) handleFile(f);
              };
              input.click();
            }}
            className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
              dragActive ? "border-primary bg-primary/5 scale-[1.01]" : image ? "border-success/30" : "border-white/10 hover:border-white/20"
            } ${image ? "h-36" : "h-28"}`}
          >
            {image ? (
              <>
                <img src={image} alt="Room preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-success" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-[11px]">Drop a photo of your room</span>
              </div>
            )}
          </div>
        </section>

        {/* Step 2: Mood */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 2</span>
            <span className="text-xs text-muted-foreground">How should it feel?</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {moods.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMood(m.id)}
                className={`glass-card py-2.5 px-1 text-center transition-all duration-300 active:scale-[0.94] ${
                  mood === m.id
                    ? "border-primary/60 glow-primary bg-primary/5"
                    : "hover:border-white/15 hover:bg-white/[0.06]"
                }`}
              >
                <span className="text-lg block">{m.emoji}</span>
                <span className="text-[10px] font-medium mt-0.5 block">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 3: Budget + Style */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 3</span>
            <span className="text-xs text-muted-foreground">Budget & style</span>
          </div>

          <div className="glass-card p-3.5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Budget</span>
              <span className="text-sm font-bold text-success">{formatBudget(budget)}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={100000}
              step={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-success [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-110"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>₹5,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 active:scale-[0.95] ${
                  style === s
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "glass-panel hover:bg-white/[0.06]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Step 4: Generate */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 4</span>
            <span className="text-xs text-muted-foreground">See the magic</span>
          </div>
          <button
            onClick={() => onGenerate({ mood, budget, style, image })}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl font-semibold text-sm gradient-primary text-primary-foreground
              transition-all duration-200 active:scale-[0.97] hover:shadow-lg hover:shadow-primary/25
              disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              <>
                <span className="relative z-10">✨ Generate My Design</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              </>
            )}
          </button>
        </section>
      </div>
    </aside>
  );
}
