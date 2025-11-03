// Utility functions copied from backend to run locally in the frontend.
export function extractDetailedSkills(text) {
  const skills = {
    technical: [],
    soft: [],
    tools: [],
    certifications: []
  };

  const low = (text || "").toLowerCase();

  const techMap = {
    JavaScript: ["javascript", "js", "ecmascript"],
    React: ["react", "reactjs", "react.js"],
    Node: ["node", "node.js", "nodejs", "express"],
    Python: ["python", "django", "flask"],
    Java: ["java", "spring", "springboot"],
    HTML: ["html", "html5"],
    CSS: ["css", "css3", "sass", "scss", "tailwind"],
    SQL: ["sql", "mysql", "postgres", "database"],
    Git: ["git", "github", "gitlab", "version control"],
    Excel: ["excel", "spreadsheet", "google sheets"],
    "Microsoft Office": ["microsoft office", "ms office", "word", "powerpoint"]
  };

  const softSkillsMap = {
    Communication: ["communication", "presenting", "public speaking"],
    Leadership: ["leadership", "led team", "managed", "coordinated"],
    "Problem Solving": ["problem solving", "analytical", "troubleshooting"],
    Teamwork: ["teamwork", "collaborated", "team player"],
    "Time Management": ["time management", "organized", "prioritized"],
    "Customer Service": ["customer service", "client", "customer relations"]
  };

  Object.entries(techMap).forEach(([skill, terms]) => {
    if (terms.some(term => low.includes(term))) {
      skills.technical.push(skill);
    }
  });

  Object.entries(softSkillsMap).forEach(([skill, terms]) => {
    if (terms.some(term => low.includes(term))) {
      skills.soft.push(skill);
    }
  });

  if (low.includes("certified") || low.includes("certification")) {
    const certMatches = text.match(/certified?\s+in\s+([^,.;]+)/gi);
    if (certMatches) {
      skills.certifications = certMatches.map(m => m.trim());
    }
  }

  return skills;
}

export function determineExperienceLevel(text) {
  const low = (text || "").toLowerCase();
  const workKeywords = ["experience", "worked", "employed", "position", "role"];
  const educationKeywords = ["high school", "hs diploma", "student", "currently in school"];

  const hasWork = workKeywords.some(k => low.includes(k));
  const isStudent = educationKeywords.some(k => low.includes(k));
  const yearsMatch = text && text.match(/(\d+)\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/i);

  if (yearsMatch) {
    const years = parseInt(yearsMatch[1]);
    if (years >= 3) return 'intermediate';
    if (years >= 1) return 'early_career';
  }

  if (hasWork && !isStudent) return 'early_career';
  if (isStudent || !hasWork) return 'high_school_graduate';

  return 'beginner';
}

export function generateJobMatches(skills, experienceLevel) {
  const allSkills = [...(skills.technical || []), ...(skills.soft || [])];

  const entryLevelJobs = [
    {
      title: "Retail Sales Associate",
      match: 60,
      reason: "Great starting point to build customer service skills",
      skills_needed: ["Communication", "Customer Service"],
      type: "Entry Level"
    },
    {
      title: "Administrative Assistant",
      match: 65,
      reason: "Build office skills and professional experience",
      skills_needed: ["Microsoft Office", "Communication", "Organization"],
      type: "Entry Level"
    },
    {
      title: "Food Service Worker",
      match: 55,
      reason: "Develop teamwork and customer service skills",
      skills_needed: ["Customer Service", "Teamwork"],
      type: "Entry Level"
    }
  ];

  const techJobs = [
    {
      title: "Junior Web Developer",
      match: 85,
      reason: "Your HTML/CSS/JavaScript skills are a great fit",
      skills_needed: ["HTML", "CSS", "JavaScript"],
      requiredSkills: ["HTML", "CSS", "JavaScript"],
      type: "Tech"
    },
    {
      title: "Frontend Developer Intern",
      match: 90,
      reason: "Your React experience aligns perfectly",
      skills_needed: ["React", "JavaScript", "HTML", "CSS"],
      requiredSkills: ["React"],
      type: "Tech"
    },
    {
      title: "Junior Full Stack Developer",
      match: 80,
      reason: "Your frontend and backend skills match",
      skills_needed: ["React", "Node", "JavaScript"],
      requiredSkills: ["React", "Node"],
      type: "Tech"
    },
    {
      title: "IT Support Specialist",
      match: 70,
      reason: "Good entry point into tech",
      skills_needed: ["Problem Solving", "Communication"],
      requiredSkills: [],
      type: "Tech"
    }
  ];

  const matchedTechJobs = techJobs.filter(job => {
    if (!job.requiredSkills || job.requiredSkills.length === 0) return true;
    return job.requiredSkills.some(reqSkill => 
      allSkills.some(userSkill => userSkill.toLowerCase().includes(reqSkill.toLowerCase()))
    );
  });

  if (allSkills.length === 0 || experienceLevel === 'high_school_graduate') {
    return entryLevelJobs;
  }

  if (matchedTechJobs.length > 0) {
    return matchedTechJobs.slice(0, 3);
  }

  return [...matchedTechJobs.slice(0, 1), ...entryLevelJobs.slice(0, 2)];
}
