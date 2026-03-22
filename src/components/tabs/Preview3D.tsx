export default function Preview3D() {
  return (
    <div className="glass-card p-6 relative overflow-hidden" style={{ minHeight: 340 }}>
      <span className="absolute top-4 right-4 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/20 text-primary z-10">
        AI Generated
      </span>

      {/* Simple CSS room */}
      <div className="relative w-full h-72 flex items-end justify-center">
        {/* Back wall */}
        <div className="absolute inset-x-8 top-4 bottom-16 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          {/* Window */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-20 rounded-lg border-2 border-white/10 bg-white/[0.02]">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px p-1">
              <div className="bg-primary/5 rounded-sm" />
              <div className="bg-secondary/5 rounded-sm" />
              <div className="bg-primary/5 rounded-sm" />
              <div className="bg-secondary/5 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Floor */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-white/[0.02] rounded-b-xl" style={{ transform: "perspective(400px) rotateX(20deg)", transformOrigin: "bottom" }} />

        {/* Furniture - Sofa */}
        <div className="absolute bottom-14 left-12 w-28 h-12 bg-primary/15 rounded-lg border border-primary/20">
          <div className="absolute -top-3 inset-x-1 h-4 bg-primary/10 rounded-t-lg" />
        </div>

        {/* Table */}
        <div className="absolute bottom-14 right-16 w-14 h-10 bg-secondary/10 rounded-md border border-secondary/15" />

        {/* Lamp */}
        <div className="absolute bottom-14 right-12 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-success/20 border border-success/20 animate-pulse-glow" />
          <div className="w-1 h-8 bg-white/10 rounded" />
        </div>

        {/* Plant */}
        <div className="absolute bottom-14 left-6">
          <div className="w-4 h-6 bg-success/20 rounded-full" />
          <div className="w-2 h-3 bg-white/10 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}
