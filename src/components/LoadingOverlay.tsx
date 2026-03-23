import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

const phases = [
  { text: "Analyzing your room...", emoji: "🔍", pct: 30 },
  { text: "Applying your style...", emoji: "🎨", pct: 65 },
  { text: "Almost ready...", emoji: "✨", pct: 95 },
];

export default function LoadingOverlay() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative">
      <div className="text-center space-y-8 relative z-10 max-w-xs w-full">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-2xl bg-primary opacity-10 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="relative w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-3xl shadow-lg">
            {phases[phase].emoji}
          </div>
        </div>

        <div className="space-y-3">
          {phases.map((p, i) => (
            <div
              key={p.text}
              className={`flex items-center justify-center gap-2.5 transition-all duration-500 ${
                i === phase ? "opacity-100 scale-100" : i < phase ? "opacity-30 scale-95" : "opacity-0 scale-95"
              }`}
            >
              {i < phase && <span className="text-success text-xs">✓</span>}
              <p className={`text-sm ${i === phase ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                {p.text}
              </p>
            </div>
          ))}
        </div>

        <div className="px-4">
          <Progress value={phases[phase].pct} className="h-1.5 bg-muted" />
        </div>
      </div>
    </div>
  );
}
