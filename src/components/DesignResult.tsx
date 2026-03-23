import { useState, useRef, useEffect } from "react";
import { Download, Share2, Bookmark, RefreshCcw, Check, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Config {
  mood: string;
  budget: number;
  style: string;
  image: string | null;
  length: number;
  width: number;
  height: number;
  area: number;
}

interface ResultData {
  roomAnalysis: {
    area: string;
    volume: string;
    roomSize: string;
    budgetPerSqFt: string;
    recommendation: string;
  };
  generatedImage: string;
  description: string;
  colorPalette: string[];
  items: Array<{
    name: string;
    description: string;
    price: string;
    tag: string;
    where: string;
  }>;
  designTips: string[];
  processingTime: string;
}

interface Props {
  hasResult: boolean;
  config: Config | null;
  resultData: ResultData | null;
  onReset: () => void;
}

export default function DesignResult({ hasResult, config, resultData, onReset }: Props) {
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDragHint, setShowDragHint] = useState(true);

  if (!hasResult || !config || !resultData) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setShowDragHint(false);
    updateSlider(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateSlider = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("roomgenie_saved") || "[]");
      const newSaved = {
        id: Date.now().toString(),
        config,
        resultData,
        date: new Date().toISOString()
      };
      localStorage.setItem("roomgenie_saved", JSON.stringify([newSaved, ...existing]));
      toast.success("Design saved successfully!");
    } catch {
      toast.error("Failed to save design");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(resultData.generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "roomgenie-redesign.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch {
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 relative animate-fade-in-up">
      {/* Banner */}
      <div className="bg-primary/10 border-b border-primary/20 px-6 py-3 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-4 h-4" />
          <span className="font-semibold text-sm">
            Your {resultData.roomAnalysis.area} {resultData.roomAnalysis.roomSize} room — {resultData.roomAnalysis.budgetPerSqFt} design
          </span>
        </div>
        <span className="text-xs font-medium text-primary/70">{resultData.processingTime}</span>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-10">
        
        {/* Before/After Slider */}
        <section className="space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{resultData.description}</h2>
              <p className="text-muted-foreground mt-1">Slide to compare your original space with the AI design</p>
            </div>
            
            {/* Color Palette */}
            <div className="flex flex-col items-end gap-1.5 hidden sm:flex">
              <span className="text-xs font-medium text-muted-foreground">Your color palette</span>
              <div className="flex gap-2">
                {resultData.colorPalette.map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 group cursor-help">
                    <div 
                      className="w-8 h-8 rounded-full shadow-sm border-2 border-white ring-1 ring-border group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[9px] font-mono text-muted-foreground uppercase">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div 
            ref={sliderRef}
            className="relative aspect-[16/9] md:aspect-[21/9] bg-muted rounded-3xl overflow-hidden shadow-xl border cursor-ew-resize select-none group"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Original Image */}
            <div className="absolute inset-0">
              <img src={config.image!} alt="Before" className="w-full h-full object-cover" draggable={false} />
            </div>
            
            {/* Generated Image */}
            <div 
              className="absolute inset-0 right-auto bg-muted overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img 
                src={resultData.generatedImage} 
                alt="After" 
                className="absolute inset-0 h-full max-w-none object-cover" 
                style={{ width: sliderRef.current ? sliderRef.current.offsetWidth : '100vw' }}
                draggable={false} 
              />
            </div>

            {/* Drag Handle */}
            <div 
              className="absolute inset-y-0 flex items-center justify-center translate-x-[-50%]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="h-full w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)]"></div>
              <div className="absolute w-10 h-10 bg-white rounded-full shadow-lg border border-border flex items-center justify-center transition-transform group-hover:scale-110 active:scale-95 text-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18 6-6-6-6"/><path d="m9 18-6-6 6-6"/></svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
              <div className="bg-white/80 backdrop-blur text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-white/40">
                AFTER
              </div>
              <div className="bg-[#C4622D] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                ✦ Demo Result
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-black/40">
              BEFORE
            </div>

            {showDragHint && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2 animate-bounce pointer-events-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18 6-6-6-6"/><path d="m9 18-6-6 6-6"/></svg>
                Drag to compare
              </div>
            )}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main List */}
          <section className="lg:col-span-2 space-y-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-bold tracking-tight">Recommended Items</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {resultData.items.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-125"></div>
                  <div className="mb-2">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary mb-2">
                      {item.tag}
                    </span>
                    <h4 className="font-bold text-foreground text-lg leading-tight">{item.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 h-10">{item.description}</p>
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <p className="text-xs text-muted-foreground/70 mb-0.5">Where to buy</p>
                      <p className="text-[11px] font-medium text-foreground">{item.where}</p>
                    </div>
                    <span className="text-xl font-black text-primary">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sidebar Area */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            {/* Tips Component */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight">Design Tips</h3>
              <div className="space-y-3">
                {resultData.designTips.map((tip, i) => (
                  <div key={i} className="bg-orange-50/50 p-4 rounded-2xl flex gap-4 border border-orange-100 hover:bg-orange-50 transition-colors">
                    <span className="text-xl font-black text-primary/30 shrink-0">0{i + 1}</span>
                    <p className="text-sm text-foreground/80 leading-relaxed pt-0.5">{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Actions Card */}
            <div className="bg-white rounded-2xl border shadow-sm p-4 space-y-3">
              <button 
                onClick={handleSave}
                className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-foreground text-background rounded-xl font-medium hover:bg-foreground/90 transition-colors active:scale-[0.98]"
              >
                <Bookmark className="w-4 h-4" />
                Save Design
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleShare}
                  className="py-2.5 flex items-center justify-center gap-2 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button 
                  onClick={handleDownload}
                  className="py-2.5 flex items-center justify-center gap-2 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Report
                </button>
              </div>

              <div className="pt-3 border-t">
                <button 
                  onClick={onReset}
                  className="w-full py-3 flex items-center justify-center gap-2 text-primary bg-primary/10 rounded-xl font-medium hover:bg-primary/15 transition-colors active:scale-[0.98]"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Try Another Style
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
