import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import DesignSidebar from "@/components/DesignSidebar";
import AILoader from "@/components/AILoader";
import { generateDesign, DesignResult, FurnitureItem } from "@/api/designApi";
import { Wand2, UploadCloud, ArrowRight, LayoutDashboard, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import MoodBoardResult from "@/components/MoodBoardResult";
import ARPreview from "@/components/ARPreview";
import SocialFeed, { PublishModal } from "@/components/SocialFeed";
import FloorPlanEditor from "@/components/FloorPlanEditor";

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  
  // Studio State
  const [studioStep, setStudioStep] = useState<1 | 2 | 3 | 4>(1);
  const [uploadedImageURL, setUploadedImageURL] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  
  const [furnitureLayout, setFurnitureLayout] = useState<FurnitureItem[]>([]);
  const [roomDimensions, setRoomDimensions] = useState({ width: 5, height: 4 });
  
  const [selectedStyle, setSelectedStyle] = useState("Modern");
  const [selectedMood, setSelectedMood] = useState("Calm");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [designResults, setDesignResults] = useState<DesignResult[]>([]);
  
  // Modals / Overlays
  const [showAR, setShowAR] = useState(false);
  const [arResult, setArResult] = useState<DesignResult | null>(null);
  
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishResult, setPublishResult] = useState<DesignResult | null>(null);

  // Saved Tab State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "saved") {
      try {
        const stored = localStorage.getItem("roomgenie_community");
        const savedIdsStored = localStorage.getItem("roomgenie_saved");
        const communityFeed = stored ? JSON.parse(stored) : [];
        const savedIds = savedIdsStored ? JSON.parse(savedIdsStored) : [];
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mySaved = communityFeed.filter((item: any) => savedIds.includes(item.id));
        setSavedDesigns(mySaved);
      } catch (e) {
        console.error(e);
      }
    }
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "studio" && studioStep > 4) {
       setStudioStep(1); // Reset if needed, but let's keep state
    }
  };

  const handleDemoMode = () => {
    setActiveTab("studio");
    setUploadedImageURL("https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800");
    setStudioStep(2);
  };

  const handleGenerate = async () => {
    if (!uploadedImageURL && !uploadedImage) {
      toast.error("Please upload an image first.");
      setStudioStep(1);
      return;
    }
    
    setStudioStep(4);
    setIsGenerating(true);
    setDesignResults([]);
    
    try {
      const results = await generateDesign(uploadedImage || uploadedImageURL, selectedStyle, selectedMood, furnitureLayout);
      setDesignResults(results);
    } catch (err) {
      toast.error((err as Error).message || "Transform failed. Please try again.");
      setStudioStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#f5f0e8]">
      <div className="sunlight-glow" />
      <div className="lamp-glow" />

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === "studio" && (
        <div className="flex-1 flex flex-col relative z-10 p-4 max-w-7xl mx-auto w-full gap-4">
          
          {/* STEP INDICATOR */}
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-border flex items-center justify-between mb-2">
            {[ 
              { step: 1, title: "Upload Photo", icon: UploadCloud },
              { step: 2, title: "Arrange Room", icon: LayoutDashboard },
              { step: 3, title: "Choose Style", icon: Sparkles },
              { step: 4, title: "Transform", icon: Wand2 }
            ].map((s, i, arr) => (
              <div key={s.step} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    studioStep === s.step ? "bg-[#c8622a] text-white shadow-md shadow-orange-500/20" : 
                    studioStep > s.step ? "bg-green-500 text-white" : 
                    "bg-slate-100 text-slate-400"
                  }`}>
                    {studioStep > s.step ? <CheckCircle2 className="w-5 h-5 fill-current text-green-100" /> : s.step}
                  </div>
                  <span className={`font-semibold hidden sm:block ${studioStep === s.step ? "text-[#1a1208]" : studioStep > s.step ? "text-slate-700" : "text-slate-400"}`}>
                    {s.title}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 sm:mx-4 rounded-full transition-colors ${studioStep > s.step ? "bg-green-500" : "bg-slate-100"}`} />
                )}
              </div>
            ))}
          </div>

          {/* STUDIO CONTENT */}
          <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-border overflow-hidden">
            {studioStep === 1 && (
              <div className="flex-1 flex flex-col lg:flex-row">
                 <DesignSidebar 
                   onGenerate={(config) => {
                     // Adapter for existing DesignSidebar
                     if (config.image) {
                       setUploadedImageURL(config.image);
                       setStudioStep(2);
                     }
                   }} 
                   isGenerating={false} 
                 />
                 <div className="flex-1 flex items-center justify-center bg-slate-50/50 p-8">
                    {!uploadedImageURL ? (
                      <div className="text-center max-w-sm">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                           <UploadCloud className="w-10 h-10 text-[#c8622a]" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Start your design</h3>
                        <p className="text-slate-500 font-medium">Upload a photo of your empty room to begin the magic.</p>
                      </div>
                    ) : (
                      <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-xl border border-slate-100 text-center animate-in zoom-in-95">
                        <img src={uploadedImageURL} alt="Preview" className="w-full h-48 object-cover rounded-xl mb-6 shadow-inner" />
                        <button 
                          onClick={() => setStudioStep(2)}
                          className="w-full py-4 bg-[#c8622a] text-white rounded-xl font-bold text-lg hover:bg-[#b05220] transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                          Next: Arrange Furniture <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {studioStep === 2 && (
              <div className="flex-1 overflow-hidden">
                 <FloorPlanEditor 
                   onSkip={() => setStudioStep(3)}
                   onGenerateFromLayout={(layout, dims) => {
                     setFurnitureLayout(layout);
                     setRoomDimensions(dims);
                     setStudioStep(3);
                   }}
                 />
              </div>
            )}

            {studioStep === 3 && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 relative">
                 <button onClick={() => setStudioStep(2)} className="absolute top-6 left-6 text-sm font-bold text-slate-500 hover:text-slate-800">← Back to Floor Plan</button>
                 
                 <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-8 mt-6">
                    <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                       <Sparkles className="text-[#c8622a]" /> Choose Your Vibe
                    </h2>
                    
                    <div className="space-y-6">
                       <div>
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block">Style</label>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {["Modern", "Japandi", "Luxury", "Nordic", "Industrial", "Minimal"].map(s => (
                              <button 
                                key={s} onClick={() => setSelectedStyle(s)}
                                className={`py-4 rounded-xl font-bold text-sm transition-all border-2 ${selectedStyle === s ? "border-[#c8622a] bg-orange-50 text-[#c8622a] shadow-md" : "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                       </div>
                       
                       <div>
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block">Mood</label>
                          <div className="flex gap-3">
                            {["Calm", "Cozy", "Energetic"].map(m => (
                              <button 
                                key={m} onClick={() => setSelectedMood(m)}
                                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all border-2 ${selectedMood === m ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50"}`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                       </div>
                    </div>
                    
                    <button 
                      onClick={handleGenerate}
                      className="w-full mt-10 py-5 bg-[#c8622a] text-white rounded-2xl font-black text-lg hover:bg-[#b05220] transition-colors shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <Wand2 className="w-6 h-6" /> Transform My Room
                    </button>
                 </div>
              </div>
            )}

            {studioStep === 4 && (
              <div className="flex-1 flex flex-col p-6 bg-slate-50/50 overflow-y-auto">
                 {isGenerating ? (
                   <div className="flex-1 flex items-center justify-center">
                      <AILoader 
                        length={roomDimensions.height} 
                        width={roomDimensions.width} 
                        budget={50000} 
                        mood={selectedMood} 
                        style={selectedStyle} 
                        area={roomDimensions.width * roomDimensions.height} 
                      />
                   </div>
                 ) : designResults.length > 0 ? (
                   <MoodBoardResult 
                     results={designResults} 
                     beforeImage={uploadedImageURL || ""} 
                     onSelect={() => {}}
                     onARPreview={(r) => { setArResult(r); setShowAR(true); }}
                     onShare={(r) => { setPublishResult(r); setShowPublishModal(true); }}
                     onTryAgain={() => setStudioStep(3)}
                   />
                 ) : (
                   <div className="text-center p-12 text-slate-500">Something went wrong. <button onClick={() => setStudioStep(3)} className="underline font-bold">Try again</button>.</div>
                 )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "explore" && (
        <SocialFeed onTryStyle={(style) => {
          setSelectedStyle(style);
          setStudioStep(3);
          setActiveTab("studio");
          toast.success(`Selected ${style} style. Please upload a photo to continue.`);
        }} />
      )}

      {activeTab === "saved" && (
        <div className="max-w-7xl mx-auto w-full p-6 py-12">
          <h2 className="text-3xl font-black text-slate-800 mb-8">Saved Inspiration</h2>
          {savedDesigns.length > 0 ? (
             <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {/* Minimal rendering of saved feed cards */}
                {savedDesigns.map(item => (
                   <div key={item.id} className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col group hover:shadow-md transition-shadow">
                     <div className="relative w-full h-[280px] overflow-hidden bg-slate-100">
                        <img src={item.afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 bg-[#c8622a] text-white px-3 py-1 rounded-md text-[11px] font-bold shadow-sm z-20">{item.style}</div>
                     </div>
                     <div className="p-4 flex flex-col gap-3">
                        <div className="text-sm font-medium text-slate-700 line-clamp-2">{item.caption}</div>
                        <button onClick={() => { setSelectedStyle(item.style); setStudioStep(3); setActiveTab("studio"); }} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#c8622a] bg-orange-50 hover:bg-orange-100 py-2.5 rounded-lg transition-colors mt-2">
                          Try this style <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                     </div>
                   </div>
                ))}
             </div>
          ) : (
             <div className="text-center p-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-6xl mb-4">🔖</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No saved designs yet</h3>
                <p className="text-slate-500 mb-6">Explore the community feed and save styles you love.</p>
                <button onClick={() => setActiveTab("explore")} className="px-6 py-3 bg-[#1a1208] text-white rounded-xl font-bold hover:bg-black transition-colors">Explore Community</button>
             </div>
          )}
        </div>
      )}

      {activeTab === "home" && (
        <LandingPage onStartStudio={() => setActiveTab("studio")} />
      )}

      {/* Floating Demo Mode Button */}
      {activeTab === "home" && (
        <button 
          onClick={handleDemoMode}
          className="fixed bottom-6 right-6 z-50 bg-[#C4622D] text-white px-6 py-3.5 rounded-full shadow-xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-orange-500/30"
        >
          <Wand2 className="w-5 h-5" />
          Watch Demo
        </button>
      )}

      {/* Modals & Overlays */}
      <ARPreview 
        isOpen={showAR} 
        onClose={() => setShowAR(false)} 
        colorPalette={arResult?.colorPalette || []} 
        styleName={arResult?.style || ""} 
      />
      
      <PublishModal 
        isOpen={showPublishModal} 
        onClose={() => setShowPublishModal(false)} 
        result={publishResult} 
        beforeImage={uploadedImageURL || "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800"} 
      />
    </div>
  );
}
