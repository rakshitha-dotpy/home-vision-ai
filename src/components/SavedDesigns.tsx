import { useState, useEffect } from "react";
import { Trash2, ExternalLink, CalendarDays } from "lucide-react";
import { toast } from "sonner";

export default function SavedDesigns({ onDesignSelect }: { onDesignSelect: (design: any) => void }) {
  const [designs, setDesigns] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("roomgenie_saved") || "[]");
      setDesigns(saved);
    } catch {
      setDesigns([]);
    }
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this saved design?")) {
      const updated = designs.filter(d => d.id !== id);
      setDesigns(updated);
      localStorage.setItem("roomgenie_saved", JSON.stringify(updated));
      toast.success("Design deleted");
    }
  };

  if (designs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in-up bg-slate-50">
        <div className="w-48 h-48 mb-6 opacity-80">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="60" width="120" height="90" rx="12" fill="#F5F0E8" stroke="#C4622D" strokeWidth="4" />
            <path d="M40 90L160 90" stroke="#C4622D" strokeWidth="4" />
            <circle cx="100" cy="120" r="15" fill="#C4622D" opacity="0.2" />
            <path d="M85 120H115" stroke="#C4622D" strokeWidth="4" strokeLinecap="round" />
            <path d="M100 105V135" stroke="#C4622D" strokeWidth="4" strokeLinecap="round" />
            <path d="M150 40V60" stroke="#C4622D" strokeWidth="4" strokeLinecap="round" />
            <path d="M50 40V60" stroke="#C4622D" strokeWidth="4" strokeLinecap="round" />
            <path d="M70 20V40" stroke="#C4622D" strokeWidth="4" strokeLinecap="round" />
            <path d="M130 20V40" stroke="#C4622D" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">No saved designs yet</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Your creative journey starts here! Generate your first beautiful room design to see it saved in this gallery.
        </p>
        <button 
          onClick={() => onDesignSelect(null)}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-md shadow-primary/20"
        >
          Design my room
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8 animate-fade-in-up">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Saved Designs</h1>
          <p className="text-muted-foreground">{designs.length} {designs.length === 1 ? 'project' : 'projects'} saved</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map(design => {
            const date = new Date(design.date).toLocaleDateString("en-IN", { 
              month: 'short', day: 'numeric', year: 'numeric' 
            });

            return (
              <div 
                key={design.id}
                onClick={() => onDesignSelect(design)}
                className="bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  <img src={design.resultData.generatedImage} alt="Saved design" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={(e) => handleDelete(design.id, e)}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-destructive flex items-center justify-center shadow-sm hover:scale-110 hover:bg-destructive hover:text-white transition-all active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded shadow-sm text-primary uppercase">
                      {design.config.style}
                    </span>
                    <span className="bg-black/60 backdrop-blur text-[10px] font-bold px-2 py-1 rounded shadow-sm text-white capitalize">
                      {design.config.mood}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-foreground mb-3 truncate">{design.resultData.description}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-success"></span>
                      {design.resultData.roomAnalysis.area} ({design.resultData.roomAnalysis.roomSize})
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {date}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm font-medium">
                    <span className="text-foreground/70">Budget applied:</span>
                    <span className="text-success font-bold">₹{design.config.budget.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                
                {/* Hover Reveal Button */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white via-white to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-full py-2.5 bg-primary/10 text-primary font-bold rounded-xl flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Open Result
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
