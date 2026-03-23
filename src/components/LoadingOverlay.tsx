import { useState, useEffect } from "react";

const phases = [
  { text: "Analyzing your room...", emoji: "🔍", duration: 1200 },
  { text: "Understanding your mood...", emoji: "🎨", duration: 1200 },
  { text: "Designing your perfect space...", emoji: "✨", duration: 1200 },
];

export default function LoadingOverlay() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = phases.map((_, i) =>
      setTimeout(() => setPhase(i), i * phases[i].duration)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative">
      <div className="absolute w-64 h-64 bg-primary/8 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute w-48 h-48 bg-secondary/6 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: "500ms" }} />

      <div className="text-center space-y-8 relative z-10">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-2xl gradient-primary opacity-10 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="relative w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center text-3xl shadow-lg">
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

        <div className="flex gap-1 justify-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
