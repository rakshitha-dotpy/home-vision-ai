import heroRoom from "@/assets/hero-room.jpg";

export default function Preview3D() {
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden relative shadow-sm" style={{ minHeight: 360 }}>
      <span className="absolute top-4 right-4 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary z-10">
        AI Generated
      </span>

      <div className="relative w-full h-80">
        <img src={heroRoom} alt="3D Room Preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/20" />

        <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full text-[10px] font-medium text-foreground shadow-sm animate-pulse-glow">
          🪟 Natural Light Zone
        </div>
        <div className="absolute bottom-20 right-8 bg-white/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full text-[10px] font-medium text-foreground shadow-sm">
          🛋️ Seating Area
        </div>
        <div className="absolute bottom-20 left-12 bg-white/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full text-[10px] font-medium text-foreground shadow-sm">
          📐 Open Floor Plan
        </div>
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">3D render complete</span>
        </div>
        <span className="text-[10px] text-muted-foreground">360° view coming soon</span>
      </div>
    </div>
  );
}
