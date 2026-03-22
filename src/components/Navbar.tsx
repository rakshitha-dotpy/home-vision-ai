import { useState } from "react";
import { Sparkles } from "lucide-react";

const navItems = ["Studio", "Explore", "Saved"];

export default function Navbar() {
  const [active, setActive] = useState("Studio");

  return (
    <nav className="h-16 glass-panel border-t-0 border-x-0 flex items-center justify-between px-6 relative z-50">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg tracking-tight">RoomGenie AI</span>
      </div>

      <div className="hidden sm:flex items-center gap-1 glass-panel rounded-full px-1.5 py-1">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              active === item
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button className="px-4 py-2 rounded-full text-sm font-medium glass-panel hover:bg-white/[0.08] transition-colors active:scale-[0.97]">
        Free Demo
      </button>
    </nav>
  );
}
