import { useState, useCallback } from "react";
import { Upload, Camera, Check, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import styleModern from "@/assets/style-modern.jpg";
import styleMinimal from "@/assets/style-minimal.jpg";
import styleJapandi from "@/assets/style-japandi.jpg";
import styleBoho from "@/assets/style-boho.jpg";
import roomLuxury from "@/assets/room-luxury.jpg";
import roomCalm from "@/assets/room-calm.jpg";
import DimensionInput from "./DimensionInput";

type Mood = "Calm" | "Cozy" | "Energetic";

const moods: { id: Mood; label: string; emoji: string; desc: string; color: string }[] = [
  { id: "Calm", label: "Calm", emoji: "🌿", desc: "Soft tones, natural materials", color: "from-emerald-50 to-emerald-100" },
  { id: "Cozy", label: "Cozy", emoji: "🛋️", desc: "Warm hues, layered comfort", color: "from-orange-50 to-orange-100" },
  { id: "Energetic", label: "Energetic", emoji: "⚡", desc: "Vibrant accents, bold contrast", color: "from-sky-50 to-sky-100" },
];

const styles = [
  { id: "Modern", image: styleModern },
  { id: "Minimal", image: styleMinimal },
  { id: "Japandi", image: styleJapandi },
  { id: "Luxury", image: roomLuxury },
  { id: "Nordic", image: roomCalm },
  { id: "Industrial", image: styleBoho },
];

const steps = [
  { num: 1, label: "Upload" },
  { num: 2, label: "Mood" },
  { num: 3, label: "Budget" },
  { num: 4, label: "Generate" },
];

interface Props {
  onGenerate: (config: { mood: Mood; budget: number; style: string; image: string | null; length: number; width: number; height: number; area: number }) => void;
  isGenerating: boolean;
}

export default function DesignSidebar({ onGenerate, isGenerating }: Props) {
  const [mood, setMood] = useState<Mood>("Calm");
  const [budget, setBudget] = useState(25000);
  const [style, setStyle] = useState("Modern");
  const [image, setImage] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ length: 12, width: 10, height: 9 });
  const [dragActive, setDragActive] = useState(false);

  const currentStep = image ? (mood ? (budget ? 4 : 3) : 2) : 1;

  const handleMood = useCallback((m: Mood) => {
    setMood(m);
    document.body.className = `mood-${m.toLowerCase()}`;
  }, []);

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large. Please use under 10MB.");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Please upload a JPG or PNG image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const openFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (f) handleFile(f);
    };
    input.click();
  };

  const formatBudget = (v: number) => `₹${v.toLocaleString("en-IN")}`;

  const getBudgetLabel = (v: number) => {
    if (v < 20000) return "Budget-friendly makeover";
    if (v <= 50000) return "Mid-range transformation";
    if (v <= 75000) return "Premium redesign";
    return "Luxury renovation";
  };

  return (
    <aside className="w-full lg:w-[360px] shrink-0 bg-white/50 backdrop-blur-md border-r border-border overflow-y-auto max-h-[calc(100vh-4rem)]">
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
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.num < currentStep ? <Check className="w-3 h-3" /> : s.num}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 transition-colors duration-500 ${s.num < currentStep ? "bg-success/30" : "bg-border"}`} />
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
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 1:</span>
            <span className="text-xs text-foreground font-medium">Upload your room</span>
          </div>
          <div
            onDragOver={(e) => { 
              e.preventDefault(); 
              if (!isGenerating) setDragActive(true); 
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              if (isGenerating) return;
              handleDrop(e);
            }}
            onClick={() => {
              if (!isGenerating) openFilePicker();
            }}
            className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden bg-white/60 ${
              isGenerating ? "opacity-50 cursor-not-allowed " : ""
            }${
              dragActive ? "border-primary bg-primary/5 scale-[1.01]" : image ? "border-success/30" : "border-border hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
            } ${image ? "h-40" : "h-32"}`}
          >
            {image ? (
              <>
                <img src={image} alt="Room preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-foreground/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-success" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground relative">
                {/* Ghost placeholder */}
                <div className="absolute inset-3 rounded-xl bg-accent/50 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-border flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Step 1B: Room Dimensions */}
        <DimensionInput 
          length={dimensions.length} 
          width={dimensions.width} 
          height={dimensions.height} 
          onChange={setDimensions} 
        />

        {/* Step 2: Mood */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 2:</span>
            <span className="text-xs text-foreground font-medium">How should it feel?</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {moods.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMood(m.id)}
                className={`rounded-2xl py-2.5 px-2 text-center transition-all duration-300 active:scale-[0.94] bg-gradient-to-br ${m.color} border-2 ${
                  mood === m.id
                    ? "border-primary shadow-md ring-1 ring-primary/20"
                    : "border-transparent hover:shadow-sm"
                }`}
              >
                <span className="text-lg block">{m.emoji}</span>
                <span className="text-[10px] font-semibold mt-0.5 block text-foreground/80">{m.label}</span>
                <span className="text-[8px] block text-muted-foreground mt-0.5 leading-tight">{m.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 3: Budget + Style */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 3:</span>
            <span className="text-xs text-foreground font-medium">Budget & style</span>
          </div>

          <div className="bg-white rounded-2xl border border-border p-3.5 space-y-3 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Budget</span>
              <span className="text-sm font-bold text-success">{formatBudget(budget)}</span>
            </div>
            <div className="text-[10px] text-primary font-medium mb-2">{getBudgetLabel(budget)}</div>
            <input
              type="range"
              min={5000}
              max={100000}
              step={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-110"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>₹5,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Style cards with images */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`rounded-xl overflow-hidden transition-all duration-200 active:scale-[0.95] border-2 group ${
                  style === s.id
                    ? "border-primary shadow-md ring-1 ring-primary/20"
                    : "border-transparent hover:border-primary/30"
                }`}
              >
                <div className="aspect-square overflow-hidden">
                  <img src={s.image} alt={s.id} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="py-1 px-0.5 bg-white">
                  <span className={`text-[9px] font-medium block text-center ${style === s.id ? "text-primary" : "text-muted-foreground"}`}>
                    {s.id}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 4: Generate */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 4:</span>
            <span className="text-xs text-foreground font-medium">See the magic</span>
          </div>
          <button
            onClick={() => onGenerate({ 
              mood, 
              budget, 
              style, 
              image, 
              ...dimensions,
              area: dimensions.length * dimensions.width 
            })}
            disabled={!image || !style || isGenerating}
            className="w-full py-4 rounded-2xl font-semibold text-sm bg-primary text-primary-foreground
              transition-all duration-200 active:scale-[0.97] hover:brightness-90 shadow-lg shadow-primary/20
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              "✨ Generate My Design"
            )}
          </button>
          <p className="text-[10px] text-muted-foreground text-center mt-2">Usually ready in 15 seconds</p>
        </section>
      </div>
    </aside>
  );
}
