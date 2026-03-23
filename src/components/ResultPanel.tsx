import { useState } from "react";
import { Eye, ArrowRight, Sparkles } from "lucide-react";
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
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-4rem)] relative">
        {/* Decorative ambient blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(25,55%,45%,0.04)] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(150,30%,40%,0.03)] rounded-full blur-[120px] pointer-events-none" />

        {/* HERO */}
        <div className="relative overflow-hidden">
          <div className="relative h-[280px] lg:h-[320px] overflow-hidden rounded-b-3xl">
            <img src={heroRoom} alt="Beautiful room" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(30,25%,96%)] via-transparent to-white/30" />

            <div className="absolute inset-0 flex items-center px-6 lg:px-10">
              <div className="max-w-lg space-y-4">
                <div className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: "0ms" }}>
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">AI Powered Transformation</span>
                </div>
                <h1
                  className="text-2xl lg:text-3xl font-bold leading-[1.1] text-foreground animate-fade-up"
                  style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
                >
                  Visualize Your Dream
                  <br />
                  Room <span className="text-primary">Instantly</span>
                </h1>
                <p
                  className="text-sm text-muted-foreground max-w-xs leading-relaxed animate-fade-up"
                  style={{ animationDelay: "160ms", animationFillMode: "backwards" }}
                >
                  Upload your room, choose your mood, and watch AI redesign it — before you spend a single rupee.
                </p>
                <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: "240ms", animationFillMode: "backwards" }}>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 border border-border shadow-sm text-xs font-medium text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    3,847 rooms transformed today
                  </div>
                </div>
              </div>
            </div>

            {/* Mini before/after badge */}
            <div className="absolute bottom-4 right-4 lg:right-8 bg-white/80 backdrop-blur-md border border-border rounded-xl p-2 flex items-center gap-2 shadow-sm animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "backwards" }}>
              <div className="w-16 h-12 rounded-lg overflow-hidden opacity-50">
                <img src={heroRoom} alt="before" className="w-full h-full object-cover grayscale" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
              <div className="w-16 h-12 rounded-lg overflow-hidden border border-primary/30">
                <img src={roomLuxury} alt="after" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="px-5 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { step: "01", title: "Upload", desc: "Snap your room", icon: "📸" },
              { step: "02", title: "Customize", desc: "Mood + budget", icon: "🎨" },
              { step: "03", title: "Transform", desc: "AI redesigns it", icon: "✨" },
            ].map((item, i) => (
              <div
                key={item.step}
                className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-4 text-center group hover:shadow-md hover:border-primary/20 transition-all duration-300 hover:scale-[1.02] animate-fade-up shadow-sm"
                style={{ animationDelay: `${400 + i * 80}ms`, animationFillMode: "backwards" }}
              >
                <span className="text-2xl block mb-2">{item.icon}</span>
                <span className="text-[10px] text-primary font-bold tracking-wider">{item.step}</span>
                <p className="text-xs font-semibold mt-1 text-foreground">{item.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Inspiration gallery */}
          <div>
            <div className="flex items-center justify-between mb-3 animate-fade-up" style={{ animationDelay: "650ms", animationFillMode: "backwards" }}>
              <h3 className="text-sm font-semibold text-foreground">Popular Transformations</h3>
              <span className="text-[10px] text-muted-foreground">Updated daily</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {inspirationRooms.map((room, i) => (
                <div
                  key={room.label}
                  className="relative rounded-xl overflow-hidden group cursor-pointer aspect-[4/3] shadow-sm animate-fade-up"
                  style={{ animationDelay: `${700 + i * 60}ms`, animationFillMode: "backwards" }}
                >
                  <img
                    src={room.image}
                    alt={room.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <p className="text-[11px] font-semibold text-white">{room.label}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Eye className="w-2.5 h-2.5 text-white/60" />
                      <span className="text-[9px] text-white/60">{room.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-5 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)] relative">
      <div className="absolute top-10 right-10 w-80 h-80 bg-[hsl(25,55%,45%,0.04)] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-[hsl(150,30%,40%,0.03)] rounded-full blur-[80px] pointer-events-none" />

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
