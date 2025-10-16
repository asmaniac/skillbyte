import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <header className="welcome-header">SKILLBYTE!</header>
      <h2 className="welcome-subheader">Your Personal Resume Builder!</h2>

      <div className="welcome-container">
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Welcome;
