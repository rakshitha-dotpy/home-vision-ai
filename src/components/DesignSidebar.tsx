import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

type Mood = "calm" | "luxury" | "cozy" | "energy";

const moods: { id: Mood; label: string; emoji: string }[] = [
  { id: "calm", label: "Calm", emoji: "🌿" },
  { id: "luxury", label: "Luxury", emoji: "✨" },
  { id: "cozy", label: "Cozy", emoji: "🛋️" },
  { id: "energy", label: "Energy", emoji: "⚡" },
];

const styles = ["Modern", "Minimal", "Japandi", "Boho", "Classic"];

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

  const formatBudget = (v: number) =>
    `₹${v.toLocaleString("en-IN")}`;

  return (
    <aside className="w-full lg:w-[320px] shrink-0 glass-panel border-t-0 border-l-0 border-b-0 p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Upload */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Upload Room</h3>
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
          className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden ${
            dragActive ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20"
          } ${image ? "h-40" : "h-32"}`}
        >
          {image ? (
            <img src={image} alt="Room preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
              <Upload className="w-6 h-6" />
              <span className="text-xs">Drop image or click to upload</span>
            </div>
          )}
        </div>
      </section>

      {/* Mood */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Select Mood</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => handleMood(m.id)}
              className={`glass-card p-3 text-center transition-all duration-300 active:scale-[0.96] ${
                mood === m.id
                  ? "border-primary/60 glow-primary"
                  : "hover:border-white/15 hover:bg-white/[0.06]"
              }`}
            >
              <span className="text-xl block mb-1">{m.emoji}</span>
              <span className="text-xs font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Budget */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
          <span className="text-sm font-semibold text-success">{formatBudget(budget)}</span>
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
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
          <span>₹5,000</span>
          <span>₹1,00,000</span>
        </div>
      </section>

      {/* Style */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Style</h3>
        <div className="flex flex-wrap gap-2">
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-[0.96] ${
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

      {/* Generate */}
      <button
        onClick={() => onGenerate({ mood, budget, style, image })}
        disabled={isGenerating}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm gradient-primary text-primary-foreground
          transition-all duration-200 active:scale-[0.97] hover:shadow-lg hover:shadow-primary/20
          disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          "Generate My Design"
        )}
      </button>
    </aside>
  );
}
