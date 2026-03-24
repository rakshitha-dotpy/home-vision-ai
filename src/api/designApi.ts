const API_URL = 'https://home-vision-ai.onrender.com/api/generate-design';

export async function generateDesign(data: {
  image: string | null;
  mood: string;
  budget: number;
  style: string;
  length: number;
  width: number;
  height: number;
  area?: number;
}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const area = data.area || (data.length * data.width);
    
    return {
      success: true,
      transformedImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
      generatedImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
      style: data.style,
      mood: data.mood,
      description: `A stunning ${data.style} redesign with a ${data.mood} mood.`,
      roomAnalysis: {
        area: `${area} sq ft`,
        volume: `${area * data.height} cubic ft`,
        roomSize: area > 200 ? "Large" : "Medium",
        budgetPerSqFt: `₹${Math.round(data.budget / area)}/sq ft`,
        recommendation: "Focus on balancing natural light and warm textures."
      },
      colorPalette: ["#f5f0e8", "#c8622a", "#8a7d6e", "#1a1208"],
      items: [
        { name: "Accent Chair", description: "Premium fabric seating", price: "₹12,499", tag: "Furniture", where: "Urban Ladder" },
        { name: "Floor Lamp", description: "Warm ambient glow", price: "₹4,299", tag: "Lighting", where: "IKEA" },
        { name: "Textured Rug", description: "Soft handwoven rug", price: "₹8,900", tag: "Decor", where: "Home Centre" }
      ],
      designTips: [
        "Layer lighting (ambient, task, accent) to create depth and warmth.",
        "Use mirrors opposite windows to bounce natural light across the room."
      ],
      processingTime: "2.5s"
    };

    /*
    const formData = new FormData();
    if (data.image) {
      formData.append('image_data', data.image);
    }
    formData.append('mood', data.mood);
    formData.append('budget', data.budget.toString());
    formData.append('style', data.style);
    formData.append('length', data.length.toString());
    formData.append('width', data.width.toString());
    formData.append('height', data.height.toString());

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    
    if (!response.ok) {
      throw new Error('Server error: ' + response.status);
    }
    
    return await response.json();
    */
    
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('This is taking too long. Please try again.');
    }
    throw new Error('Transform failed. Please try again.');
  } finally {
    clearTimeout(timeoutId);
  }
}
