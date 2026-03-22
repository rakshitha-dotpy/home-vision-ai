import AIReasoning from "../AIReasoning";

const suggestions = [
  {
    name: "Japandi Minimal",
    desc: "Clean lines with warm wood tones and neutral earth palette.",
    colors: ["#C4A882", "#8B7355", "#E8DDD0", "#4A4A4A", "#F5F0EB"],
    items: [
      { name: "Oak Coffee Table", price: "₹8,200" },
      { name: "Linen Sofa", price: "₹24,500" },
      { name: "Bamboo Shelf", price: "₹4,800" },
      { name: "Clay Vase Set", price: "₹1,200" },
    ],
  },
  {
    name: "Nordic Calm",
    desc: "Airy whites with soft textures and minimal clutter.",
    colors: ["#F0EDE8", "#B8C5C3", "#7A9E9F", "#DDD5C7", "#4B5E5E"],
    items: [
      { name: "Curve Armchair", price: "₹12,000" },
      { name: "Wool Rug", price: "₹6,400" },
      { name: "Pendant Light", price: "₹3,800" },
      { name: "Plant Stand", price: "₹1,600" },
    ],
  },
  {
    name: "Urban Luxe",
    desc: "Dark moody tones with brass accents and velvet textures.",
    colors: ["#1C1C2E", "#8B6914", "#4A3B6B", "#C9B99A", "#2D2D3F"],
    items: [
      { name: "Velvet Sofa", price: "₹32,000" },
      { name: "Brass Floor Lamp", price: "₹7,500" },
      { name: "Marble Side Table", price: "₹9,200" },
      { name: "Art Print Set", price: "₹3,400" },
    ],
  },
];

interface Props {
  config: { mood: string; budget: number; style: string } | null;
}

export default function Suggestions({ config }: Props) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {suggestions.map((s, i) => (
          <div
            key={s.name}
            className="glass-card p-4 space-y-3 transition-all duration-300 hover:scale-[1.02] hover:border-white/15"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <h4 className="font-semibold text-sm">{s.name}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            <div className="flex gap-1.5">
              {s.colors.map((c) => (
                <div
                  key={c}
                  className="w-5 h-5 rounded-full border border-white/10"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="space-y-1.5 pt-1">
              {s.items.map((item) => (
                <div key={item.name} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="text-success font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {config && <AIReasoning mood={config.mood} style={config.style} budget={config.budget} />}
    </div>
  );
}
