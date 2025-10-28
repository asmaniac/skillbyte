import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ResumePage.css";


const ResumePage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSkills, setLastSkills] = useState([]);
  const [lastText, setLastText] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const extractTextFromFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve("");
      const name = (file.name || "").toLowerCase();

      // Plain text
      if (file.type === "text/plain" || name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
        return;
      }

      // Images: use tesseract.js via dynamic import
      if (file.type.startsWith("image/") || name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const mod = await import('tesseract.js');
            const Tesseract = mod.default || mod;
            const { data: { text } } = await Tesseract.recognize(reader.result, "eng");
            resolve(text);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
        return;
      }

      // PDFs: parse in-browser using pdfjs-dist (dynamic import)
      if (file.type === "application/pdf" || name.endsWith(".pdf")) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const arrayBuffer = reader.result;
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
            // Set workerSrc to a CDN-hosted worker to avoid Vite import-resolution issues.
            // If you prefer to ship the worker locally, point this to a local asset.
            pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.9.179/build/pdf.worker.min.js';
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const pageText = content.items.map(it => it.str).join(' ');
              fullText += '\n\n' + pageText;
            }
            resolve(fullText);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
        return;
      }

      resolve("");
    });
  };

  const simpleTechAnalyzer = (text) => {
    const techMap = {
      JavaScript: ["javascript", "js", "ecmascript"],
      React: ["react", "reactjs"],
      Node: ["node", "node.js", "express"],
      Python: ["python", "django", "flask", "numpy", "pandas"],
      Java: ["java", "spring"],
      AWS: ["aws", "amazon web services", "s3", "ec2", "lambda"],
      Docker: ["docker"],
      SQL: ["sql", "mysql", "postgres", "postgresql", "sqlite"],
      TypeScript: ["typescript", "ts"],
      Kubernetes: ["kubernetes", "k8s"]
    };
    const found = [];
    const low = (text || "").toLowerCase();
    Object.entries(techMap).forEach(([k, terms]) => {
      for (const t of terms) {
        if (low.includes(t)) {
          found.push(k);
          break;
        }
      }
    });
    const unique = Array.from(new Set(found));
    const result = {
      skills: unique,
      summary:
        unique.length === 0
          ? "No clear tech keywords found. Consider adding a dedicated skills section with languages, frameworks, and tools."
          : `Detected skills: ${unique.join(', ')}.`,
    };
    return result;
  };

  // Role-specific templates and suggestions
  const roleTemplates = {
    frontend: {
      headline: "Frontend Developer specializing in React and responsive UI/UX",
      skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML5", "Redux"],
      bullets: [
        "• Built responsive React components used by 50K+ daily users, improving load times by 40%",
        "• Implemented client-side state management that reduced API calls by 60%",
        "• Created reusable UI component library used across 5 internal projects"
      ]
    },
    backend: {
      headline: "Backend Developer with expertise in Node.js and API design",
      skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Docker", "REST APIs"],
      bullets: [
        "• Designed RESTful APIs handling 1M+ daily requests with 99.9% uptime",
        "• Optimized database queries reducing response time by 70%",
        "• Containerized microservices reducing deployment time by 80%"
      ]
    },
    fullstack: {
      headline: "Full Stack Developer bridging frontend UX with scalable backends",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
      bullets: [
        "• Developed full-stack features used by 100K+ users monthly",
        "• Reduced infrastructure costs by 40% through AWS optimization",
        "• Led migration to TypeScript improving bug detection by 60%"
      ]
    },
    data: {
      headline: "Data Engineer specializing in ETL pipelines and analytics",
      skills: ["Python", "SQL", "Pandas", "Apache Spark", "AWS", "Airflow"],
      bullets: [
        "• Built ETL pipeline processing 500GB+ daily with 99.9% accuracy",
        "• Reduced data processing time by 70% using parallel computing",
        "• Created analytics dashboard saving 20 hours weekly in reporting"
      ]
    }
  };

  // Generate richer, AI-like feedback with role targeting
  const generateFeedback = (text) => {
    const lines = (text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const summaryLine = lines.find(l => /summary/i.test(l)) || lines[0] || '';
    const tech = simpleTechAnalyzer(text);

    // Detect role focus based on skills
    const roleMatches = {
      frontend: tech.skills.filter(s => ['JavaScript', 'React', 'TypeScript', 'CSS'].includes(s)).length,
      backend: tech.skills.filter(s => ['Node', 'Python', 'Java', 'SQL', 'Docker'].includes(s)).length,
      data: tech.skills.filter(s => ['Python', 'SQL', 'AWS'].includes(s)).length
    };
    const bestRole = Object.entries(roleMatches)
      .sort(([,a], [,b]) => b - a)[0][0];
    const template = roleTemplates[bestRole];

    // Detect experiences / bullets heuristically
    const bullets = lines
      .filter(l => /^[-*\u2022\s]/.test(l) || /\b(managed|developed|built|implemented|led|created|designed|improved)\b/i)
      .slice(0, 6);

    // Generate headline suggestion
    const name = lines[0]?.replace(/\b(resume|cv)\b/gi, '').trim() || '';
    const headlineSuggestions = [
      template.headline,
      `${bestRole.charAt(0).toUpperCase() + bestRole.slice(1)} Developer with ${tech.skills.slice(0,2).join(' & ')} expertise`,
      `${tech.skills[0] || 'Software'} Developer passionate about ${tech.skills.slice(1,3).join(' & ') || 'building great products'}`
    ];

    // Suggest rewrites for up to 3 bullets
    const bulletRewrites = [];
    bullets.slice(0, 3).forEach(bullet => {
      const original = bullet.replace(/^[-*\u2022\s]+/, '');
      // Try to extract a verb and object
      const m = original.match(/(\b(created|built|developed|designed|improved|led|implemented|managed|optimized)\b)\s+(.*)/i);
      if (m) {
        const verb = m[1];
        const rest = m[3].replace(/\b(for|to|using)\b.*/i, '').trim();
        bulletRewrites.push({
          original,
          suggestions: [
            `• ${verb} ${rest} reducing load time by 40% and improving user satisfaction`,
            `• ${verb} ${rest} serving 50K+ daily active users with 99.9% uptime`,
            `• ${verb} ${rest} resulting in 30% increase in developer productivity`
          ]
        });
      }
    });

    // Format feedback sections
    const sections = [];

    sections.push('💡 Quick Summary');
    sections.push(`Your resume suggests a ${bestRole} focus. Here's a quick analysis:`);
    sections.push(`- ${summaryLine ? 'Found summary but could be more impactful' : 'No clear summary found'}`);
    sections.push(`- ${bullets.length} achievement bullets found (${bullets.length >= 3 ? 'good!' : 'add more'})`);
    sections.push(`- ${tech.skills.length} relevant skills detected\n`);

    sections.push('✨ Suggested Headlines');
    sections.push('Try one of these concise, role-focused headlines:');
    headlineSuggestions.forEach(h => sections.push(`"${h}"`));
    sections.push('');

    if (bulletRewrites.length > 0) {
      sections.push('📝 Achievement Bullet Improvements');
      sections.push('Make achievements concrete with metrics:');
      bulletRewrites.forEach(({original, suggestions}) => {
        sections.push(`Original: ${original}`);
        sections.push('Suggestions:');
        suggestions.forEach(s => sections.push(s));
        sections.push('');
      });
    }

    sections.push('🎯 Role-Specific Tips');
    sections.push(`For ${bestRole} roles, emphasize:`);
    sections.push(`- Key skills: ${template.skills.join(', ')}`);
    sections.push('- Example achievement:');
    sections.push(template.bullets[0]);
    sections.push('');

    sections.push('✅ Next Steps');
    sections.push('1. Add a clear headline at the top');
    sections.push('2. Ensure each bullet shows concrete impact (metrics)');
    sections.push(`3. Highlight these skills: ${tech.skills.slice(0,4).join(', ')}`);
    sections.push('4. Keep resume focused and under one page\n');

    return sections.join('\n');
  };

  const handleAnalyze = async () => {
    if (!file) {
      setFeedback("Please upload a TXT, PNG or JPG file first.");
      return;
    }

    setLoading(true);
    setFeedback("");
    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length === 0) {
        setFeedback("Uploaded file contains no readable text. Try a TXT file or a clearer image.");
        setLoading(false);
        return;
      }

      // Pure frontend analysis only
      try {
        const generated = generateFeedback(text);
        const preview = text.slice(0, 300);
        const aiFeedback = `${generated}\n\nExtracted text preview:\n${preview}...`;

        const analysisForState = simpleTechAnalyzer(text);
        setLastSkills(analysisForState.skills || []);
        setLastText(text || "");
        setFeedback(aiFeedback);
      } catch (err) {
        console.error('Analysis error:', err);
        setFeedback('Analysis failed: ' + (err.message || err));
      }
    } catch (err) {
      console.error(err);
      setFeedback("Error analyzing the file: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">
      <header className="resume-header">Resume Builder</header>

      <div className="resume-container">
        <div className="column upload-column">
          <h2>Upload Your Resume</h2>
          <input type="file" accept=".txt,text/plain,image/png,image/jpeg,.pdf" onChange={handleFileChange} />
          <div style={{ marginBottom: '1rem', color: '#5b21a8' }}>
            Upload your resume (PDF, TXT, PNG, JPG). We'll analyze it in your browser.
          </div>
          
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            style={{ minWidth: '120px' }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        <div className="column feedback-column">
          <h2>AI Feedback</h2>
          <div className="feedback-box">
            {feedback || "Upload a TXT file and click Analyze."}
          </div>
          <button
            className="job-listings-button"
            onClick={() => navigate("/jobs", { state: { skills: lastSkills, text: lastText } })}
          >
            Go to Job Listings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
