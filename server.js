import express from "express";
import cors from "cors";
import multer from "multer";
// This server now only accepts plain text (.txt) uploads for analysis.
import fetch from "node-fetch";
import { createWorker } from "tesseract.js";
import dotenv from "dotenv";

dotenv.config();

// Read Hugging Face API key. Support both HUGGINGFACE_API_KEY and HF_API_KEY
// environment variable names (the .env currently uses HUGGINGFACE_API_KEY).
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY;

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to analyze PDF
app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    // Diagnostic log to verify which server receives the request
    try {
      const name = req.file?.originalname || "<no-file>";
      const mime = req.file?.mimetype || "<no-mime>";
      const size = req.file?.buffer ? req.file.buffer.length : req.file?.size || 0;
      console.log(`/analyze request received - file=${name} mime=${mime} size=${size}`);
    } catch (diagErr) {
      console.log("/analyze diagnostic log failed:", diagErr);
    }
    if (!req.file) {
      return res.status(400).json({ feedback: "No file uploaded. Please select a TXT file." });
    }

    // Accept text or image (png, jpg/jpeg)
    const nameLower = (req.file.originalname || "").toLowerCase();
    let text = "";
    if (req.file.mimetype === "text/plain" || nameLower.endsWith(".txt") || req.file.mimetype === "application/octet-stream") {
      // Plain text
      text = req.file.buffer.toString("utf-8");
      console.log("Text file size:", req.file.buffer.length, "bytes");
      console.log("Text file content (first 200 chars):", text ? text.slice(0, 200) : "<none>");
      if (!text || text.trim().length === 0) {
        return res.status(400).json({ feedback: "Text file appears to be empty." });
      }
    } else if (req.file.mimetype.startsWith("image/") || nameLower.endsWith(".png") || nameLower.endsWith(".jpg") || nameLower.endsWith(".jpeg")) {
      // Image: run OCR
      try {
        console.log("Image upload size:", req.file.buffer.length, "bytes");
        const worker = createWorker();
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const { data: { text: ocrText } } = await worker.recognize(req.file.buffer);
        await worker.terminate();
        text = ocrText;
        console.log("OCR extracted (first 200 chars):", text ? text.slice(0, 200) : "<none>");
        if (!text || text.trim().length === 0) {
          return res.status(400).json({ feedback: "Image OCR produced no text. Please try a clearer image or upload a TXT file." });
        }
      } catch (ocrErr) {
        console.error("OCR error:", ocrErr);
        return res.status(500).json({ feedback: "Image OCR error: " + ocrErr.message });
      }
    } else {
      return res.status(400).json({ feedback: "Invalid file type. Please upload a TXT, PNG, or JPG file." });
    }

    // Send text to Hugging Face inference API
    let feedback = "";
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt2", // example model
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: text }),
        }
      );
      const result = await response.json();
      feedback = result?.[0]?.generated_text || "No feedback generated.";
    } catch (aiErr) {
      return res.status(500).json({ feedback: "AI service error: " + aiErr.message });
    }

    res.json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ feedback: "Server error: " + err.message });
  }
});

// Endpoint to analyze text directly (frontend can POST extracted text here)
app.post("/text-analyze", async (req, res) => {
  try {
    const { text } = req.body || {};
    console.log(`/text-analyze received - text length=${text ? text.length : 0}`);
    if (text && text.length > 0) console.log("text preview:", text.slice(0, 120));
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ feedback: "No text provided for analysis." });
    }

    // Forward to Hugging Face
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt2",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: text }),
        }
      );
      const result = await response.json();
      const feedback = result?.[0]?.generated_text || result?.generated_text || JSON.stringify(result);
      return res.json({ feedback });
    } catch (err) {
      console.error("HF error:", err);
      return res.status(500).json({ feedback: "AI service error: " + (err.message || err) });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ feedback: "Server error: " + err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
