const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3001;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Gemini-powered server is running!");
});

// --- API Endpoint for Generating Tags ---
app.post("/api/generate-tags", async (req, res) => {
  const { inputText, platform } = req.body;
  if (!inputText) return res.status(400).json({ error: "Input text is required." });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt =
      platform === "linkedin"
        ? `Generate 12 relevant, professional hashtags for a LinkedIn post about: "${inputText}". Return as a single comma-separated string.`
        : `Generate 12 relevant SEO tags for a YouTube video about: "${inputText}". Focus on search keywords. Return as a single comma-separated string.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const tags = text.split(',').map(tag => tag.trim().replace(/"/g, '')); // Clean up the response
    res.json(tags);
  } catch (error) {
    console.error("Error with Gemini API (Tags):", error);
    // Send a proper error status but with an empty array to prevent frontend crash
    res.status(500).json([]);
  }
});

// --- NEW API Endpoint for Generating Titles ---
app.post("/api/generate-titles", async (req, res) => {
  const { inputText, platform } = req.body;
  if (!inputText) return res.status(400).json({ error: "Input text is required." });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt =
      platform === "linkedin"
        ? `Generate 5 engaging, professional headlines for a LinkedIn post about: "${inputText}". Each title should be on a new line.`
        : `Generate 5 catchy, clickable titles for a YouTube video about: "${inputText}". Each title should be on a new line.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Split by newline and remove any empty lines or list markers
    const titles = text.split('\n').map(t => t.replace(/^- \d*\. /, '').trim()).filter(Boolean);
    res.json(titles);
  } catch (error) {
    console.error("Error with Gemini API (Titles):", error);
    res.status(500).json([]);
  }
});

// --- NEW API Endpoint for Trends (Simulated) ---
app.get("/api/get-trends", (req, res) => {
  const trendingKeywords = [
    { keyword: "AI Content Automation", trend: "+150%", difficulty: "High" },
    { keyword: "Short-form Video Strategy", trend: "+95%", difficulty: "Medium" },
    { keyword: "Creator Monetization 2025", trend: "+70%", difficulty: "Medium" },
    { keyword: "LinkedIn Personal Branding", trend: "+55%", difficulty: "Low" },
    { keyword: "Sustainable Creator Economy", trend: "+40%", difficulty: "Easy" },
  ];
  res.json(trendingKeywords);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});