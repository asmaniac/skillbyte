// Lightweight client-side OpenAI service.
// WARNING: Calling OpenAI directly from the browser exposes your API key to users.
// For production keep the key on a server or use serverless functions. This file
// is intended for local testing or prototypes only (or when you intentionally
// accept the risk of embedding a key at build time via VITE_OPENAI_API_KEY).

export async function analyzeWithOpenAI(text) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY not set. For safety, run a backend or serverless function instead.');
  }

  const prompt = `You are a career counselor analyzing a resume. Provide a structured analysis in this EXACT format:\n\nEXPERIENCE LEVEL: [None/Beginner/Intermediate/Advanced]\n\nSKILLS FOUND: [List technical and soft skills found or write \"No technical skills detected\"]\n\nRECOMMENDED CAREER PATHS: [Suggest 3 realistic career paths based ONLY on skills found]\n\nNEXT STEPS: [3-4 actionable steps including free resources]\n\nGAP ANALYSIS: [What skills or experience are missing for likely career goals]\n\nResume Content:\n${text.slice(0, 3500)}\n`;

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an expert career counselor.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 700
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    let errBody = {};
    try { errBody = await res.json(); } catch (e) {}
    const msg = errBody.error?.message || errBody.message || `OpenAI error: ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  const generatedText = data.choices?.[0]?.message?.content || '';

  return {
    feedback: generatedText,
    raw: data
  };
}
