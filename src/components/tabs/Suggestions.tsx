import AIReasoning from "../AIReasoning";

import roomCalm from "@/assets/room-calm.jpg";
import roomLuxury from "@/assets/room-luxury.jpg";
import roomCozy from "@/assets/room-cozy.jpg";
import furnitureTable from "@/assets/furniture-table.jpg";
import furnitureSofa from "@/assets/furniture-sofa.jpg";
import furnitureChair from "@/assets/furniture-chair.jpg";
import furnitureLamp from "@/assets/furniture-lamp.jpg";

const suggestions = [
  {
    name: "Japandi Minimal",
    desc: "Clean lines with warm wood tones and neutral earth palette.",
    image: roomCalm,
    colors: ["#C4A882", "#8B7355", "#E8DDD0", "#4A4A4A", "#F5F0EB"],
    items: [
      { name: "Oak Coffee Table", price: "₹8,200", image: furnitureTable },
      { name: "Linen Sofa", price: "₹24,500", image: furnitureSofa },
      { name: "Bamboo Shelf", price: "₹4,800", image: furnitureLamp },
      { name: "Clay Vase Set", price: "₹1,200", image: furnitureChair },
    ],
  },
  {
    name: "Urban Luxe",
    desc: "Dark moody tones with brass accents and velvet textures.",
    image: roomLuxury,
    colors: ["#1C1C2E", "#8B6914", "#4A3B6B", "#C9B99A", "#2D2D3F"],
    items: [
      { name: "Velvet Sofa", price: "₹32,000", image: furnitureSofa },
      { name: "Brass Floor Lamp", price: "₹7,500", image: furnitureLamp },
      { name: "Marble Side Table", price: "₹9,200", image: furnitureTable },
      { name: "Accent Chair", price: "₹12,000", image: furnitureChair },
    ],
  },
  {
    name: "Warm Boho",
    desc: "Earthy hues with textured throws and organic materials.",
    image: roomCozy,
    colors: ["#B5835A", "#6B4226", "#D4B896", "#8B6F47", "#E8D5C0"],
    items: [
      { name: "Curve Armchair", price: "₹12,000", image: furnitureChair },
      { name: "Wool Rug", price: "₹6,400", image: furnitureSofa },
      { name: "Pendant Light", price: "₹3,800", image: furnitureLamp },
      { name: "Plant Stand", price: "₹1,600", image: furnitureTable },
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
            className="glass-card overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-white/15 hover:shadow-lg hover:shadow-primary/5 group"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Room image */}
            <div className="relative h-36 overflow-hidden">
              <img
                src={s.image}
                alt={s.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090f] via-transparent to-transparent" />
              <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80">
                {s.name}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>

              {/* Color palette */}
              <div className="flex gap-1.5">
                {s.colors.map((c) => (
                  <div
                    key={c}
                    className="w-5 h-5 rounded-full border border-white/10 transition-transform duration-200 hover:scale-125"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Furniture items with images */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {s.items.map((item) => (
                  <div key={item.name} className="glass-panel rounded-lg p-1.5 flex items-center gap-2 group/item hover:bg-white/[0.06] transition-colors">
                    <div className="w-9 h-9 rounded-md overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] truncate">{item.name}</p>
                      <p className="text-[10px] text-success font-medium">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {config && <AIReasoning mood={config.mood} style={config.style} budget={config.budget} />}
    </div>
  );
}
