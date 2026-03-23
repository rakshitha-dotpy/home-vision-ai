import { useState, useRef } from "react";
import heroRoom from "@/assets/hero-room.jpg";
import roomLuxury from "@/assets/room-luxury.jpg";

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
      className="rounded-2xl overflow-hidden relative cursor-col-resize select-none border border-border shadow-sm"
      style={{ height: 360 }}
      onMouseMove={(e) => { if (e.buttons === 1) handleMove(e.clientX); }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <div className="absolute inset-0">
        <img src={heroRoom} alt="Before" className="w-full h-full object-cover grayscale opacity-70" />
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={roomLuxury} alt="After" className="w-full h-full object-cover" />
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary/60 z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-border flex items-center justify-center shadow-lg">
          <span className="text-sm text-foreground">⟷</span>
        </div>
      </div>

      <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-sm text-foreground/70 z-20 border border-border">
        Before
      </span>
      <span className="absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-primary z-20">
        After
      </span>
    </div>
  );
}
