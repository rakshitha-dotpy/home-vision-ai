import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import DesignSidebar from "@/components/DesignSidebar";
import ResultPanel from "@/components/ResultPanel";
import LoadingOverlay from "@/components/LoadingOverlay";

interface Config {
  mood: string;
  budget: number;
  style: string;
  image: string | null;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("Home");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [config, setConfig] = useState<Config | null>(null);

  const handleGenerate = useCallback((c: Config) => {
    setConfig(c);
    setIsGenerating(true);
    setHasResult(false);
    setTimeout(() => {
      setIsGenerating(false);
      setHasResult(true);
    }, 2500);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Home") {
      setHasResult(false);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="sunlight-glow" />
      <div className="lamp-glow" />

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === "Studio" ? (
        <div className="flex flex-1 flex-col lg:flex-row relative z-10">
          <DesignSidebar onGenerate={handleGenerate} isGenerating={isGenerating} />
          {isGenerating ? (
            <LoadingOverlay />
          ) : (
            <ResultPanel hasResult={hasResult} config={config} />
          )}
        </div>
      ) : (
        <LandingPage onStartStudio={() => setActiveTab("Studio")} />
      )}
    </div>
  );
}
