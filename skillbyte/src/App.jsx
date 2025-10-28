import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import ResumePage from "./components/ResumePage";
import JobList from "./components/JobList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
  <Route path="/resume" element={<ResumePage />} />
  <Route path="/jobs" element={<JobList />} />
      </Routes>
    </Router>
  );
};

export default App;


