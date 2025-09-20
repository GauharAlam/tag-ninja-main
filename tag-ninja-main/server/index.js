const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './server/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate', async (req, res) => {
  const { prompt, platform } = req.body;
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const generationPrompt = `
    You are an AI assistant for a ${platform} content creator. Based on the following video title or description, please generate the following:

    **Input:** "${prompt}"

    **1. Tags:**
    Provide 15–20 SEO-friendly tags, sorted by importance.
    Format: A clean, comma-separated list.

    **2. Titles:**
    Generate 5–7 engaging, click-worthy titles.
    Format: A numbered list.

    **3. Trending Topics:**
    Suggest 5 trending topics related to the input.
    Format: A numbered list.

    **4. Hooks:**
    Generate 3–5 strong opening hooks for a video.
    Format: A numbered list.

    **5. Hashtags:**
    Suggest 10–15 optimized hashtags.
    Format: A comma-separated list.

    **6. SEO Score:**
    Rate the input on SEO effectiveness from 1–100, and provide 2 suggestions for improvement.
    Format: "Score: [score]/100. Suggestions: [suggestion 1], [suggestion 2]".
  `;

  try {
    const result = await model.generateContent(generationPrompt);
    const response = await result.response;
    const text = response.text();

    // More robust parsing logic
    const parseSection = (sectionTitle, type) => {
      const regex = new RegExp(`\\*\\*\\d+\\.\\s*${sectionTitle}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\n\\*\\*\\d+\\. |$)`, 'i');
      const match = text.match(regex);
      if (!match || !match[1]) return [];
      
      const content = match[1].trim();
      if (type === 'list') {
        return content.split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
      }
      if (type === 'csv') {
        return content.split(',').map(item => item.trim()).filter(Boolean);
      }
      return [];
    };

    const seoMatch = text.match(/Score: (\d+)\/100\. Suggestions: (.*)/i);

    res.json({
      tags: parseSection('Tags', 'csv'),
      titles: parseSection('Titles', 'list'),
      trendingTopics: parseSection('Trending Topics', 'list'),
      hooks: parseSection('Hooks', 'list'),
      hashtags: parseSection('Hashtags', 'csv'),
      seo: seoMatch ? { score: parseInt(seoMatch[1]), suggestions: seoMatch[2].trim() } : null,
    });
    
  } catch (error) {
    console.error('Error generating content from Gemini:', error);
    res.status(500).json({ error: 'Failed to generate content from AI.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});