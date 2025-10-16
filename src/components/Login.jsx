import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // import useNavigate
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // initialize navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    // the console.log is handling the login information for users
    console.log('Email:', email);
    console.log('Password:', password);

    // Redirect to ResumePage after login
    navigate('/resume');
  };
// classname added to div for styling
  return (
    <div className="login-container"> 
      <h2>Login Here</h2>
      <form onSubmit={handleSubmit}>
        <label>Enter Email</label>
        <input
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} // added onchange to update state
          placeholder="Enter your email!"
          required
        />

        <label>Enter Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password!"
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
