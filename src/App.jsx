import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome.jsx";
import Login from "./components/Login.jsx";
import ResumePage from "./components/ResumePage.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
    </Router>
  );
};

export default App;


