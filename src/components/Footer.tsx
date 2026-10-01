import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-900 bg-[#050506] py-12 px-4 sm:px-6 lg:px-8 text-neutral-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Identity */}
        <div className="text-center md:text-left space-y-1">
          <div className="text-base font-bold font-display text-white tracking-tight">
            {PERSONAL_INFO.name}
          </div>
          <div className="text-xs text-neutral-400 font-sans">
            {PERSONAL_INFO.tagline}
          </div>
        </div>

        {/* Center: Clean links */}
        <div className="flex items-center gap-6 text-xs font-medium text-neutral-400">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="hover:text-white transition-colors"
          >
            Email
          </a>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-white transition-colors"
            title="Back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Copyright */}
        <div className="text-xs font-mono text-neutral-400 text-center md:text-right">
          © 2026 Vimarsh Srivastava. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
