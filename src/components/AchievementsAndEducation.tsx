import React from 'react';
import { ACHIEVEMENTS, EDUCATION } from '../data/portfolioData';
import { Trophy, Award, GraduationCap, BookOpen, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const AchievementsAndEducation: React.FC = () => {
  return (
    <section id="achievements" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Achievements Section */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Key Achievements
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              Hackathon and problem-solving results.
            </p>
          </div>

          <div className="space-y-4">
            {ACHIEVEMENTS.map((ach) => (
              <div
                key={ach.id}
                className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700/80 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold font-display text-white">
                        {ach.title}
                      </h3>
                      <div className="text-xs text-neutral-400 font-mono">
                        {ach.subtitle} · {ach.year}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
                      {ach.metric}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {ach.metricLabel}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                  {ach.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div id="education" className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Education
            </h2>
 
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700/80 transition-all space-y-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display text-white leading-snug">
                  {EDUCATION.degree}
                </h3>
                <div className="text-sm font-medium text-indigo-300 mt-0.5">
                  {EDUCATION.institution}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono mt-1">
                  <span>{EDUCATION.location}</span>
                  <span>·</span>
                  <span>{EDUCATION.period}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-400">
              <div className="flex items-center gap-1.5 font-mono text-neutral-300 mb-2.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Relevant Academic Coursework:</span>
              </div>
              
              {/* Clean unboxed coursework list with separators */}
              <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-xs text-neutral-300 font-mono">
                {EDUCATION.coursework.map((course, idx) => (
                  <React.Fragment key={course}>
                    <span className="hover:text-white transition-colors">{course}</span>
                    {idx < EDUCATION.coursework.length - 1 && <span className="text-neutral-600">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Status: {EDUCATION.status}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Student
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
