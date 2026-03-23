import { Sparkles } from "lucide-react";

const navItems = ["Studio", "Explore", "Saved"];

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: Props) {
  return (
    <nav className="h-16 bg-white/60 backdrop-blur-md border-b border-border flex items-center justify-between px-6 relative z-50">
      <div
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={() => onTabChange("home")}
      >
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg tracking-tight text-foreground">RoomGenie AI</span>
      </div>

      <div className="hidden sm:flex items-center gap-1 bg-white/80 border border-border rounded-full px-1.5 py-1 shadow-sm">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onTabChange(item.toLowerCase())}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
              activeTab === item.toLowerCase()
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        onClick={() => onTabChange("studio")}
        className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all active:scale-[0.97] shadow-sm"
      >
        Try Free
      </button>
    </nav>
  );
}
