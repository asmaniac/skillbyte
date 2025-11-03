import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ResumePage.css";
import { useAI } from "../hooks/useAI";
import { extractDetailedSkills, determineExperienceLevel, generateJobMatches } from "../utils/analysisUtils";

const ResumePage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSkills, setLastSkills] = useState([]);
  const [lastText, setLastText] = useState("");
  const [jobMatches, setJobMatches] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // Track user progress

  // Hook that calls OpenAI directly. See src/hooks/useAI.js and src/services/aiService.js
  const { analyze } = useAI();

  const API_URL = "http://localhost:5001";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setCurrentStep(2); // Move to step 2 when file is selected
  };

  const extractTextFromFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve("");
      const name = (file.name || "").toLowerCase();

      // Plain text
      if (file.type === "text/plain" || name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
        return;
      }

      // Images
      if (file.type.startsWith("image/") || name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const mod = await import('tesseract.js');
            const Tesseract = mod.default || mod;
            const { data: { text } } = await Tesseract.recognize(reader.result, "eng");
            resolve(text);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
        return;
      }

      // PDFs
      if (file.type === "application/pdf" || name.endsWith(".pdf")) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const arrayBuffer = reader.result;
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
            // Use a worker version that matches the loaded pdfjs package version to avoid
            // "API version does not match the Worker version" errors seen in some setups.
            const workerVersion = pdfjs.version || 'latest';
            pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${workerVersion}/build/pdf.worker.min.js`;
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const pageText = content.items.map(it => it.str).join(' ');
              fullText += '\n\n' + pageText;
            }
            resolve(fullText);
          } catch (err) {
            console.error('PDF parsing error:', err);
            // Improve the error message for common version mismatch issues
            if (err && err.message && err.message.includes('Worker version')) {
              reject(new Error('PDF parsing failed: pdfjs worker version mismatch. Try clearing cache or ensure pdfjs-dist versions match.'));
            } else {
              reject(err);
            }
          }
        };
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
        return;
      }

      resolve("");
    });
  };

  // NOTE: analyze() is provided by the useAI hook and calls OpenAI directly.
  // For production you should prefer a backend or serverless function to keep your
  // API key secret. See src/services/aiService.js for the client-side implementation.

  const handleAnalyze = async () => {
    if (!file) {
      setFeedback("⚠️ Please upload a resume file first.");
      return;
    }

    setLoading(true);
    setCurrentStep(3); // Move to analysis step
    setFeedback("📄 Extracting text from your resume...");
    
    try {
      const text = await extractTextFromFile(file);
      
      if (!text || text.trim().length === 0) {
        setFeedback("⚠️ Could not read text from file. Try a different format or ensure the image is clear.");
        setLoading(false);
        setCurrentStep(2);
        return;
      }
      setFeedback("🤖 AI is analyzing your resume and career potential...");

      // Compute skills & job matches locally (same logic as backend used before)
      const skills = extractDetailedSkills(text);
      const experienceLevel = determineExperienceLevel(text);
      const localJobMatches = generateJobMatches(skills, experienceLevel);

      try {
        const result = await analyze(text); // calls OpenAI directly via the hook

        setLastSkills(skills || []);
        setLastText(text || "");
        setJobMatches(localJobMatches || []);
        setFeedback(result.feedback || "No feedback returned from AI.");
        setCurrentStep(4); // Move to results step
      } catch (apiError) {
        console.error('AI error:', apiError);
        setFeedback(
          `⚠️ ${apiError.message}\n\n` +
          `If you prefer a safer setup, run the analysis through your backend server at ${API_URL}/analyze`
        );
        setCurrentStep(2);
      }
    } catch (err) {
      console.error('File extraction error:', err);
      setFeedback("❌ Error reading file: " + (err.message || err));
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setFile(null);
    setFeedback("");
    setLastSkills([]);
    setLastText("");
    setJobMatches([]);
    setCurrentStep(1);
  };

  // Progress indicator component
  const ProgressSteps = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '2rem',
      gap: '1rem'
    }}>
      {['Upload', 'Analyze', 'Results', 'Next Steps'].map((step, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: currentStep > index ? '#5b21a8' : '#e5e7eb',
            color: currentStep > index ? 'white' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {index + 1}
          </div>
          <span style={{
            color: currentStep > index ? '#5b21a8' : '#6b7280',
            fontWeight: currentStep === index + 1 ? 'bold' : 'normal',
            fontSize: '14px'
          }}>
            {step}
          </span>
          {index < 3 && <span style={{ color: '#d1d5db' }}>→</span>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="resume-page">
      <header className="resume-header">
        🎓 Career Path Analyzer for Students & Recent Grads
      </header>

      <ProgressSteps />

      <div className="resume-container">
        <div className="column upload-column">
          <h2>Step {currentStep === 1 ? '1' : '✓'}: Upload Your Resume</h2>
          
          {currentStep === 1 && (
            <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '14px' }}>
              📝 <strong>New to resumes?</strong> That's okay! Upload any document that lists:
              <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                <li>Your education (school, courses, GPA)</li>
                <li>Any jobs, internships, or volunteer work</li>
                <li>Skills (even from school projects!)</li>
                <li>Activities or clubs you've participated in</li>
              </ul>
            </div>
          )}

          <input 
            type="file" 
            accept=".txt,text/plain,image/png,image/jpeg,.pdf" 
            onChange={handleFileChange}
            disabled={loading}
          />
          
          {file && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              color: '#166534'
            }}>
              ✓ File selected: <strong>{file.name}</strong>
            </div>
          )}

          <div style={{ marginTop: '1rem', color: '#5b21a8', fontSize: '14px' }}>
            Supported formats: PDF, TXT, PNG, JPG
          </div>
          
          <button 
            onClick={handleAnalyze} 
            disabled={loading || !file}
            style={{ 
              minWidth: '160px',
              marginTop: '1rem',
              opacity: (!file || loading) ? 0.5 : 1,
              cursor: (!file || loading) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔄 Analyzing...' : '🚀 Analyze My Resume'}
          </button>

          {currentStep >= 4 && (
            <button 
              onClick={handleStartOver}
              style={{ 
                minWidth: '160px',
                marginTop: '0.5rem',
                backgroundColor: '#6b7280'
              }}
            >
              ↻ Start Over
            </button>
          )}
        </div>

        <div className="column feedback-column">
         <h2>
  {currentStep === 1 ? '💡 What You\'ll Get' :
   currentStep === 2 ? '📋 Ready to Analyze' :
   currentStep === 3 ? '⏳ Analyzing...' :
   currentStep >= 4 ? '✨ Your Career Analysis' : ''}
</h2>

          
          <div className="feedback-box">
            {currentStep === 1 && !feedback && (
              <div style={{ color: '#6b7280' }}>
                <h3 style={{ color: '#5b21a8', marginBottom: '1rem' }}>Our AI will help you:</h3>
                <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
                  <li>✓ Identify your current skills and experience level</li>
                  <li>✓ Find jobs that actually match your background</li>
                  <li>✓ Get personalized next steps for your career</li>
                  <li>✓ Discover free resources to build new skills</li>
                  <li>✓ Understand what employers are looking for</li>
                </ul>
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  color: '#92400e'
                }}>
                  <strong>💡 Pro tip:</strong> Even if you have no work experience, our AI can help you find a starting point!
                </div>
              </div>
            )}
            
            {(currentStep >= 2 || feedback) && (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {feedback || "Upload your resume and click 'Analyze' to get started!"}
              </div>
            )}
          </div>

          {currentStep >= 4 && lastSkills.length > 0 && (
            <button
              className="job-listings-button"
              onClick={() => navigate("/jobs", { 
                state: { 
                  skills: lastSkills, 
                  text: lastText,
                  jobMatches: jobMatches
                } 
              })}
              style={{ marginTop: '1rem' }}
            >
              🎯 View Matched Jobs →
            </button>
          )}
        </div>
      </div>

      {/* Help section for confused users */}
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '1.5rem',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        textAlign: 'left'
      }}>
        <h3 style={{ color: '#5b21a8', marginBottom: '1rem' }}>❓ Need Help?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '14px' }}>
          <div>
            <strong>Don't have a resume?</strong>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
              Create a simple text file listing your education, any jobs/volunteer work, and skills you have (even from school!).
            </p>
          </div>
          <div>
            <strong>No work experience?</strong>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
              That's okay! Our AI will suggest entry-level paths and free ways to build skills that employers want.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;