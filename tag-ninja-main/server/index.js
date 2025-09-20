const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './server/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Main content generation endpoint
app.post('/api/generate', async (req, res) => {
  const { prompt, platform } = req.body;
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const generationPrompt = `
    You are an AI assistant for a ${platform} content creator. Based on the following input, generate the required content.
    Input: "${prompt}"

    [START_TITLES]
    Generate 5-7 engaging, click-worthy titles.
    [END_TITLES]

    [START_TAGS]
    Provide 15-20 SEO-friendly tags, comma-separated.
    [END_TAGS]
    
    [START_TRENDS]
    Suggest 5 trending topics related to the input.
    [END_TRENDS]
  `;

  try {
    const result = await model.generateContent(generationPrompt);
    const response = await result.response;
    const text = response.text();

    const parseSection = (tag) => {
      try {
        const regex = new RegExp(`\\[START_${tag}\\]([\\s\\S]*?)\\[END_${tag}\\]`, 'i');
        const match = text.match(regex);
        return match ? match[1].trim() : '';
      } catch (e) {
        return '';
      }
    };

    const titlesText = parseSection('TITLES');
    const tagsText = parseSection('TAGS');
    const trendsText = parseSection('TRENDS');

    res.json({
      titles: titlesText.split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim()).filter(Boolean),
      tags: tagsText.split(',').map(item => item.trim()).filter(Boolean),
      trendingTopics: trendsText.split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim()).filter(Boolean),
    });
    
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content from AI.' });
  }
});

// New AI Assistant chat endpoint
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ response: text });
  } catch (error) {
    console.error('Error with AI chat:', error);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});