import React, { useEffect } from 'react';
import { Project } from '../data/portfolioData';
import { 
  X, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Code2, 
  Lightbulb, 
  Flame 
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-[#0d0d11] p-6 sm:p-8 shadow-2xl text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5 font-mono">
              <span>{project.category}</span>
              <span>·</span>
              <span>Engineering Case Study</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              {project.title}
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              {project.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6">
          {/* Summary */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Project Overview
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Technologies Used */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="px-2.5 py-1 text-xs rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Key Implemented Features */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Core Engineered Features
            </h3>
            <ul className="space-y-2.5">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Architecture Breakdown */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
            <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              System Architecture & Data Flow
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {project.architecture}
            </p>
          </div>

          {/* Learnings & Engineering Takeaways */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/30 space-y-2">
            <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Key Learnings & Optimization Insights
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {project.learnings}
            </p>
          </div>

          {/* Actions & Links */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-800">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm"
              >
                <span>Launch Live Product</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>View Repository / Profile</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 ml-auto transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
