const express = require('express');
const router = express.Router();

// Optional Hugging Face API integration - falls back to local analysis if no API key
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY;
const HF_MODEL = 'gpt2'; // or your preferred model

async function analyzeWithHF(text) {
  if (!HF_API_KEY) {
    console.log('[ai] No HF API key found, using local analysis');
    return null;
  }

  try {
    console.log(`[ai] Analyzing text with HF (length=${text.length})`);
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        method: "POST",
        body: JSON.stringify({
          inputs: `Analyze this resume text and provide specific improvement suggestions:
${text.slice(0, 1000)}` // trim to avoid token limits
        }),
      }
    );

    if (!response.ok) {
      console.error('[ai] HF API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data[0]?.generated_text || null;
  } catch (err) {
    console.error('[ai] HF API error:', err);
    return null;
  }
}

router.post('/analyze', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    // Try AI analysis first, fall back to local if unavailable
    const aiResult = await analyzeWithHF(text);
    if (aiResult) {
      return res.json({ feedback: aiResult });
    }

    // If AI fails, return an error so frontend shows local results
    res.status(503).json({ error: 'AI temporarily unavailable' });
  } catch (err) {
    console.error('[ai] Error:', err);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

module.exports = router;