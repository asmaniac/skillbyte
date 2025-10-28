import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // to redirect after login
import "../css/Login.css";

const Login = () => {
  // State to store the email input
  const [email, setEmail] = useState("");
  // State to store the password input
  const [password, setPassword] = useState("");

  // create navigate function
  const navigate = useNavigate();

  // Function that handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // the console.log is handling the login information for users
    console.log("Email:", email);
    console.log("Password:", password);
    
    // Redirect to ResumePage after login
    navigate("/resume");
  };

  // where the user will enter their email and password
  return (
    <div className="login-container">
      <h1 className="login-title">SKILLBYTE LOGIN</h1>

      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email Input */}
          <label>Enter Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email!"
            required
          />

          {/* Password Input */}
          <label>Enter Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password!"
            required
          />

          {/* Submit button */}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
