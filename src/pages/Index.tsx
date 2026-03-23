import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import DesignSidebar from "@/components/DesignSidebar";
import DesignResult from "@/components/DesignResult";
import ExploreGallery from "@/components/ExploreGallery";
import SavedDesigns from "@/components/SavedDesigns";
import AILoader from "@/components/AILoader";
import { generateDesign } from "@/api/designApi";
import { Wand2 } from "lucide-react";
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

export default function Index() {
  const [activeTab, setActiveTab] = useState("Home");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [config, setConfig] = useState<Config | null>(null);
  const [resultData, setResultData] = useState<any>(null);

  const handleGenerate = useCallback(async (c: Config) => {
    setConfig(c);
    
    setIsGenerating(true);
    setHasResult(false);
    
    try {
      const result = await generateDesign(c);
      if (result.success) {
        setResultData(result);
        setHasResult(true);
      } else {
        throw new Error(result.error || "API failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Home") {
      setHasResult(false);
      setIsGenerating(false);
    }
  };

  const handleDemoMode = () => {
    setActiveTab("Studio");
    const demoConfig = {
      image: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800",
      mood: "luxury",
      budget: 65000,
      style: "Modern",
      length: 15,
      width: 12,
      height: 10,
      area: 180
    };
    handleGenerate(demoConfig);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="sunlight-glow" />
      <div className="lamp-glow" />

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === "Studio" ? (
        <div className="flex flex-1 flex-col lg:flex-row relative z-10 h-[calc(100vh-4rem)]">
          <DesignSidebar onGenerate={handleGenerate} isGenerating={isGenerating} />
          
          <div className="flex-1 relative h-full flex flex-col overflow-hidden">
            {isGenerating && config ? (
              <AILoader 
                length={config.length} 
                width={config.width} 
                budget={config.budget} 
                mood={config.mood} 
                style={config.style} 
                area={config.area} 
              />
            ) : hasResult && config && resultData ? (
              <DesignResult 
                hasResult={hasResult} 
                config={config} 
                resultData={resultData} 
                onReset={() => { setHasResult(false); setConfig(null); }} 
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Wand2 className="w-8 h-8 text-primary/40" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Ready to transform your space?</h3>
                <p className="text-muted-foreground max-w-sm text-center">
                  Upload a photo, set your dimensions, and watch our AI create your dream room in seconds.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === "Explore" ? (
        <ExploreGallery onTryStyle={(style, mood) => {
          // Prepopulating would require hoisting DesignSidebar state, but for hackathon demo switching to tab is okay
          setActiveTab("Studio");
          toast.success(`Selected ${style} style. Please upload a photo to continue.`);
        }} />
      ) : activeTab === "Saved" ? (
        <SavedDesigns onDesignSelect={(design) => {
          if (!design) {
            setActiveTab("Studio");
            return;
          }
          setConfig(design.config);
          setResultData(design.resultData);
          setHasResult(true);
          setActiveTab("Studio");
        }} />
      ) : (
        <LandingPage onStartStudio={() => setActiveTab("Studio")} />
      )}

      {/* Floating Demo Mode Button */}
      <button 
        onClick={handleDemoMode}
        className="fixed bottom-6 right-6 z-50 bg-[#C4622D] text-white px-5 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
      >
        <Wand2 className="w-5 h-5" />
        Watch Demo
      </button>
    </div>
  );
}
