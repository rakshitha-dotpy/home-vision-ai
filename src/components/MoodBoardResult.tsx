import { useState } from "react";
import { DesignResult } from "@/api/designApi";
import { Check, Eye, Share, Download, RotateCcw } from "lucide-react";

interface Props {
  results: DesignResult[];
  beforeImage: string;
  onSelect: (result: DesignResult) => void;
  onShare: (result: DesignResult) => void;
  onARPreview: (result: DesignResult) => void;
  onTryAgain?: () => void;
}

export default function MoodBoardResult({ results, beforeImage, onSelect, onShare, onARPreview, onTryAgain }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectClick = (result: DesignResult) => {
    setSelectedId(result.id);
    onSelect(result);
  };

  const selectedResult = results.find(r => r.id === selectedId);

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {results.map((r, index) => {
          const isSelected = selectedId === r.id;
          return (
            <div 
              key={r.id}
              className={`flex flex-col rounded-2xl overflow-hidden bg-white shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                isSelected ? "border-2 border-[#c8622a] ring-4 ring-[#c8622a]/15 shadow-xl" : "border border-border"
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
              onClick={() => handleSelectClick(r)}
            >
              {/* TOP 55%: Image */}
              <div className="relative h-[240px] w-full">
                <img src={r.transformedImage} alt={r.style} className="w-full h-full object-cover" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium z-10">
                  {r.style}
                </div>
                <div className="absolute top-3 right-3 bg-[#c8622a] text-white px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider z-10">
                  ✦ Demo Result
                </div>
                
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg z-20 w-8 h-8 flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              {/* BOTTOM 45%: Details */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-[#1a1208] text-lg">{r.style} Room</h3>
                  <div className="text-[11px] font-bold text-muted-foreground bg-secondary px-2 py-1.5 rounded flex items-center shadow-sm border border-slate-100">
                    ₹{r.estimatedCostMin/1000}k – ₹{r.estimatedCostMax/1000}k
                  </div>
                </div>
                
                {/* Color Palette */}
                <div className="flex gap-2 mb-4">
                  {r.colorPalette.map((color, i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                
                {/* Furniture List */}
                <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                  {r.furnitureList.slice(0, 3).map((item, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold border border-slate-200">
                      {item}
                    </span>
                  ))}
                  {r.furnitureList.length > 3 && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-bold border border-amber-200">
                      +{r.furnitureList.length - 3} more
                    </span>
                  )}
                </div>
                
                {/* Select Button */}
                <button 
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${
                    isSelected 
                      ? "bg-green-500 text-white hover:bg-green-600 shadow-md ring-2 ring-green-500/30 ring-offset-1" 
                      : "bg-slate-100 text-slate-700 hover:bg-[#c8622a] hover:text-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectClick(r);
                  }}
                >
                  {isSelected ? (
                    <span className="flex items-center justify-center gap-2"><Check className="w-4 h-4"/> Selected</span>
                  ) : "Select This Style"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AFTER SELECTION ACTIONS */}
      {selectedResult && (
        <div className="mt-4 p-5 bg-white rounded-2xl shadow-sm border border-border flex flex-wrap items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent pointer-events-none opacity-50" />
          
          <button 
            onClick={() => onARPreview(selectedResult)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg active:scale-95 z-10"
          >
            <Eye className="w-4 h-4 text-orange-400" /> AR Preview
          </button>
          
          <button 
            onClick={() => onShare(selectedResult)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors border border-indigo-100 active:scale-95 z-10"
          >
            <Share className="w-4 h-4" /> Share to Community
          </button>
          
          <button 
            onClick={() => alert("Downloading Mood Board as PDF...")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors active:scale-95 z-10 shadow-sm"
          >
            <Download className="w-4 h-4 shrink-0" /> Download
          </button>
          
          <div className="w-px h-8 bg-border mx-2 hidden sm:block z-10"></div>
          
          <button 
            onClick={() => { setSelectedId(null); if(onTryAgain) onTryAgain(); }}
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors z-10 ml-auto"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}
