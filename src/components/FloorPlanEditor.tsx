import { useState, useRef, useEffect, useCallback } from "react";
import { Trash2, Copy, Undo, Redo, X, ArrowRight, Settings2, Download } from "lucide-react";
import { FurnitureItem } from "@/api/designApi";
import { toast } from "sonner";

interface Props {
  onGenerateFromLayout: (layout: FurnitureItem[], dimensions: {width: number, height: number}) => void;
  onSkip?: () => void;
}

const SCALE = 80; // 1 meter = 80px
const WALL_THICKNESS = 8;
const GRID_SIZE = 40; // 0.5m

const ROOM_COLORS = ["#F5F0E8", "#D4C5B0", "#B8C4D0", "#C8D4C0", "#2A2A3A", "#1A1208"];
const FLOOR_TYPES = ["Hardwood", "Tiles", "Carpet", "Marble"];

const ITEM_TYPES = [
  { type: "Sofa", label: "Sofa", emoji: "🛋️", w: 2 * SCALE, h: 0.9 * SCALE, color: "#9B8EA0", shape: "rect" },
  { type: "Coffee Table", label: "Coffee Table", emoji: "🪑", w: 1.2 * SCALE, h: 0.7 * SCALE, color: "#8B6040", shape: "rect" },
  { type: "Bed", label: "Bed", emoji: "🛏️", w: 2 * SCALE, h: 1.6 * SCALE, color: "#6B8FA0", shape: "rect" },
  { type: "Wardrobe", label: "Wardrobe", emoji: "🚪", w: 1.8 * SCALE, h: 0.6 * SCALE, color: "#4A3520", shape: "rect" },
  { type: "Dining Table", label: "Dining Table", emoji: "🍽️", w: 1.4 * SCALE, h: 1.4 * SCALE, color: "#A0784A", shape: "circle" },
  { type: "Chair", label: "Chair", emoji: "🪑", w: 0.6 * SCALE, h: 0.6 * SCALE, color: "#7A9A6A", shape: "rect" },
  { type: "Plant", label: "Plant", emoji: "🌿", w: 0.5 * SCALE, h: 0.5 * SCALE, color: "#4A8A3A", shape: "circle" },
  { type: "Lamp", label: "Lamp", emoji: "💡", w: 0.3 * SCALE, h: 0.3 * SCALE, color: "#C8A030", shape: "circle" }
];

