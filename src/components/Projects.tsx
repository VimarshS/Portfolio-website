import React, { useState } from 'react';
import { Project } from '../data/portfolioData';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { ChevronDown } from 'lucide-react';
import { Reveal } from './Reveal';

// How many cards show at first, and how many more each click adds
const INITIAL_VISIBLE = 2;
const LOAD_STEP = 2;

export const ProjectsSection: React.FC = () => {
  const projects = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const categories = ['All', 'Full-Stack & AI', 'AI & Web', 'Real-Time & WebSockets'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;
  const progress = filteredProjects.length
    ? Math.min(100, (visibleProjects.length / filteredProjects.length) * 100)
    : 100;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(INITIAL_VISIBLE);
  };

  const handleViewMore = () => {
    setVisibleCount((count) => count + LOAD_STEP);
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE);
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-900">
      {/* Section Header */}
      <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-xl text-balance">
            Three full-stack projects, each with a demo you can try.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
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
      </Reveal>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visibleProjects.map((project, index) => {
          const isNew = index >= INITIAL_VISIBLE;
          const delay = isNew ? ((index - INITIAL_VISIBLE) % LOAD_STEP) * 120 : 0;

          const card = (
            <ProjectCard
              project={project}
              onOpenModal={(p) => setActiveModalProject(p)}
              index={index}
            />
          );

          return (
            <div
              key={project.id}
              className={`${index === 0 && selectedCategory === 'All' ? 'lg:col-span-2' : ''} ${isNew ? 'project-reveal' : ''}`}
              style={isNew ? { animationDelay: `${delay}ms` } : undefined}
            >
              {/* Cards added by "View More" have their own effect, so only the first ones use Reveal */}
              {isNew ? card : <Reveal delay={index * 100}>{card}</Reveal>}
            </div>
          );
        })}
      </div>

      {/* View More / Show Less */}
      {filteredProjects.length > INITIAL_VISIBLE && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="text-xs font-mono text-neutral-500">
            Showing {visibleProjects.length} of {filteredProjects.length} projects
          </div>

          <div className="w-48 h-1 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-400 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={hasMore ? handleViewMore : handleShowLess}
            aria-expanded={!hasMore}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-neutral-200 bg-neutral-900/80 border border-neutral-800 hover:border-indigo-500/60 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
          >
            <span>{hasMore ? 'View More Projects' : 'Show Less'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                hasMore ? 'group-hover:translate-y-0.5' : 'rotate-180 group-hover:-translate-y-0.5'
              }`}
            />
          </button>
        </div>
      )}

      {/* Case Study Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};