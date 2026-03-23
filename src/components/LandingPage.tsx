import { ArrowRight, Eye, Sparkles } from "lucide-react";

import heroTransformation from "@/assets/hero-transformation.jpg";
import heroRoom from "@/assets/hero-room.jpg";
import roomCalm from "@/assets/room-calm.jpg";
import roomLuxury from "@/assets/room-luxury.jpg";
import roomCozy from "@/assets/room-cozy.jpg";
import styleModern from "@/assets/style-modern.jpg";
import styleJapandi from "@/assets/style-japandi.jpg";

interface Props {
  onStartStudio: () => void;
}

const transformations = [
  { before: heroRoom, after: roomLuxury, style: "Urban Luxe", views: "3.1k" },
  { before: roomCalm, after: styleJapandi, style: "Japandi Calm", views: "2.4k" },
  { before: roomCozy, after: styleModern, style: "Modern Refresh", views: "1.8k" },
];

export default function LandingPage({ onStartStudio }: Props) {
  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                  AI Powered Transformation
                </span>
              </div>

              <h1
                className="text-4xl lg:text-5xl font-bold text-foreground leading-[1.08]"
                style={{ textWrap: "balance" }}
              >
                Visualize Your Dream Room Instantly
              </h1>

              <p className="text-base text-muted-foreground leading-relaxed max-w-md" style={{ textWrap: "pretty" }}>
                Upload your room, choose a mood, get a photorealistic redesign — before spending a single rupee.
              </p>

              {/* Social proof */}
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                3,847 rooms transformed today
              </div>

              <button
                onClick={onStartStudio}
                className="px-8 py-4 rounded-2xl text-base font-semibold bg-primary text-primary-foreground
                  transition-all duration-200 active:scale-[0.97] hover:brightness-90 shadow-lg shadow-primary/20"
              >
                Transform My Room
              </button>
            </div>

            {/* Right — hero image */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl shadow-foreground/10 animate-fade-up group"
              style={{ animationDelay: "120ms", animationFillMode: "backwards" }}
            >
              <img
                src={heroTransformation}
                alt="Room transformation before and after"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              {/* Before/After badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-border rounded-xl px-3 py-2 shadow-md">
                <div className="w-14 h-10 rounded-lg overflow-hidden opacity-60">
                  <img src={heroRoom} alt="before" className="w-full h-full object-cover grayscale" />
                </div>
                <ArrowRight className="w-4 h-4 text-primary" />
                <div className="w-14 h-10 rounded-lg overflow-hidden border-2 border-primary/40">
                  <img src={roomLuxury} alt="after" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-3">How It Works</h2>
          <p className="text-sm text-muted-foreground text-center mb-10 max-w-md mx-auto">
            Three simple steps to your dream room
          </p>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-border" />

            {[
              { step: "01", title: "Upload Your Room", desc: "Take a photo or upload an existing image of any room you want to transform", image: heroRoom },
              { step: "02", title: "Choose Your Style", desc: "Pick a mood, set your budget, and select from curated interior design styles", image: roomCalm },
              { step: "03", title: "See the Magic", desc: "Watch AI transform your room into a stunning redesign in seconds", image: heroTransformation },
            ].map((item, i) => (
              <div
                key={item.step}
                className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-up group"
                style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: "backwards" }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-primary tracking-widest">STEP {item.step}</span>
                  <h3 className="text-base font-semibold text-foreground mt-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR TRANSFORMATIONS */}
      <section className="py-16 px-6 lg:px-10 bg-white/40">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Popular Transformations</h2>
              <p className="text-sm text-muted-foreground mt-1">See what others have created</p>
            </div>
            <span className="text-xs text-muted-foreground">Updated daily</span>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {transformations.map((t, i) => (
              <div
                key={t.style}
                className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-[4/3] shadow-md animate-fade-up"
                style={{ animationDelay: `${600 + i * 80}ms`, animationFillMode: "backwards" }}
              >
                <img
                  src={t.after}
                  alt={t.style}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

                {/* Before thumbnail */}
                <div className="absolute top-3 left-3 w-16 h-12 rounded-lg overflow-hidden border-2 border-white/30 opacity-70">
                  <img src={t.before} alt="before" className="w-full h-full object-cover grayscale" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-semibold text-white">{t.style}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-white/60" />
                      <span className="text-xs text-white/60">{t.views}</span>
                    </div>
                    <button
                      onClick={onStartStudio}
                      className="text-[10px] font-medium text-white/80 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/25"
                    >
                      Try This Style
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-lg mx-auto space-y-5 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
          <h2 className="text-2xl font-bold text-foreground">Ready to Transform Your Space?</h2>
          <p className="text-sm text-muted-foreground">No sign-up needed. Upload a photo and see the magic.</p>
          <button
            onClick={onStartStudio}
            className="px-8 py-4 rounded-2xl text-base font-semibold bg-primary text-primary-foreground
              transition-all duration-200 active:scale-[0.97] hover:brightness-90 shadow-lg shadow-primary/20"
          >
            Transform My Room — It's Free
          </button>
        </div>
      </section>
    </div>
  );
}
