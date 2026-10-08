import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { Reveal } from './Reveal';

export const Skills: React.FC = () => {
  // Name of the skill whose description is open (one at a time)
  const [openSkill, setOpenSkill] = useState<string | null>(null);

  const toggle = (name: string) => {
    setOpenSkill((current) => (current === name ? null : name));
  };

  return (
    <section
      id="skills"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-900"
    >
      {/* Header */}
      <Reveal className="mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Skills & Technologies
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-xl text-balance">
          Learned through coursework, an internship and projects. Tap a skill for details.
        </p>
      </Reveal>

      {/* One row per category: the name once, the skills as chips */}
      <div className="divide-y divide-neutral-900 border-y border-neutral-900">
        {SKILL_CATEGORIES.map((group, index) => {
          const open = group.skills.find((skill) => skill.name === openSkill);

          return (
            <Reveal key={group.category} delay={index * 70}>
              <div className="py-5 md:grid md:grid-cols-[11rem_1fr] md:gap-6">
                <h3 className="mb-3 text-xs font-mono uppercase tracking-wider text-indigo-400 md:mb-0 md:pt-1.5">
                  {group.category}
                </h3>

                <div>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => {
                      const isOpen = openSkill === skill.name;

                      return (
                        <button
                          key={skill.name}
                          type="button"
                          onClick={() => toggle(skill.name)}
                          aria-expanded={isOpen}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                            isOpen
                              ? 'border-indigo-500/60 bg-indigo-500/15 text-white'
                              : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700 hover:text-white'
                          }`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>

                  {open && (
                    <p
                      role="status"
                      className="demo-slide-in mt-3 rounded-lg border border-neutral-800 bg-neutral-900/50 px-3.5 py-2.5 text-xs leading-relaxed text-neutral-300"
                    >
                      <span className="font-semibold text-white">{open.name}: </span>
                      {open.description}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};