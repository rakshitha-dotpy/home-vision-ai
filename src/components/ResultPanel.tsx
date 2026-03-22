import { useState } from "react";
import Preview3D from "./tabs/Preview3D";
import BeforeAfter from "./tabs/BeforeAfter";
import Suggestions from "./tabs/Suggestions";
import StyleDNA from "./tabs/StyleDNA";

const tabs = ["3D Preview", "Before / After", "Suggestions", "Style DNA"];

interface Config {
  mood: string;
  budget: number;
  style: string;
}

interface Props {
  hasResult: boolean;
  config: Config | null;
}

export default function ResultPanel({ hasResult, config }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  if (!hasResult) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4 opacity-60">
          <div className="w-20 h-20 mx-auto rounded-2xl glass-card flex items-center justify-center text-3xl">
            🏠
          </div>
          <div>
            <p className="text-lg font-medium">Design your space</p>
            <p className="text-sm text-muted-foreground mt-1">Upload a room photo and configure your preferences to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-5 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="mb-6 animate-fade-up" style={{ animationDelay: "0ms" }}>
        <h1 className="text-2xl font-bold text-balance" style={{ lineHeight: 1.1 }}>
          Your Room Transformation
        </h1>
        <p className="text-sm text-muted-foreground mt-2">AI-powered design based on your preferences</p>
      </div>

      {/* Summary pills */}
      {config && (
        <div className="flex flex-wrap gap-2.5 mb-6 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <span className="glass-card px-3 py-1.5 text-xs">
            <span className="text-muted-foreground">Style:</span>{" "}
            <span className="font-medium">{config.style}</span>
          </span>
          <span className="glass-card px-3 py-1.5 text-xs">
            <span className="text-muted-foreground">Budget:</span>{" "}
            <span className="font-medium text-success">₹{config.budget.toLocaleString("en-IN")}</span>
          </span>
          <span className="glass-card px-3 py-1.5 text-xs">
            <span className="text-muted-foreground">Mood:</span>{" "}
            <span className="font-medium capitalize">{config.mood}</span>
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 glass-panel rounded-xl p-1 mb-6 animate-fade-up overflow-x-auto" style={{ animationDelay: "150ms", animationFillMode: "backwards" }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.97] ${
              activeTab === i
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
        {activeTab === 0 && <Preview3D />}
        {activeTab === 1 && <BeforeAfter />}
        {activeTab === 2 && <Suggestions config={config} />}
        {activeTab === 3 && <StyleDNA config={config} />}
      </div>
    </div>
  );
}
