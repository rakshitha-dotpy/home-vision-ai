const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Setup multer for multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/generate-design', upload.single('image'), (req, res) => {
  try {
    const { mood, style } = req.body;
    const budget = Number(req.body.budget) || 25000;
    const length = Number(req.body.length) || 12;
    const width = Number(req.body.width) || 10;
    const height = Number(req.body.height) || 9;

    const area = length * width;
    const volume = area * height;
    
    let roomSizeLabel = "medium";
    let recommendation = "";
    
    if (area < 100) {
      roomSizeLabel = "small";
      recommendation = "Perfect size for a cozy modern room we'll maximize every inch";
    } else if (area <= 200) {
      roomSizeLabel = "medium";
      recommendation = "Perfect sized room with great design potential";
    } else {
      roomSizeLabel = "large";
      recommendation = "Spacious room, we'll make it feel warm and connected";
    }

    const budgetPerSqFt = Math.round(budget / area);

    // Calculate item prices based on budget
    const formatPrice = (amount) => "₹" + Math.round(amount).toLocaleString("en-IN");

    const items = [
      {
        name: "Sectional Sofa",
        description: `Perfect for ${roomSizeLabel} rooms`,
        price: formatPrice(budget * 0.30),
        tag: "Best fit for your space",
        where: "Pepperfry / Urban Ladder"
      },
      {
        name: "Floor Lamp",
        description: "Warm ambient lighting",
        price: formatPrice(budget * 0.10),
        tag: "Trending",
        where: "IKEA / Amazon India"
      },
      {
        name: "Center Table",
        description: `Scaled for ${area} sq ft`,
        price: formatPrice(budget * 0.15),
        tag: "Editor's pick",
        where: "Wooden Street"
      },
      {
        name: "Wall Art Set",
        description: `Completes the ${style} look`,
        price: formatPrice(budget * 0.08),
        tag: "Budget friendly",
        where: "Chumbak / Flipkart"
      }
    ];

    // Artificial delay to simulate AI processing
    setTimeout(() => {
      res.json({
        success: true,
        roomAnalysis: {
          area: `${area} sq ft`,
          volume: `${volume} cubic ft`,
          roomSize: roomSizeLabel,
          budgetPerSqFt: `₹${budgetPerSqFt}/sq ft`,
          recommendation: recommendation
        },
        generatedImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
        description: `A ${style} ${mood}-themed room with warm lighting, curated furniture scaled for ${area} sq ft`,
        colorPalette: ["#E8D5B7", "#8B6F47", "#2C3E2D", "#F5F0E8"],
        items,
        designTips: [
          `Use light colors to make ${area} sq ft feel more spacious`,
          "Add mirrors to double the visual space",
          "Keep furniture 18 inches from walls"
        ],
        processingTime: "5.5s"
      });
    }, 1000); // 1s delay just for network realism
  } catch (error) {
    console.error("Error generating design:", error);
    res.status(500).json({ success: false, error: "Failed to generate design" });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
