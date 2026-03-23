import { useState } from "react";
import { Sparkles } from "lucide-react";
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
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div className="space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Your design will appear here</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Upload a room photo, choose your mood and style, then click Generate to see your transformation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-5 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)] relative">
      {/* Result header */}
      <div className="mb-6 animate-fade-up relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">Transformation Complete</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground" style={{ lineHeight: 1.1 }}>
          Your Room, Reimagined
        </h1>
        <p className="text-sm text-muted-foreground mt-2">Here's what AI designed based on your preferences</p>
      </div>

      {/* Summary pills */}
      {config && (
        <div className="flex flex-wrap gap-2.5 mb-6 animate-fade-up relative z-10" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <span className="bg-white border border-border rounded-2xl px-3 py-1.5 text-xs shadow-sm">
            <span className="text-muted-foreground">Style:</span>{" "}
            <span className="font-medium text-foreground">{config.style}</span>
          </span>
          <span className="bg-white border border-border rounded-2xl px-3 py-1.5 text-xs shadow-sm">
            <span className="text-muted-foreground">Budget:</span>{" "}
            <span className="font-medium text-success">₹{config.budget.toLocaleString("en-IN")}</span>
          </span>
          <span className="bg-white border border-border rounded-2xl px-3 py-1.5 text-xs shadow-sm">
            <span className="text-muted-foreground">Mood:</span>{" "}
            <span className="font-medium capitalize text-foreground">{config.mood}</span>
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white/80 backdrop-blur-sm border border-border rounded-xl p-1 mb-6 animate-fade-up overflow-x-auto relative z-10 shadow-sm" style={{ animationDelay: "150ms", animationFillMode: "backwards" }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.97] ${
              activeTab === i
                ? "bg-primary/15 text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="animate-fade-up relative z-10" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
        {activeTab === 0 && <Preview3D />}
        {activeTab === 1 && <BeforeAfter />}
        {activeTab === 2 && <Suggestions config={config} />}
        {activeTab === 3 && <StyleDNA config={config} />}
      </div>
    </div>
  );
}