export default function FloorPlanEditor({ onGenerateFromLayout, onSkip }: Props) {
  const [dimensions, setDimensions] = useState({ width: 5, height: 4 });
  const [wallColor, setWallColor] = useState(ROOM_COLORS[0]);
  const [floorType, setFloorType] = useState("Hardwood");
  
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [history, setHistory] = useState<FurnitureItem[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const isRotating = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("roomgenie_layout");
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed);
        setHistory([parsed]);
      }
    } catch(e) {
      console.error(e);
    }
  }, []);

  const saveToHistory = useCallback((newItems: FurnitureItem[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newItems]);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const updateItems = (newItems: FurnitureItem[]) => {
    setItems(newItems);
  };
  
  const updateItemsAndSave = (newItems: FurnitureItem[]) => {
    setItems(newItems);
    saveToHistory(newItems);
  };

  const addItem = (template: typeof ITEM_TYPES[0]) => {
    const newItem: FurnitureItem = {
      id: "f-" + Date.now() + Math.random().toString(16).slice(2, 6),
      type: template.type,
      label: template.label,
      x: (600 - template.w) / 2,
      y: (480 - template.h) / 2,
      width: template.w,
      height: template.shape === "circle" ? template.w : template.h, // circle uses width as diameter
      rotation: 0,
      color: template.color
    };
    updateItemsAndSave([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setItems(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setItems(history[historyIndex + 1]);
    }
  };

  const handleClear = () => {
    updateItemsAndSave([]);
    setSelectedId(null);
  };

  const handleSaveLayout = () => {
    localStorage.setItem("roomgenie_layout", JSON.stringify(items));
    toast.success("Layout saved successfully!");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId) {
          updateItemsAndSave(items.filter(i => i.id !== selectedId));
          setSelectedId(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, history, historyIndex, selectedId]);

  // DRAW LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const roomW = dimensions.width * SCALE;
      const roomH = dimensions.height * SCALE;
      const roomX = (canvas.width - roomW) / 2;
      const roomY = (canvas.height - roomH) / 2;

      // Draw outer background
      ctx.fillStyle = "#f8f9fa";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Floor
      ctx.fillStyle = wallColor + "20"; // very light tint of wall color
      
      // Simple floor patterns based on type
      ctx.fillRect(roomX, roomY, roomW, roomH);
      
      ctx.save();
      ctx.beginPath();
      ctx.rect(roomX, roomY, roomW, roomH);
      ctx.clip();
      
      if (floorType === "Tiles") {
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        for(let x=roomX; x<roomX+roomW; x+=40) {
          ctx.beginPath(); ctx.moveTo(x, roomY); ctx.lineTo(x, roomY+roomH); ctx.stroke();
        }
        for(let y=roomY; y<roomY+roomH; y+=40) {
          ctx.beginPath(); ctx.moveTo(roomX, y); ctx.lineTo(roomX+roomW, y); ctx.stroke();
        }
      } else if (floorType === "Hardwood") {
        ctx.strokeStyle = "#c2a382";
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.5;
        for(let x=roomX; x<roomX+roomW; x+=20) {
          ctx.beginPath(); ctx.moveTo(x, roomY); ctx.lineTo(x, roomY+roomH); ctx.stroke();
          // staggered horizontal lines for planks
          if (Math.random() > 0.5) {
             const y = roomY + Math.random() * roomH;
             ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x+20, y); ctx.stroke();
          }
        }
        ctx.globalAlpha = 1.0;
      }
      ctx.restore();

      // Draw Grid
      ctx.strokeStyle = "#e8e0d4";
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Draw Walls
      ctx.strokeStyle = wallColor;
      ctx.lineWidth = WALL_THICKNESS;
      ctx.strokeRect(roomX - WALL_THICKNESS/2, roomY - WALL_THICKNESS/2, roomW + WALL_THICKNESS, roomH + WALL_THICKNESS);

      // Draw Items
      // Sort so selected is on top
      const sortedItems = [...items].sort((a,b) => (a.id === selectedId ? 1 : b.id === selectedId ? -1 : 0));

      sortedItems.forEach(item => {
        ctx.save();
        ctx.translate(item.x + item.width/2, item.y + item.height/2);
        ctx.rotate(item.rotation * Math.PI / 180);
        
        // Shadow
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 4;

        if (item.type === "Dining Table" || item.type === "Plant" || item.type === "Lamp") {
          // Draw Circle
          ctx.beginPath();
          ctx.arc(0, 0, item.width/2, 0, Math.PI * 2);
          ctx.fillStyle = item.color;
          ctx.fill();
        } else {
          // Draw Rect
          ctx.fillStyle = item.color;
          ctx.fillRect(-item.width/2, -item.height/2, item.width, item.height);
          
          if (item.type === "Sofa") {
             // draw backrest
             ctx.fillStyle = "rgba(0,0,0,0.15)";
             ctx.fillRect(-item.width/2 + 4, -item.height/2 + 4, item.width - 8, item.height * 0.3);
          } else if (item.type === "Bed") {
             // draw pillows
             ctx.fillStyle = "rgba(255,255,255,0.7)";
             ctx.fillRect(-item.width/2 + 10, -item.height/2 + 10, item.width/2 - 20, item.height * 0.2);
             ctx.fillRect(10, -item.height/2 + 10, item.width/2 - 20, item.height * 0.2);
             // blanket
             ctx.fillStyle = "rgba(0,0,0,0.05)";
             ctx.fillRect(-item.width/2, -item.height/2 + item.height * 0.3, item.width, item.height * 0.7);
          }
        }
        
        ctx.shadowColor = "transparent"; // reset shadow for stroke
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        if (item.type === "Dining Table" || item.type === "Plant" || item.type === "Lamp") {
          ctx.stroke();
        } else {
          ctx.strokeRect(-item.width/2, -item.height/2, item.width, item.height);
        }

        // Selected logic
        if (selectedId === item.id) {
          ctx.strokeStyle = "#c8622a";
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          
          // Selection box slightly bigger
          const pad = 4;
          if (item.type === "Dining Table" || item.type === "Plant" || item.type === "Lamp") {
             ctx.beginPath();
             ctx.arc(0, 0, item.width/2 + pad, 0, Math.PI * 2);
             ctx.stroke();
          } else {
             ctx.strokeRect(-item.width/2 - pad, -item.height/2 - pad, item.width + pad*2, item.height + pad*2);
          }
          ctx.setLineDash([]);
          
          // Rotation handle
          ctx.fillStyle = "#fff";
          ctx.strokeStyle = "#c8622a";
          ctx.beginPath();
          ctx.arc(item.width/2 + 16, -item.height/2 - 16, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          
          // Draw rotation icon (simple dot)
          ctx.fillStyle = "#c8622a";
          ctx.beginPath();
          ctx.arc(item.width/2 + 16, -item.height/2 - 16, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, wallColor, floorType, items, selectedId]);

  const getCanvasMouse = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    // account for display scaling vs internal scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const checkHit = (x: number, y: number, item: FurnitureItem) => {
    // simplified AABB check against unrotated bounding box for drag
    // since robust rotated hit testing takes a bit of math
    const cx = item.x + item.width/2;
    const cy = item.y + item.height/2;
    // inverse rotate point
    const angle = -item.rotation * Math.PI / 180;
    const dx = x - cx;
    const dy = y - cy;
    const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
    const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
    
    return rx >= -item.width/2 && rx <= item.width/2 && ry >= -item.height/2 && ry <= item.height/2;
  };

  const checkRotationHandleHit = (x: number, y: number, item: FurnitureItem) => {
    const cx = item.x + item.width/2;
    const cy = item.y + item.height/2;
    
    const angle = item.rotation * Math.PI / 180;
    
    // Handle is at width/2 + 16, -height/2 - 16 in local space
    const hxLocal = item.width/2 + 16;
    const hyLocal = -item.height/2 - 16;
    
    // Rotate to world space
    const hxWorld = cx + hxLocal * Math.cos(angle) - hyLocal * Math.sin(angle);
    const hyWorld = cy + hxLocal * Math.sin(angle) + hyLocal * Math.cos(angle);
    
    const dist = Math.sqrt((x - hxWorld)**2 + (y - hyWorld)**2);
    return dist <= 12; // 12px hit radius
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCanvasMouse(e);
    
    // 1. Check if clicking rotation handle of selected item
    if (selectedId) {
       const selectedItem = items.find(i => i.id === selectedId);
       if (selectedItem && checkRotationHandleHit(x, y, selectedItem)) {
          isRotating.current = true;
          return;
       }
    }

    // 2. Check if clicking on item
    // loop reversed so top items are checked first
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (checkHit(x, y, item)) {
        setSelectedId(item.id);
        isDragging.current = true;
        dragOffset.current = { x: x - item.x, y: y - item.y };
        return;
      }
    }

    // 3. Clicked empty space
    setSelectedId(null);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!selectedId) return;
    const { x, y } = getCanvasMouse(e);
    
    if (isRotating.current) {
      const item = items.find(i => i.id === selectedId);
      if (item) {
        const cx = item.x + item.width/2;
        const cy = item.y + item.height/2;
        let angle = Math.atan2(y - cy, x - cx) * 180 / Math.PI;
        
        // Atan2 expects handle to be right (0 deg). Our handle is top-right (-45 deg approx).
        // Let's just adjust the diff
        angle += 45; 
        
        // Snapping to 15 degrees if shift held
        if (e.shiftKey) {
           angle = Math.round(angle / 15) * 15;
        }
        
        const newItems = items.map(i => i.id === selectedId ? { ...i, rotation: angle } : i);
        updateItems(newItems);
      }
    } else if (isDragging.current) {
      let newX = x - dragOffset.current.x;
      let newY = y - dragOffset.current.y;

      if (e.shiftKey) {
        newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
        newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
      }

      const newItems = items.map(i => i.id === selectedId ? { ...i, x: newX, y: newY } : i);
      updateItems(newItems);
    }
  };

  const handlePointerUp = () => {
    if (isDragging.current || isRotating.current) {
       saveToHistory(items);
    }
    isDragging.current = false;
    isRotating.current = false;
  };

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-[#f8f9fa] rounded-2xl overflow-hidden border border-border shadow-md">
      
      {/* LEFT SIDEBAR - Tools */}
      <div className="w-full lg:w-72 bg-white flex flex-col border-r border-border shrink-0 order-2 lg:order-1 h-64 lg:h-auto overflow-y-auto custom-scrollbar">
        {/* Toolbar Top */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div className="flex gap-1.5">
            <button onClick={handleUndo} disabled={historyIndex === 0} className="p-2 rounded-lg text-slate-600 hover:bg-white disabled:opacity-30 border-transparent hover:border-border border transition-all"><Undo className="w-4 h-4"/></button>
            <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="p-2 rounded-lg text-slate-600 hover:bg-white disabled:opacity-30 border-transparent hover:border-border border transition-all"><Redo className="w-4 h-4"/></button>
            <div className="w-px h-6 bg-border mx-1 self-center" />
            <button onClick={handleClear} className="p-2 rounded-lg text-red-500 hover:bg-white hover:text-red-600 border-transparent hover:border-red-100 border transition-all"><Trash2 className="w-4 h-4"/></button>
          </div>
          <button onClick={handleSaveLayout} className="pl-3 pr-4 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-sm border border-indigo-100"><Download className="w-3.5 h-3.5"/> Save</button>
        </div>

        <div className="p-5 flex flex-col gap-6">
          {/* Furniture Section */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#c8622a]" /> Furniture</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {ITEM_TYPES.map(type => (
                <button 
                  key={type.label}
                  onClick={() => addItem(type)}
                  className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 bg-white hover:border-[#c8622a] hover:bg-orange-50 active:scale-95 transition-all text-left shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                >
                  <span className="text-xl shrink-0">{type.emoji}</span>
                  <span className="text-xs font-bold text-slate-600 leading-tight">{type.label}</span>
                </button>
              ))}
            </div>
          </section>

          <hr className="border-border" />

          {/* Room Customize */}
          <section className="pb-4">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings2 className="w-4 h-4 text-[#c8622a]" /> Room Setup</h3>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Dimensions (H x W)</div>
                <div className="flex gap-4 items-center mb-1">
                   <div className="flex-1">
                      <input type="range" min="3" max="8" step="0.5" value={dimensions.width} onChange={e => setDimensions({ ...dimensions, width: parseFloat(e.target.value) })} className="w-full accent-[#c8622a]" />
                   </div>
                   <div className="w-12 text-right text-sm font-semibold text-[#1a1208]">{dimensions.width}m</div>
                </div>
                <div className="flex gap-4 items-center">
                   <div className="flex-1">
                      <input type="range" min="3" max="6" step="0.5" value={dimensions.height} onChange={e => setDimensions({ ...dimensions, height: parseFloat(e.target.value) })} className="w-full accent-[#c8622a]" />
                   </div>
                   <div className="w-12 text-right text-sm font-semibold text-[#1a1208]">{dimensions.height}m</div>
                </div>
              </div>

              <div>
                 <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider pl-1">Wall Color</div>
                 <div className="flex gap-2">
                    {ROOM_COLORS.map(c => (
                      <button key={c} onClick={() => setWallColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${wallColor === c ? "border-[#c8622a] scale-110 shadow-md" : "border-transparent shadow-sm hover:scale-110"}`} style={{ backgroundColor: c }} />
                    ))}
                 </div>
              </div>

              <div>
                 <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider pl-1">Floor Type</div>
                 <select value={floorType} onChange={e => setFloorType(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#c8622a] focus:ring-1 focus:ring-[#c8622a] transition-all shadow-sm">
                   {FLOOR_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                 </select>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* CENTER - Canvas Area */}
      <div className="flex-1 flex flex-col relative order-1 lg:order-2">
        <div className="absolute top-4 inset-x-0 flex justify-center z-10 pointer-events-none">
          <div className="bg-white/80 backdrop-blur px-5 py-2 rounded-full shadow-sm border border-black/5 text-xs font-bold text-slate-600 tracking-wide">
             Draw & Drop to Arrange
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-slate-100 flex items-center justify-center p-4">
          <canvas 
            ref={canvasRef}
            width={600}
            height={480}
            className="w-full max-w-[600px] h-auto shadow-2xl rounded-sm border-[4px] border-white touch-none"
            style={{ 
              maxWidth: "600px", 
              aspectRatio: "600/480", 
              cursor: isDragging.current ? "grabbing" : "default" 
            }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          />
        </div>
        
        {/* Bottom Action */}
        <div className="p-4 bg-white border-t border-border flex justify-between items-center z-10">
          {onSkip ? (
            <button onClick={onSkip} className="text-slate-500 font-semibold text-sm hover:text-slate-800 transition-colors px-4 py-2">Skip this step</button>
          ) : <div/>}
          <button 
            onClick={() => onGenerateFromLayout(items, dimensions)}
            className="bg-[#c8622a] hover:bg-[#b05220] text-white font-bold py-3.5 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-sm"
          >
            Generate Design <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RIGHT SIDEBAR - Properties Panel */}
      {selectedItem && (
        <div className="absolute right-0 top-0 bottom-[80px] w-64 bg-white/95 backdrop-blur-xl border-l border-border shadow-2xl p-5 flex flex-col gap-6 animate-in slide-in-from-right-10 z-20">
          <div className="flex justify-between items-center pb-3 border-b border-border/50">
             <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><span className="text-xl leading-none">{ITEM_TYPES.find(t => t.type === selectedItem.type)?.emoji}</span> {selectedItem.label}</h3>
             <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><X className="w-4 h-4"/></button>
          </div>

          <div className="space-y-4 flex-1">
             <div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Item Color</div>
               <div className="flex flex-wrap gap-2">
                 {ROOM_COLORS.map(c => (
                   <button 
                     key={c} 
                     onClick={() => updateItemsAndSave(items.map(i => i.id === selectedId ? {...i, color: c} : i))}
                     className={`w-8 h-8 rounded-full border-2 transition-all ${selectedItem.color === c ? "border-[#c8622a] scale-110 shadow-md" : "border-transparent shadow-sm hover:scale-110"}`} 
                     style={{ backgroundColor: c }} 
                   />
                 ))}
               </div>
             </div>
             
             <div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Rotation</div>
               <input 
                 type="range" min="0" max="360" value={Math.round(selectedItem.rotation)} 
                 onChange={e => updateItems(items.map(i => i.id === selectedId ? {...i, rotation: parseInt(e.target.value)} : i))}
                 onMouseUp={() => saveToHistory(items)}
                 className="w-full accent-[#c8622a]" 
               />
               <div className="text-right text-xs font-bold text-slate-500 mt-1">{Math.round(selectedItem.rotation)}°</div>
             </div>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
             <button 
               onClick={() => {
                 const newItem = { ...selectedItem, id: "f-" + Date.now(), x: selectedItem.x + 20, y: selectedItem.y + 20 };
                 updateItemsAndSave([...items, newItem]);
                 setSelectedId(newItem.id);
               }}
               className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-colors border border-slate-200"
             >
               <Copy className="w-3.5 h-3.5"/> Duplicate Item
             </button>
             <button 
               onClick={() => {
                 updateItemsAndSave(items.filter(i => i.id !== selectedId));
                 setSelectedId(null);
               }}
               className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors border border-red-100"
             >
               <Trash2 className="w-3.5 h-3.5"/> Delete Item
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
