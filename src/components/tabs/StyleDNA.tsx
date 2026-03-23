import { Share2 } from "lucide-react";

const palette = ["#C4A882", "#8B7355", "#E8DDD0", "#4A4A4A", "#F5F0EB", "#7A9E9F"];
const tags = ["Minimal", "Warm Tones", "Natural Light", "Clean Lines", "Textured", "Earth-Inspired"];

interface Props {
  config: { mood: string; style: string } | null;
}

export default function StyleDNA({ config }: Props) {
  const personality = config?.mood === "luxury" ? "The Curator" :
    config?.mood === "energy" ? "The Trailblazer" :
    config?.mood === "cozy" ? "The Homebody" :
    config?.mood === "bold" ? "The Maverick" :
    config?.mood === "minimal" ? "The Purist" : "The Minimalist";

  const tagline = config?.mood === "luxury" ? "Elegance in every detail" :
    config?.mood === "energy" ? "Bold moves, vibrant living" :
    config?.mood === "cozy" ? "Warmth as a lifestyle" :
    config?.mood === "bold" ? "Statement living, unapologetic style" :
    config?.mood === "minimal" ? "Space is the ultimate luxury" : "Less is the ultimate luxury";

  return (
    <div className="flex justify-center">
      <div className="bg-white border border-border rounded-2xl p-8 max-w-sm w-full text-center space-y-5 shadow-sm">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Your Design Personality</p>
          <h2 className="text-2xl font-bold text-foreground" style={{ lineHeight: 1.1 }}>{personality}</h2>
          <p className="text-sm text-muted-foreground mt-2 italic">"{tagline}"</p>
        </div>

        <div className="flex justify-center gap-2">
          {palette.map((c) => (
            <div
              key={c}
              className="w-7 h-7 rounded-full border border-border transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {tags.map((t) => (
            <span key={t} className="px-3 py-1 rounded-full text-[11px] bg-accent border border-border text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium bg-primary text-primary-foreground transition-all duration-200 active:scale-[0.96] hover:brightness-90 shadow-sm">
          <Share2 className="w-3.5 h-3.5" />
          Share Style DNA
        </button>
      </div>
    </div>
  );
}
