import React from 'react';
import { Code2, Cpu, Database, Network, ShieldCheck, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';

const PILLARS = [
  {
    icon: Code2,
    title: 'Full-Stack Web Engineering',
    desc: 'Responsive web apps with React, Next.js, Node.js and Express.',
  },
  {
    icon: Sparkles,
    title: 'AI Integrations',
    desc: 'Gemini and OpenAI APIs for interview feedback and study-note generation.',
  },
  {
    icon: Database,
    title: 'Databases',
    desc: 'PostgreSQL (Supabase) and MongoDB: schema design and indexing.',
  },
  {
    icon: Network,
    title: 'Real-Time & REST APIs',
    desc: 'WebSocket connections and REST APIs.',
  },
  {
    icon: ShieldCheck,
    title: 'Authentication & Security',
    desc: 'JWT login, protected routes and role-based access.',
  },
  {
    icon: Cpu,
    title: 'Core CS Foundations',
    desc: 'Data structures, algorithms, operating systems, DBMS and networks.',
  },
];

export const About: React.FC = () => {
  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-900"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column: short introduction */}
        <Reveal className="lg:col-span-5 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            About Me
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-neutral-400 leading-relaxed font-sans">
            <p>
              I'm a Computer Science student from Lucknow, India (B.Tech, 2023–2027). I build
              full-stack web apps and enjoy turning complex requirements into reliable,
              easy-to-use products.
            </p>
            <p>
              I like the fundamentals underneath: algorithms, data structures and operating
              systems. My recent projects are an AI mock interview platform, a real-time chat app
              and an AI study-notes tool.
            </p>
          </div>
        </Reveal>

        {/* Right column: what I work with */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={i * 80} className="h-full">
                <div className="spotlight h-full p-5 rounded-xl bg-neutral-900/30 border border-neutral-800/80 hover:border-neutral-700/80 transition-all hover:bg-neutral-900/50">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white font-display mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{pillar.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};