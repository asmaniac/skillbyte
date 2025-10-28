import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import ResumePage from "./components/ResumePage";
import JobList from "./components/JobList";
import About from "./components/About";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;


