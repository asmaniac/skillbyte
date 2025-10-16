import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ResumePage.css";

const ResumePage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleAnalyze = () => setFeedback("AI feedback will appear here...");

  return (
    <div className="resume-page">
      <header className="resume-header">Resume Builder</header>

      <div className="resume-container">
        <div className="column upload-column">
          <h2>Upload Your Resume</h2>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button onClick={handleAnalyze}>Analyze</button>
        </div>

        <div className="column feedback-column">
          <h2>AI Feedback</h2>
          <div className="feedback-box">
            {feedback || "Upload a PDF and click Analyze."}
          </div>
          <button
            className="job-listings-button"
            onClick={() => navigate("/jobs")}
          >
            Go to Job Listings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
