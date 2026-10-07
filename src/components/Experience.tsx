import React from 'react';
import { EXPERIENCE_ITEMS } from '../data/portfolioData';
import { Briefcase, Calendar, MapPin, CheckCircle2, Terminal } from 'lucide-react';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-900">
      <div className="max-w-3xl mb-12">
 
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Practical Experience
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 mt-2 text-balance">
          Hands-on full-stack internship work.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l border-neutral-800 space-y-12">
        {EXPERIENCE_ITEMS.map((item, index) => (
          <div key={index} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-7.75 sm:-left-9.75 top-1.5 w-3.5 h-3.5 rounded-full bg-neutral-900 border-2 border-indigo-500 group-hover:bg-indigo-500 transition-colors" />

            {/* Experience Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700/80 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                    {item.role}
                  </h3>
                  <div className="text-sm font-medium text-indigo-300 flex items-center gap-2 mt-0.5">
                    <span>{item.company}</span>
                    <span className="text-neutral-600 font-mono text-xs">/</span>
                    <span className="text-xs text-neutral-400">{item.programType}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    {item.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    {item.location}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                {item.summary}
              </p>

              {/* Bullet points strictly from resume */}
              <ul className="space-y-2.5 mb-5">
                {item.bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>

              {/* Tech tags applied (unboxed) */}
              <div className="pt-4 border-t border-neutral-800/60 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-400 font-mono">
                <span className="text-neutral-500">Technologies:</span>
                {item.skills.map((skill, i) => (
                  <React.Fragment key={skill}>
                    <span className="text-neutral-300">{skill}</span>
                    {i < item.skills.length - 1 && <span className="text-neutral-600">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
