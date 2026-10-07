import React from 'react';
import { Project } from '../data/portfolioData';
import { ProjectMockup } from './ProjectMockup';
import { ExternalLink, Github, ArrowRight, Sparkles } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onOpenModal: (project: Project) => void;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenModal, index }) => {
  return (
    <div className="relative rounded-2xl border border-neutral-800/80 bg-[#08080a]/90 p-5 sm:p-7 transition-all duration-300 hover:border-neutral-700/80 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between">
      <div>
        {/* Unboxed Metadata (Zero-Pill discipline) */}
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-semibold">{project.category}</span>
          </div>
          {project.featured && (
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Featured
            </span>
          )}
        </div>

        {/* Title and Subtitle */}
        <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-neutral-400 leading-relaxed mb-4">
          {project.summary}
        </p>

        {/* Unboxed Technologies list with separators */}
        <div className="text-xs text-neutral-400 font-mono mb-5 flex flex-wrap gap-x-2 gap-y-1">
          {project.technologies.map((tech, i) => (
            <React.Fragment key={tech}>
              <span className="text-neutral-300 hover:text-white transition-colors">{tech}</span>
              {i < project.technologies.length - 1 && <span className="text-neutral-600">/</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Interactive Mockup Container */}
        <div className="mb-6">
                    <ProjectMockup 
            type={project.mockupType} 
            title={project.title} 
            technologies={project.technologies}
            onOpenModal={() => onOpenModal(project)}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-neutral-800/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source</span>
            </a>
          )}
        </div>

        <button
          onClick={() => onOpenModal(project)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-indigo-400 transition-colors py-1 group/btn"
        >
          <span>System Case Study</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
