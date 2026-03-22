import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <DesignSidebar onGenerate={handleGenerate} isGenerating={isGenerating} />
        {isGenerating ? (
          <LoadingOverlay />
        ) : (
          <ResultPanel hasResult={hasResult} config={config} />
        )}
      </div>
    </div>
  );
}
