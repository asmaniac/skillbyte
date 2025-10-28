import React from 'react';
import Button from './Button.jsx';
import ResumeList from './Welcome.jsx';
import JobDescription from './JobDescription.jsx';
import ProjectList from './ProjectList.jsx';
import Project from './Project.jsx';
import Results from './Results.jsx';

function Dashboard() {
  return (
    <div className="dashboard-container">
        <ResumeList />
        <JobDescription />
        <ProjectList />
        <Project />
        <Results />
        </div>
 );
}

export default Dashboard
