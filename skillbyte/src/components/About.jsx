import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/About.css";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <header className="about-header">About SkillByte</header>
      
      <div className="about-container">
        <div className="about-content">
          <h2>What is SkillByte?</h2>
          <p>
            SkillByte is a client-side resume analyzer and job recommendation tool that helps you 
            optimize your resume and find relevant job opportunities. All analysis happens in your 
            browser - your data never leaves your device.
          </p>

          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <h3>Upload Your Resume</h3>
                <p>Upload your resume as a PDF, TXT, PNG, or JPG file. We'll extract the text using advanced browser-based processing.</p>
              </div>
            </div>
            
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h3>AI Analysis</h3>
                <p>Our intelligent analysis detects your skills, suggests improvements, and provides role-specific feedback to make your resume stand out.</p>
              </div>
            </div>
            
            <div className="step">
              <span className="step-number">3</span>
              <div className="step-content">
                <h3>Job Recommendations</h3>
                <p>Get personalized job recommendations based on your detected skills and experience. See match scores and find your perfect role.</p>
              </div>
            </div>
          </div>

          <h2>Privacy & Security</h2>
          <p>
            <strong>Your data stays private:</strong> All processing happens in your browser. 
            We don't store, transmit, or analyze your resume on any external servers. 
            Your personal information remains completely secure.
          </p>

          <h2>Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-item">React</div>
            <div className="tech-item">Vite</div>
            <div className="tech-item">PDF.js</div>
            <div className="tech-item">Tesseract.js</div>
            <div className="tech-item">React Router</div>
          </div>

          <h2>Features</h2>
          <ul className="features-list">
            <li>PDF, TXT, and image resume parsing</li>
            <li>Automatic skill detection and analysis</li>
            <li>Personalized improvement suggestions</li>
            <li>Role-specific resume optimization tips</li>
            <li>Job matching with skill overlap scoring</li>
            <li>100% client-side processing</li>
          </ul>
        </div>

        <div className="about-actions">
          <button 
            className="back-button"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
