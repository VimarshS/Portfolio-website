import React, { useState } from 'react';
import { PROJECTS, Project } from '../data/portfolioData';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { Layers, ArrowUpRight } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = ['All', 'Full-Stack & AI', 'AI & Web', 'Real-Time & WebSockets'];

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-900">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-2">
            <span>Engineering Showcase</span>
            <span>·</span>
            <span>Production & Full-Stack Systems</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-xl text-balance">
            Real software architectures built with Next.js, React, Node.js, WebSockets, Supabase, and AI APIs.
          </p>
        </div>

        {/* Functional Category Filter (interactive segmented controls) */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredProjects.map((project, index) => (
          <div 
            key={project.id} 
            className={index === 0 && selectedCategory === 'All' ? 'lg:col-span-2' : ''}
          >
            <ProjectCard 
              project={project} 
              onOpenModal={(p) => setActiveModalProject(p)} 
              index={index} 
            />
          </div>
        ))}
      </div>

      {/* Case Study Modal */}
      <ProjectModal 
        project={activeModalProject} 
        onClose={() => setActiveModalProject(null)} 
      />
    </section>
  );
};
