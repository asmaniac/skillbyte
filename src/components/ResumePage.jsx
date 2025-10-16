// src/components/ResumePage.jsx
import React, { useState } from "react";
import axios from "axios";
import "../css/ResumePage.css";

const ResumePage = () => {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a PDF first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/analyze-resume",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error(error);
      setFeedback("Error analyzing resume. Make sure the backend is running.");
    }
  };

  return (
    <div className="resume-page">
      <h1 className="resume-header">Resume Builder</h1>

      <div className="resume-container">
        {/* Left: PDF Upload */}
        <div className="resume-sidebar">
          <h2>Upload Your Resume</h2>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button onClick={handleAnalyze}>Analyze</button>
        </div>

        {/* Right: AI Feedback */}
        <div className="resume-content">
          <h2>AI Feedback</h2>
          <div className="feedback-box">
            {feedback || "Upload a PDF and click Analyze to get suggestions."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
