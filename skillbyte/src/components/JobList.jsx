import React from "react";
import { useLocation } from "react-router-dom";
import "../css/JobList.css";

const jobs = [
  {
    title: "Frontend Developer",
    company: "TechByte",
    location: "Remote",
    skills: ["React", "CSS", "JavaScript"],
  },
  {
    title: "Backend Engineer",
    company: "Cloudify",
    location: "New York, NY",
    skills: ["Node.js", "Express", "MongoDB"],
  },
  {
    title: "Full Stack Developer",
    company: "InnovateX",
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "SQL"],
  },
];

function scoreJob(job, skills) {
  const set = new Set((skills || []).map((s) => s.toLowerCase()));
  const jobSkills = (job.skills || []).map((s) => s.toLowerCase());
  let overlap = 0;
  for (const s of jobSkills) {
    if (set.has(s)) overlap += 1;
  }
  return overlap;
}

const JobList = () => {
  const location = useLocation();
  const receivedSkills = location.state?.skills || [];
  const receivedText = location.state?.text || "";

  const ranked = [...jobs]
    .map((j) => ({ job: j, score: scoreJob(j, receivedSkills) }))
    .sort((a, b) => b.score - a.score);

  const hasInput = receivedSkills.length > 0;

  return (
    <div className="job-list-page">
      <header className="job-list-header">{hasInput ? "Recommended Jobs" : "Job Listings"}</header>
      {hasInput && (
        <div style={{ color: "#5b21a8", marginBottom: "1rem", textAlign: "center" }}>
          Based on detected skills: <strong>{receivedSkills.join(", ")}</strong>
        </div>
      )}
      <div className="job-list-container">
        {(hasInput ? ranked : jobs).map((item, idx) => {
          const j = hasInput ? item.job : item;
          const score = hasInput ? item.score : undefined;
          return (
            <div className="job-card" key={idx}>
              <h2>{j.title}</h2>
              <p><strong>Company:</strong> {j.company}</p>
              <p><strong>Location:</strong> {j.location}</p>
              <p><strong>Skills:</strong> {j.skills.join(", ")}</p>
              {hasInput && (
                <p style={{ marginTop: "0.5rem", color: "#6b21a8" }}>
                  Match score: <strong>{score}</strong>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobList;
