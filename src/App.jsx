import React from 'react';
import Button from './components/Button.jsx';
import ResumeList from './components/ResumeList.jsx';
import JobDescription from './components/JobDescription.jsx';
import ProjectList from './components/ProjectList.jsx';
import Project from './components/Project.jsx';
import Results from './components/Results.jsx';
import './css/App.css';

const App = () => {
  return (
    <div className="app-container">
      {/* Header */}
      <div className="header-box">
        <h1 className="main-title">SKILLBYTE!</h1>
        <h2 className="sub-title">YOUR PERSONAL RESUME BUILDER!</h2>
      </div>

      {/* Buttons */}
      <div className="button-container">
       <Button text="LOGIN" />
        <Button text="SIGN UP" />
      </div>

      {/* i need to finish writing the code for these */}
      <ResumeList />
      <JobDescription />
      <ProjectList />
      <Project />
      <Results />
    </div>
  );
};

export default App;

