import { useState, useEffect } from "react";
import { Maximize, Ruler } from "lucide-react";

interface Props {
  length: number;
  width: number;
  height: number;
  onChange: (dim: { length: number; width: number; height: number }) => void;
}

export default function DimensionInput({ length, width, height, onChange }: Props) {
  const [area, setArea] = useState(0);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    setArea(length * width);
    setVolume(length * width * height);
  }, [length, width, height]);

  // Max visual scale logic
  const maxDim = 20; // 20ft is baseline 100% scale
  const scale = Math.min(1.2, Math.max(0.6, Math.max(length, width) / maxDim));

  let roomLabel = "Medium room";
  if (area < 100) roomLabel = "Cozy compact room";
  else if (area <= 200) roomLabel = "Perfect sized room";
  else roomLabel = "Spacious room";
  
  return (
    <section>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Dimensions:</span>
        <span className="text-xs text-foreground font-medium">Room Size</span>
        <Ruler className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
      </div>

      <div className="bg-white/60 rounded-2xl border border-border p-3.5 space-y-3 relative overflow-hidden group">
        <div className="flex gap-2 relative z-10">
          <div className="flex-1 space-y-1">
            <label className="text-[9px] text-muted-foreground uppercase font-semibold pl-1">Length (ft)</label>
            <input
              type="number"
              value={length || ""}
              onChange={(e) => onChange({ length: Number(e.target.value), width, height })}
              placeholder="12"
              className="w-full bg-white border border-border rounded-xl px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[9px] text-muted-foreground uppercase font-semibold pl-1">Width (ft)</label>
            <input
              type="number"
              value={width || ""}
              onChange={(e) => onChange({ length, width: Number(e.target.value), height })}
              placeholder="10"
              className="w-full bg-white border border-border rounded-xl px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[9px] text-muted-foreground uppercase font-semibold pl-1">Height (ft)</label>
            <input
              type="number"
              value={height || ""}
              onChange={(e) => onChange({ length, width, height: Number(e.target.value) })}
              placeholder="9"
              className="w-full bg-white border border-border rounded-xl px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 pt-1">
          {/* Isometric box illustration */}
          <div className="w-12 h-12 bg-white rounded-lg border border-border shadow-sm flex items-center justify-center shrink-0">
            <div 
              className="relative transition-transform duration-300 ease-out"
              style={{ transform: `scale(${scale})` }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#E8D5B7" stroke="#C4622D" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M2 7V17L12 22V12L2 7Z" fill="#F5F0E8" stroke="#C4622D" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M22 7V17L12 22V12L22 7Z" fill="#DBC4A1" stroke="#C4622D" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col flex-1">
            <span className="text-xs font-bold text-foreground">Room area: {area} sq ft</span>
            <span className="text-[10px] text-muted-foreground">Room volume: {volume} cubic ft</span>
            <span className="text-[10px] font-medium text-primary mt-0.5">{roomLabel}</span>
          </div>
        </div>

        <div className="pt-1 border-t border-border/50 relative z-10">
          <p className="text-[9px] text-muted-foreground/80 flex items-center gap-1">
            <Maximize className="w-3 h-3 text-primary/60" />
            Tip: Measure wall to wall for best results
          </p>
        </div>
      </div>
    </section>
  );
}
