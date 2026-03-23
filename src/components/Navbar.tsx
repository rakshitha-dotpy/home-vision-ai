import { useState } from "react";
import { Sparkles } from "lucide-react";

const navItems = ["Studio", "Explore", "Saved"];

export default function Navbar() {
  const [active, setActive] = useState("Studio");

  return (
    <nav className="h-16 bg-white/60 backdrop-blur-md border-b border-border flex items-center justify-between px-6 relative z-50">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg tracking-tight text-foreground">RoomGenie AI</span>
      </div>

      <div className="hidden sm:flex items-center gap-1 bg-white/80 border border-border rounded-full px-1.5 py-1 shadow-sm">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              active === item
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button className="px-4 py-2 rounded-full text-sm font-medium bg-foreground text-background hover:opacity-90 transition-all active:scale-[0.97] shadow-sm">
        Free Demo
      </button>
    </nav>
  );
}
