import { useState } from "react";
import { TrendingUp, Eye } from "lucide-react";
import Preview3D from "./tabs/Preview3D";
import BeforeAfter from "./tabs/BeforeAfter";
import Suggestions from "./tabs/Suggestions";
import StyleDNA from "./tabs/StyleDNA";

import heroRoom from "@/assets/hero-room.jpg";
import roomCalm from "@/assets/room-calm.jpg";
import roomLuxury from "@/assets/room-luxury.jpg";
import roomCozy from "@/assets/room-cozy.jpg";

const tabs = ["3D Preview", "Before / After", "Suggestions", "Style DNA"];

const inspirationRooms = [
  { image: roomCalm, label: "Nordic Calm", views: "2.4k" },
  { image: roomLuxury, label: "Dark Luxe", views: "3.1k" },
  { image: roomCozy, label: "Warm Boho", views: "1.8k" },
];

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
      <div className="flex-1 p-5 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)] relative">
        {/* Background glow */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero trending card */}
        <div className="mb-6 animate-fade-up">
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ height: 240 }}>
            <img
              src={heroRoom}
              alt="Trending design"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                <span className="text-[10px] font-semibold text-secondary uppercase tracking-widest">Trending Design</span>
              </div>
              <h2 className="text-lg font-bold" style={{ lineHeight: 1.2 }}>Japandi Living Room</h2>
              <p className="text-xs text-white/60 mt-1">Warm wood tones · Minimal furniture · Natural light</p>
            </div>
            <div className="absolute top-4 right-4 glass-panel px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-white/60" />
              <span className="text-[10px] font-medium text-white/60">5.2k views</span>
            </div>
          </div>
        </div>

        {/* Inspiration grid */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
            Popular Styles
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {inspirationRooms.map((room, i) => (
              <div
                key={room.label}
                className="relative rounded-xl overflow-hidden group cursor-pointer aspect-[4/3] animate-fade-up"
                style={{ animationDelay: `${150 + i * 60}ms`, animationFillMode: "backwards" }}
              >
                <img
                  src={room.image}
                  alt={room.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-semibold">{room.label}</p>
                  <p className="text-[10px] text-white/50">{room.views} saves</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state prompt */}
        <div className="text-center py-8 animate-fade-up" style={{ animationDelay: "350ms", animationFillMode: "backwards" }}>
          <div className="w-16 h-16 mx-auto rounded-2xl glass-card flex items-center justify-center text-2xl mb-3">
            🏠
          </div>
          <p className="text-sm font-medium">Upload a room to get started</p>
          <p className="text-xs text-muted-foreground mt-1">Configure your mood, budget, and style on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-5 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)] relative">
      {/* Background glow */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="mb-6 animate-fade-up relative z-10">
        <h1 className="text-2xl font-bold text-balance" style={{ lineHeight: 1.1 }}>
          Your Room Transformation
        </h1>
        <p className="text-sm text-muted-foreground mt-2">AI-powered design based on your preferences</p>
      </div>

      {/* Summary pills */}
      {config && (
        <div className="flex flex-wrap gap-2.5 mb-6 animate-fade-up relative z-10" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
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
      <div className="flex gap-1 glass-panel rounded-xl p-1 mb-6 animate-fade-up overflow-x-auto relative z-10" style={{ animationDelay: "150ms", animationFillMode: "backwards" }}>
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
      <div className="animate-fade-up relative z-10" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
        {activeTab === 0 && <Preview3D />}
        {activeTab === 1 && <BeforeAfter />}
        {activeTab === 2 && <Suggestions config={config} />}
        {activeTab === 3 && <StyleDNA config={config} />}
      </div>
    </div>
  );
}
