import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ProfileImage } from './ProfileImage';
import { 
  ArrowRight, 
  FileDown, 
  Github, 
  Linkedin, 
  Mail, 
  Sparkles, 
  Terminal, 
  Code2, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      id="home" 
      className="relative min-h-[90vh] flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden"
    >
      {/* Dynamic Cursor Light / Radial Glow */}
      <div 
        className="pointer-events-none fixed -inset-px opacity-30 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 80%)`
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-10">
        {/* Main Hero Grid: Profile Image + Introduction */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12">
          {/* Personal Image Container */}
          <div className="flex-shrink-0 flex justify-center">
            <ProfileImage 
              src="/profile.jpg"
              alt="Vimarsh Srivastava"
            />
          </div>

          {/* Hero Introduction Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] sm:text-xs">
                Open to SWE Internships & Full-Time Opportunities
              </span>
            </div>

            {/* Headings */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight leading-[1.1] text-balance">
                Vimarsh Srivastava
              </h1>
              <p className="text-base sm:text-xl font-medium text-neutral-300 tracking-tight font-display">
                Software Engineer <span className="text-indigo-400 font-sans">/</span> Full Stack Developer <span className="text-indigo-400 font-sans">/</span> AI Enthusiast
              </p>
              <p className="text-xs sm:text-sm md:text-base text-neutral-400 leading-relaxed max-w-2xl text-balance mx-auto lg:mx-0">
                {PERSONAL_INFO.bio}
              </p>
            </div>

            {/* Primary Call-to-Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 group"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <FileDown className="w-4 h-4 text-indigo-400" />
                <span>Download Resume</span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Me</span>
              </a>

              {/* Social Icons */}
              <div className="flex items-center gap-2 sm:ml-2 sm:pl-3 sm:border-l sm:border-neutral-800">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800 hover:bg-neutral-800 transition-colors"
                  title="GitHub Profile"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800 hover:bg-neutral-800 transition-colors"
                  title="LinkedIn Profile"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Facts & Stats Banner */}
        <div className="pt-8 border-t border-neutral-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {PERSONAL_INFO.stats.map((stat, i) => (
              <div 
                key={i} 
                className="p-3.5 sm:p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/70 hover:border-neutral-700/80 transition-colors"
              >
                <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-neutral-300 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  {stat.context}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
