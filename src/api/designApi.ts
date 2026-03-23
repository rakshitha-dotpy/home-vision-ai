export interface FurnitureItem {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
}

export interface DesignResult {
  id: string;
  style: string;
  mood: string;
  transformedImage: string;
  colorPalette: string[];  // 5 hex colors
  estimatedCostMin: number;
  estimatedCostMax: number;
  furnitureList: string[];
}

const MOCK_RESULTS: DesignResult[] = [
  {
    id: "modern",
    style: "Modern",
    mood: "Calm",
    transformedImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
    colorPalette: ["#F5F0E8","#C8622A","#2C2C2C","#8A7D6E","#D4C5B0"],
    estimatedCostMin: 45000,
    estimatedCostMax: 80000,
    furnitureList: ["Sectional Sofa","Coffee Table","Floor Lamp","Bookshelf"]
  },
  {
    id: "japandi",
    style: "Japandi",
    mood: "Calm",
    transformedImage: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
    colorPalette: ["#E8E0D0","#8B7355","#4A4A4A","#C4B49A","#6B8F71"],
    estimatedCostMin: 35000,
    estimatedCostMax: 65000,
    furnitureList: ["Low Profile Sofa","Wooden Coffee Table","Washi Lamp","Bamboo Plant"]
  },
  {
    id: "luxury",
    style: "Luxury",
    mood: "Cozy",
    transformedImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    colorPalette: ["#1A1208","#C8A96E","#8B6040","#D4C5A0","#2A1F0E"],
    estimatedCostMin: 120000,
    estimatedCostMax: 250000,
    furnitureList: ["Chesterfield Sofa","Marble Coffee Table","Crystal Chandelier","Persian Rug"]
  }
];

export async function generateDesign(
  image: File | string | null,
  style: string,
  mood: string,
  layout?: FurnitureItem[]
): Promise<DesignResult[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    // Stagger results — first at 2s, second at 2.8s, third at 3.5s
    const results = await Promise.all([
      new Promise<DesignResult>(r => setTimeout(() => r(MOCK_RESULTS[0]), 2000)),
      new Promise<DesignResult>(r => setTimeout(() => r(MOCK_RESULTS[1]), 2800)),
      new Promise<DesignResult>(r => setTimeout(() => r(MOCK_RESULTS[2]), 3500)),
    ]);
    return results;
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
