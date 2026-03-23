import { useState, useEffect, useRef } from "react";
import { Heart, Bookmark, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { DesignResult } from "@/api/designApi";

interface FeedItem {
  id: string;
  username: string;
  avatar: string;
  beforeImage: string;
  afterImage: string;
  style: string;
  roomType: string;
  caption: string;
  likes: number;
  isNew?: boolean;
}

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600",
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
];
const STYLES = ["Modern", "Japandi", "Luxury", "Nordic", "Minimal", "Industrial"];
const ROOMS = ["Living Room", "Bedroom", "Kitchen", "Office"];

const generateSpam = (index: number): FeedItem => {
  const rStyle = STYLES[index % STYLES.length];
  const rRoom = ROOMS[index % ROOMS.length];
  const rImg = MOCK_IMAGES[index % MOCK_IMAGES.length];
  return {
    id: `mf-${index}`,
    username: `User_${Math.floor(Math.random() * 9000) + 1000}`,
    avatar: `https://i.pravatar.cc/40?u=mf-${index}`,
    beforeImage: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=600",
    afterImage: rImg,
    style: rStyle,
    roomType: rRoom,
    caption: `Absolutely love how this turned out. ${rStyle} vibes!`,
    likes: Math.floor(Math.random() * 4650) + 150,
  };
};

const INITIAL_MOCK = Array.from({ length: 12 }).map((_, i) => generateSpam(i));
const FILTERS = ["All", "Living Room", "Bedroom", "Kitchen", "Most Liked", "Newest"];

interface FeedProps {
  onTryStyle: (style: string) => void;
}

