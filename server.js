// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import pdfParse from "pdf-parse";
import OpenAI from "openai";

const app = express();
const PORT = 5000;

// Setup CORS
app.use(cors());

// Setup file upload
const upload = multer({ storage: multer.memoryStorage() });

// Setup OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in .env
});

// Route to analyze resume
app.post("/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text;

    // Ask OpenAI for suggestions
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert resume reviewer." },
        { role: "user", content: `Here is a resume text:\n${text}\nGive feedback and suggestions.` },
      ],
      max_tokens: 500,
    });

    const feedback = completion.choices[0].message.content;

    res.json({ feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze resume." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
