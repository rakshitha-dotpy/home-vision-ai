import { useState } from "react";
import { Sparkles, Maximize2 } from "lucide-react";

interface Props {
  onTryStyle: (style: string, mood: string) => void;
}

const images = [
  { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", style: "Modern", mood: "calm", size: "120 sq ft", budget: "₹25,000-40,000" },
  { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", style: "Minimal", mood: "minimal", size: "180 sq ft", budget: "₹40,000-60,000" },
  { url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400", style: "Japandi", mood: "calm", size: "150 sq ft", budget: "₹35,000-50,000" },
  { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400", style: "Boho", mood: "cozy", size: "110 sq ft", budget: "₹20,000-35,000" },
  { url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400", style: "Classic", mood: "luxury", size: "220 sq ft", budget: "₹80,000-1,20,000" },
  { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400", style: "Modern", mood: "energy", size: "160 sq ft", budget: "₹45,000-65,000" },
];

const filters = ["All", "Modern", "Minimal", "Japandi", "Boho", "Classic"];

export default function ExploreGallery({ onTryStyle }: Props) {
  const [filter, setFilter] = useState("All");

  const filteredImages = filter === "All" 
    ? images 
    : images.filter(img => img.style === filter);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8 animate-fade-in-up">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Get Inspired</h1>
          <p className="text-muted-foreground text-lg">See what others have created with RoomGenie AI</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${
                filter === f 
                  ? "bg-foreground text-background shadow-md" 
                  : "bg-white text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 pt-4">
          {filteredImages.map((img, i) => (
            <div 
              key={i} 
              className="break-inside-avoid relative group rounded-3xl overflow-hidden bg-white border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img src={img.url} alt={img.style} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <div className="flex gap-2 mb-3">
                    <span className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                      {img.style}
                    </span>
                    <span className="bg-white/20 backdrop-blur text-white text-[10px] font-semibold px-2.5 py-1 rounded-md capitalize">
                      {img.mood} Mood
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-white/80 text-xs mb-4">
                    <span className="flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5" /> {img.size}</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> {img.budget}</span>
                  </div>

                  <button 
                    onClick={() => onTryStyle(img.style, img.mood)}
                    className="w-full py-2.5 bg-white text-foreground font-semibold rounded-xl text-sm hover:bg-primary hover:text-white transition-colors active:scale-95 shadow-lg"
                  >
                    Try this style
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
