import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { 
  Code2, 
  Search, 
  Terminal, 
  Database, 
  Cpu, 
  Layers, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const categories = ['All', ...SKILL_CATEGORIES.map(c => c.category)];

  // Filter skills based on category and search query
  const allSkills = SKILL_CATEGORIES.flatMap(cat => 
    cat.skills.map(s => ({ ...s, category: cat.category }))
  );

  const displayedSkills = allSkills.filter(skill => {
    const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-2">
            <span>Technical Capabilities</span>
            <span>·</span>
            <span>Verified Skills & Competencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Skills & Technologies
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-xl text-balance">
            Technical competencies grounded in coursework, internship experience, and full-stack project implementations.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-900/90 border border-neutral-800 rounded-lg text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl mb-8 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {displayedSkills.map((skill) => (
          <div
            key={skill.name}
            onMouseEnter={() => setHoveredSkill(skill.name)}
            onMouseLeave={() => setHoveredSkill(null)}
            className="group relative p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/70 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-sm font-semibold text-white font-display group-hover:text-indigo-300 transition-colors">
                {skill.name}
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                {skill.category}
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              {skill.description}
            </p>

            {/* Subtle corner highlight on hover */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/60 transition-all duration-300 rounded-b-xl" />
          </div>
        ))}
      </div>

      {displayedSkills.length === 0 && (
        <div className="p-8 text-center rounded-xl bg-neutral-900/20 border border-neutral-800 text-neutral-400 text-xs font-mono">
          No technologies matching "{searchQuery}" in this category.
        </div>
      )}

      {/* Note on genuine proficiency */}
      <div className="mt-8 flex items-center gap-2 text-xs text-neutral-500 font-mono">
        <Info className="w-3.5 h-3.5 text-neutral-400" />
        <span>Every listed skill reflects applied knowledge in projects, competitive DSA, or internship work.</span>
      </div>
    </section>
  );
};
