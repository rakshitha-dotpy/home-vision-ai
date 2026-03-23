import { useEffect, useState } from "react";
import { Brain } from "lucide-react";

interface Props {
  mood: string;
  style: string;
  budget: number;
}

export default function AIReasoning({ mood, style, budget }: Props) {
  const fullText = `Based on your ${mood} mood and ₹${budget.toLocaleString("en-IN")} budget, I recommend a ${style}-inspired approach. The color palette draws from natural earth tones to create a grounding atmosphere. Furniture selections prioritize quality craftsmanship within your range, favoring pieces with clean silhouettes and warm material textures. Lighting layers — ambient, task, and accent — will reinforce the ${mood} atmosphere while keeping the space functional throughout the day.`;

  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayed(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="bg-white border border-border rounded-2xl p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Design Reasoning</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {displayed}
        <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse-glow align-middle" />
      </p>
    </div>
  );
}
