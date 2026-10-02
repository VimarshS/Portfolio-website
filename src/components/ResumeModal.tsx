import React, { useEffect, useState } from 'react';
import { PERSONAL_INFO, EDUCATION, EXPERIENCE_ITEMS, PROJECTS, SKILL_CATEGORIES, ACHIEVEMENTS } from '../data/portfolioData';
import { 
  X, 
  FileDown, 
  ExternalLink, 
  Copy, 
  Check, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  Trophy,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin
} from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    // Count the download (best effort, it never blocks the real download)
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (apiBase) {
      fetch(`${apiBase}/api/resume/download`, {
        method: 'POST',
        keepalive: true,
      }).catch(() => {});
    }

    // Attempts to download /resume.pdf
    const link = document.createElement('a');
    link.href = PERSONAL_INFO.resumePath;
    link.download = 'Vimarsh_Srivastava_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = () => {
    const resumeText = `
VIMARSH SRIVASTAVA
Software Engineer | Full Stack Developer | AI Enthusiast
Lucknow, India | Email: ${PERSONAL_INFO.email} | Phone: ${PERSONAL_INFO.phone}
GitHub: ${PERSONAL_INFO.github} | LinkedIn: ${PERSONAL_INFO.linkedin}

EDUCATION
${EDUCATION.degree}
${EDUCATION.institution}, Lucknow, India (${EDUCATION.period})
Coursework: ${EDUCATION.coursework.join(', ')}

EXPERIENCE
Full Stack Web Development Intern – Unified Mentor (Remote, Aug 2025 – Nov 2025)
- Built 3 full-stack web applications using MERN (MongoDB, Express, React, Node.js).
- Developed and integrated 5+ RESTful APIs with input validation and error handling.
- Implemented JWT authentication and role-based authorization protocols.
- Applied Git/GitHub version control, disciplined debugging, and deployment practices.

PROJECTS
1. AI Mock Interview Platform (Next.js, TypeScript, Supabase, Gemini API, Tailwind CSS)
- AI-generated role-based interview questions with real-time feedback.
- Gemini API streaming prompts and PostgreSQL database via Supabase.

2. NotesGen AI (React.js, Node.js, Express.js, MongoDB, OpenAI API)
- Automated natural language text summarization and semantic extraction.
- Live: https://notes-gen-ai-puce.vercel.app/

3. Real-Time Chat Application (React.js, Node.js, Express.js, MongoDB, WebSockets)
- Low-latency bi-directional messaging, MongoDB persistence, JWT auth, Cloudinary image sharing.

ACHIEVEMENTS
- Smart India Hackathon 2024: 3rd Place among 20+ teams (36-hr prototype delivery).
- 250+ LeetCode & competitive programming problems solved.
    `.trim();

    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-[#0d0d11] p-6 sm:p-8 shadow-2xl text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1">
              <span>Curriculum Vitae</span>
              <span>·</span>
              <span>Verified Resume</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              {PERSONAL_INFO.name}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              {PERSONAL_INFO.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-medium transition-colors shadow-sm"
              title="Download /resume.pdf"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action bar */}
        <div className="py-3 px-4 my-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-neutral-400 font-mono">
            PDF File: <code className="text-indigo-300">/resume.pdf</code> (Place in public directory)
          </span>
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Full Resume Text' : 'Copy Resume Text'}</span>
          </button>
        </div>

        {/* Resume Content View */}
        <div className="space-y-6 text-xs sm:text-sm">
          {/* Contact Details Bar */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-neutral-400 font-mono text-xs border-b border-neutral-800/60 pb-4">
            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-indigo-400" /> {PERSONAL_INFO.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-indigo-400" /> {PERSONAL_INFO.phone}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-400" /> {PERSONAL_INFO.location}</span>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2 font-semibold flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              Education
            </h3>
            <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-1">
              <div className="flex justify-between items-start font-medium text-white">
                <span>{EDUCATION.degree}</span>
                <span className="text-neutral-400 font-mono text-xs">{EDUCATION.period}</span>
              </div>
              <div className="text-neutral-400 text-xs">
                {EDUCATION.institution}, {EDUCATION.location}
              </div>
              <div className="text-neutral-400 text-xs pt-1">
                <span className="text-neutral-500 font-mono">Relevant Coursework:</span> {EDUCATION.coursework.join(', ')}
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2 font-semibold flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              Internship Experience
            </h3>
            {EXPERIENCE_ITEMS.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-2">
                <div className="flex justify-between items-start font-medium text-white">
                  <div>
                    <span>{exp.role}</span>
                    <span className="text-neutral-400 font-normal ml-2">· {exp.company} ({exp.programType})</span>
                  </div>
                  <span className="text-neutral-400 font-mono text-xs">{exp.period}</span>
                </div>
                <ul className="space-y-1.5 text-neutral-300 text-xs list-disc pl-4">
                  {exp.bulletPoints.map((bp, i) => (
                    <li key={i}>{bp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2 font-semibold flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              Projects
            </h3>
            <div className="space-y-2.5">
              {PROJECTS.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-1">
                  <div className="flex justify-between items-start font-medium text-white">
                    <span>{proj.title}</span>
                    <span className="text-neutral-400 font-mono text-xs">{proj.technologies.slice(0, 3).join(', ')}</span>
                  </div>
                  <p className="text-xs text-neutral-300">{proj.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2 font-semibold flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ACHIEVEMENTS.map((ach) => (
                <div key={ach.id} className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
                  <div className="font-medium text-white text-xs">{ach.title}</div>
                  <div className="text-indigo-300 font-mono text-xs">{ach.metric} · {ach.metricLabel}</div>
                  <p className="text-[11px] text-neutral-400 mt-1">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">
            Vimarsh Srivastava · Updated for 2026
          </span>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Download Official PDF
          </button>
        </div>
      </div>
    </div>
  );
};
