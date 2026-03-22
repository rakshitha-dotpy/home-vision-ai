import { useState, useRef } from "react";

export default function BeforeAfter() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  };

  return (
    <div
      ref={containerRef}
      className="glass-card overflow-hidden relative cursor-col-resize select-none"
      style={{ height: 340 }}
      onMouseMove={(e) => { if (e.buttons === 1) handleMove(e.clientX); }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* Before */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/40 to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-3 opacity-50">
          <div className="w-16 h-12 mx-auto bg-white/10 rounded-lg" />
          <div className="w-20 h-3 mx-auto bg-white/10 rounded" />
          <div className="w-12 h-8 mx-auto bg-white/5 rounded" />
        </div>
      </div>

      {/* After */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card to-secondary/10 flex items-center justify-center overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <div className="text-center space-y-3">
          <div className="w-16 h-12 mx-auto bg-primary/20 rounded-lg border border-primary/20" />
          <div className="w-20 h-3 mx-auto bg-secondary/15 rounded" />
          <div className="w-12 h-8 mx-auto bg-success/10 rounded border border-success/10" />
        </div>
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/40 z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
          <span className="text-xs">⟷</span>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">
        Before
      </span>
      <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
        After
      </span>
    </div>
  );
}