export default function SocialFeed({ onTryStyle }: FeedProps) {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState("All");
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedLiked = localStorage.getItem("roomgenie_liked");
      const storedSaved = localStorage.getItem("roomgenie_saved");
      const storedCommunity = localStorage.getItem("roomgenie_community");
      
      if (storedLiked) setLikedIds(new Set(JSON.parse(storedLiked)));
      if (storedSaved) setSavedIds(new Set(JSON.parse(storedSaved)));
      
      let allFeed = [...INITIAL_MOCK];
      if (storedCommunity) {
        allFeed = [...JSON.parse(storedCommunity), ...allFeed];
      }
      setFeed(allFeed);
    } catch (e) {
      console.error(e);
      setFeed(INITIAL_MOCK);
    }
  }, []);

  const handleLike = (id: string, currentLikes: number) => {
    const newLikes = new Set(likedIds);
    let likeDiff = 0;
    if (newLikes.has(id)) {
      newLikes.delete(id);
      likeDiff = -1;
    } else {
      newLikes.add(id);
      likeDiff = 1;
    }
    setLikedIds(newLikes);
    localStorage.setItem("roomgenie_liked", JSON.stringify([...newLikes]));
    
    setFeed(prev => prev.map(item => 
      item.id === id ? { ...item, likes: item.likes + likeDiff } : item
    ));
  };

  const handleSave = (id: string) => {
    const newSaved = new Set(savedIds);
    if (newSaved.has(id)) {
      newSaved.delete(id);
      toast.info("Removed from Saved.");
    } else {
      newSaved.add(id);
      toast.success("Saved to your boards!");
    }
    setSavedIds(newSaved);
    localStorage.setItem("roomgenie_saved", JSON.stringify([...newSaved]));
  };

  const filteredFeed = feed.filter(item => {
    if (activeFilter === "All" || activeFilter === "Most Liked" || activeFilter === "Newest") return true;
    return item.roomType === activeFilter;
  }).sort((a, b) => {
    if (activeFilter === "Most Liked") return b.likes - a.likes;
    if (activeFilter === "Newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Filter Bar */}
      <div className="sticky top-16 z-20 bg-[#f5f0e8]/95 backdrop-blur-md pb-4 pt-4 -mx-4 px-4 md:-mx-6 md:px-6 flex gap-2 overflow-x-auto no-scrollbar mb-6 border-b border-border/50 shadow-sm">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeFilter === f 
                ? "bg-[#c8622a] text-white shadow-md scale-105" 
                : "bg-white border border-slate-200 text-slate-600 hover:border-[#c8622a] hover:text-[#c8622a]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredFeed.map((item) => (
          <div key={item.id} className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col group hover:shadow-md transition-shadow">
            
            {/* Split Image Container */}
            <div className="relative w-full h-[320px] overflow-hidden bg-slate-100">
              {item.isNew && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md z-30 animate-pulse">
                  NEW ✨
                </div>
              )}
              
              <div className="absolute top-3 left-3 bg-[#c8622a] text-white px-3 py-1 rounded-md text-[11px] font-bold shadow-sm z-20">
                {item.style}
              </div>
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-md text-[11px] font-bold z-20">
                {item.roomType}
              </div>

              {/* Before/After Split Interaction */}
              <img src={item.afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover z-0" loading="lazy" />
              <div 
                className="absolute inset-y-0 left-0 bg-black overflow-hidden z-10 transition-all duration-500 ease-in-out w-[30%] group-hover:w-[50%]"
                style={{ borderRight: "3px solid white", boxShadow: "5px 0 15px rgba(0,0,0,0.3)" }}
              >
                <img src={item.beforeImage} alt="Before" className="absolute inset-y-0 left-0 w-[500px] h-full object-cover max-w-none opacity-80" loading="lazy" />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Before</div>
              </div>
              
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-[#1a1208] text-[10px] uppercase font-bold px-2 py-1 rounded z-20 shadow-sm">After</div>
            </div>

            {/* Content Info */}
            <div className="p-5 flex flex-col gap-3">
              <div className="text-sm font-medium text-slate-700 line-clamp-2 leading-relaxed">
                {item.caption}
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2.5">
                  <img src={item.avatar} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-slate-100" />
                  <span className="text-xs font-bold text-[#1a1208]">{item.username}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLike(item.id, item.likes)}
                    className="flex items-center gap-1.5 text-xs font-bold group/btn active:scale-95 transition-transform"
                  >
                    <Heart className={`w-5 h-5 transition-colors ${likedIds.has(item.id) ? "fill-red-500 text-red-500" : "text-slate-400 group-hover/btn:text-red-400"}`} />
                    <span className={likedIds.has(item.id) ? "text-red-500" : "text-slate-500"}>{item.likes}</span>
                  </button>
                  <button 
                    onClick={() => handleSave(item.id)}
                    className="text-slate-400 hover:text-[#c8622a] active:scale-95 transition-all"
                  >
                    <Bookmark className={`w-5 h-5 ${savedIds.has(item.id) ? "fill-[#c8622a] text-[#c8622a]" : ""}`} />
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2">
                <button 
                  onClick={() => onTryStyle(item.style)}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#c8622a] bg-orange-50 hover:bg-orange-100 py-2.5 rounded-lg transition-colors"
                >
                  Inspired? Try this style <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
      
      <div ref={bottomRef} className="h-24 w-full flex items-center justify-center text-slate-400 text-sm font-bold mt-8">
        ✓ You've seen all designs.
      </div>
    </div>
  );
}

export function PublishModal({ 
  isOpen, onClose, result, beforeImage 
}: { 
  isOpen: boolean; onClose: () => void; result: DesignResult | null; beforeImage: string 
}) {
  const [roomType, setRoomType] = useState("Living Room");
  const [caption, setCaption] = useState("");
  const [username, setUsername] = useState("");
  
  if (!isOpen || !result) return null;

  const handlePublish = () => {
    try {
      const stored = localStorage.getItem("roomgenie_community");
      const existing = stored ? JSON.parse(stored) : [];
      const newItem: FeedItem = {
        id: `user-${Date.now()}`,
        username: username.trim() || "Anonymous",
        avatar: "https://i.pravatar.cc/100?u=" + Date.now(),
        beforeImage,
        afterImage: result.transformedImage,
        style: result.style,
        roomType,
        caption,
        likes: 0,
        isNew: true
      };
      localStorage.setItem("roomgenie_community", JSON.stringify([newItem, ...existing]));
      toast.success("Your design is live! 🎉");
      onClose();
    } catch (e) {
      toast.error("Failed to publish design.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-border flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-lg text-[#1a1208]">Share to Community</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500"/></button>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          {/* Preview */}
          <div className="flex h-[140px] rounded-xl overflow-hidden shadow-sm border border-border">
            <div className="w-1/2 relative border-r border-white/20">
              <img src={beforeImage} className="w-full h-full object-cover" alt="Before" />
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">Before</div>
            </div>
            <div className="w-1/2 relative border-l border-white/20">
              <img src={result.transformedImage} className="w-full h-full object-cover" alt="After" />
              <div className="absolute bottom-2 right-2 bg-white/90 text-black text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shadow-sm">After</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Room Type</label>
              <select 
                value={roomType} onChange={e => setRoomType(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c8622a]/20 outline-none transition-shadow font-medium text-slate-700"
              >
                {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Caption</span>
                <span className={caption.length >= 120 ? "text-red-500" : ""}>{caption.length}/120</span>
              </label>
              <textarea 
                value={caption} onChange={e => setCaption(e.target.value.slice(0, 120))}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm resize-none h-24 focus:ring-2 focus:ring-[#c8622a]/20 outline-none transition-shadow font-medium text-slate-700"
                placeholder="Share your thoughts about this design... It looks amazing!"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Username (Optional)</label>
              <input 
                type="text" 
                value={username} onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c8622a]/20 outline-none transition-shadow font-medium text-slate-700"
                placeholder="Anonymous"
              />
            </div>
          </div>
          
          <button 
            onClick={handlePublish}
            className="w-full bg-[#c8622a] text-white font-bold py-4 rounded-xl hover:bg-[#b05220] transition-colors mt-2 shadow-md hover:shadow-lg active:scale-95 transition-all text-[15px]"
          >
            Publish to Community Feed
          </button>
        </div>
      </div>
    </div>
  );
}
