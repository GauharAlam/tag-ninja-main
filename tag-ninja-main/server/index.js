const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate', async (req, res) => {
  const { prompt, platform, type } = req.body; // Added a 'type' parameter

  // Choose the model
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Create a more specific prompt for Gemini
  let generationPrompt;
  switch (type) {
    case 'titles':
      generationPrompt = `You are an expert content strategist for ${platform}. Generate 10 engaging and SEO-optimized titles for a new video or post about: "${prompt}". Return the response as a numbered list.`;
      break;
    case 'tags':
      generationPrompt = `You are an expert content strategist for ${platform}. Generate 15 relevant and trending SEO tags for a new video or post about: "${prompt}". Return the response as a comma-separated list.`;
      break;
    default:
      generationPrompt = `You are a helpful assistant for a ${platform} content creator. Respond to the following prompt: "${prompt}".`;
  }

  try {
    const result = await model.generateContent(generationPrompt);
    const response = await result.response;
    const text = response.text();

    // Process the text to return a clean array
    const suggestions = text
      .split('\n')
      .map(item => item.replace(/^\d+\.\s*/, '').trim()) // Removes numbering like "1. "
      .filter(item => item.length > 0);

    res.json({ suggestions });
  } catch (error) {
    console.error('Error generating content from Gemini:', error);
    res.status(500).json({ error: 'Failed to generate content from AI.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});