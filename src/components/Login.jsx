import React, { useState } from 'react';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // the console.log is handling the login information for users
        console.log('Email:', email);
        console.log('Password
        };


return (
    <div className="login-container">
        <h2>Login</h2>
);
