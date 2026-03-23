import { useState, useRef, useEffect } from "react";
import { X, Camera, Share as ShareIcon, Download } from "lucide-react";
import html2canvas from "html2canvas";

export interface ARFurniture {
  id: string;
  emoji: string;
  label: string;
  x: number;
  y: number;
  scale: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  colorPalette: string[];
  styleName: string;
}

const FURNITURE_OPTIONS = [
  { emoji: "🛋️", label: "Sofa" },
  { emoji: "🪑", label: "Chair" },
  { emoji: "💡", label: "Lamp" },
  { emoji: "🌿", label: "Plant" },
  { emoji: "📚", label: "Bookshelf" },
  { emoji: "🪴", label: "Pot" },
  { emoji: "🛏️", label: "Bed" },
  { emoji: "🖼️", label: "Art" },
];

export default function ARPreview({ isOpen, onClose, colorPalette, styleName }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState<string>(colorPalette[0] || "#ffffff");
  const [furnitureItems, setFurnitureItems] = useState<ARFurniture[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Dragging state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.innerWidth > 1024) {
      setIsDesktop(true);
    }
  }, []);

  const startCamera = async () => {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(ms);
      if (videoRef.current) {
        videoRef.current.srcObject = ms;
      }
      setError(null);
    } catch (err) {
      setError("Camera access needed for AR Preview. Please grant permission.");
    }
  };

  useEffect(() => {
    if (isOpen && !isDesktop) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isOpen, isDesktop, stream]);

  useEffect(() => {
    if (!canvasRef.current || !isOpen || isDesktop) return;
    
    let animationFrameId: number;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderLoop = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Top 60% Wall tint
      ctx.fillStyle = activeColor;
      ctx.globalAlpha = 0.28;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
      
      // Bottom 40% Floor tint
      ctx.fillStyle = colorPalette[2] || "#000000";
      ctx.globalAlpha = 0.18;
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
      
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen, activeColor, colorPalette, isDesktop]);

  if (!isOpen) return null;

  if (isDesktop) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center text-white backdrop-blur-xl">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="bg-white p-8 rounded-3xl text-center max-w-sm shadow-2xl">
          <h2 className="text-[#1a1208] text-2xl font-bold mb-2">AR Preview</h2>
          <p className="text-slate-600 mb-6 text-sm">AR works best on mobile devices. Scan this QR code to open the experience on your phone:</p>
          <div className="bg-slate-50 w-48 h-48 mx-auto rounded-2xl flex items-center justify-center border border-slate-200">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`} alt="QR Code" className="w-[150px] h-[150px] rounded-lg mix-blend-multiply" />
          </div>
        </div>
      </div>
    );
  }

  const handlePointerDown = (e: React.PointerEvent, item: ARFurniture) => {
    e.stopPropagation();
    if (e.pointerType === "mouse" || e.pointerType === "touch") {
      setDraggingId(item.id);
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId) return;
    setFurnitureItems(prev => prev.map(item => {
      if (item.id === draggingId) {
        return {
          ...item,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        };
      }
      return item;
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId) {
      const target = e.currentTarget as HTMLElement;
      target.releasePointerCapture(e.pointerId);
      setDraggingId(null);
    }
  };

  const addFurniture = (emoji: string, label: string) => {
    if (furnitureItems.length >= 5) return;
    setFurnitureItems(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      emoji,
      label,
      x: window.innerWidth / 2 - 40,
      y: window.innerHeight / 2 - 40,
      scale: 1
    }]);
  };

  const captureScreen = async () => {
    if (!containerRef.current) return;
    try {
      const canvas = await html2canvas(containerRef.current, { backgroundColor: null, useCORS: true });
      setCapturedImage(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error("Capture failed", err);
    }
  };

  const removeCaptured = () => setCapturedImage(null);

  return (
    <div className="fixed inset-0 z-[9999] bg-black text-white overflow-hidden select-none touch-none">
      {/* Container for HTML2Canvas */}
      <div ref={containerRef} className="absolute inset-0">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="mb-4 text-lg font-medium">{error}</p>
            <button onClick={startCamera} className="bg-[#c8622a] px-6 py-3 rounded-full font-bold shadow-lg">Grant Permission</button>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

        {/* Furniture Overlays */}
        {furnitureItems.map(item => (
          <div
            key={item.id}
            className="absolute flex flex-col items-center justify-center touch-none"
            style={{ 
              left: Math.max(0, Math.min(window.innerWidth - 80, item.x)), 
              top: Math.max(0, Math.min(window.innerHeight - 80, item.y)),
              transform: `scale(${item.scale})`,
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
              cursor: draggingId === item.id ? "grabbing" : "grab"
            }}
            onPointerDown={(e) => handlePointerDown(e, item)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={() => setFurnitureItems(prev => prev.filter(f => f.id !== item.id))}
          >
            <div className="text-6xl">{item.emoji}</div>
            <div className="bg-black/60 backdrop-blur block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md mt-1 shadow-sm">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Top Bar UI (Excluded from capture typically, but inside relative to window) */}
      <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div>
          <h1 className="font-bold text-xl leading-tight drop-shadow-md">AR Preview</h1>
          <span className="text-xs font-bold text-white/90 bg-white/20 backdrop-blur px-2.5 py-1 rounded-full mt-1.5 inline-block border border-white/10 shadow-sm">{styleName} Mode</span>
        </div>
        <button onClick={onClose} className="p-3 bg-black/40 backdrop-blur rounded-full pointer-events-auto active:scale-95 transition-all border border-white/10">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Toolbar */}
      <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xl pb-safe pt-4 px-4 rounded-t-3xl border-t border-white/10 flex flex-col gap-5">
        {/* Color Swatches */}
        <div className="flex gap-3 justify-center">
          {colorPalette.map(color => (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className={`w-10 h-10 rounded-full shadow-lg transition-all ${activeColor === color ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-80 hover:opacity-100 border border-white/20"}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        
        {/* Furniture Buttons + Capture */}
        <div className="flex items-center justify-between pb-6 gap-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-2.5 whitespace-nowrap px-2">
            {FURNITURE_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => addFurniture(opt.emoji, opt.label)}
                className="bg-white/15 hover:bg-white/25 border border-white/10 px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[72px] active:scale-95 transition-all"
              >
                <span className="text-2xl mb-1.5 drop-shadow-md">{opt.emoji}</span>
                <span className="text-[10px] font-bold tracking-wide text-white/90">{opt.label}</span>
              </button>
            ))}
          </div>
          
          <div className="px-2 border-l border-white/10 pl-4 shrink-0">
            <button 
              onClick={captureScreen}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
              <div className="w-14 h-14 rounded-full border-[3px] border-black/80 flex items-center justify-center">
                <Camera className="w-6 h-6 text-black/80" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Captured Image Modal */}
      {capturedImage && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col backdrop-blur-3xl animate-in zoom-in-95 duration-200">
          <div className="p-4 flex justify-between items-center border-b border-white/10">
            <h3 className="font-bold text-lg">Captured Design</h3>
            <button onClick={removeCaptured} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img src={capturedImage} alt="Capture" className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain border border-white/20" />
          </div>
          <div className="p-6 pb-8 flex gap-4 bg-black/80 border-t border-white/10">
            <a 
              href={capturedImage} 
              download="roomgenie-ar-preview.png"
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold transition-colors"
            >
              <Download className="w-5 h-5" /> Save to Device
            </a>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "My RoomGenie Design", text: "Check out my new room layout!", url: window.location.href });
                } else {
                  alert("Sharing not supported on this browser.");
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-[#c8622a] hover:bg-[#b05220] text-white py-4 rounded-xl font-bold transition-colors shadow-lg"
            >
              <ShareIcon className="w-5 h-5" /> Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
