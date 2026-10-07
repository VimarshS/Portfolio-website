import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { 
  Code2, 
  Cpu, 
  Database, 
  Network, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Workflow 
} from 'lucide-react';

export const About: React.FC = () => {
  const pillars = [
    {
      icon: Code2,
      title: "Full-Stack Web Engineering",
      desc: "Architecting responsive, decoupled web applications using modern React, Next.js, Node.js, and Express with rigorous component lifecycles and state predictability."
    },
    {
      icon: Sparkles,
      title: "Intelligent AI Integrations",
      desc: "Integrating state-of-the-art LLM APIs (Google Gemini, OpenAI) for structured generative tasks, real-time diagnostic evaluation, and automated NLP note synthesis."
    },
    {
      icon: Database,
      title: "Relational & Document Databases",
      desc: "Designing normalized schemas and indexing strategies across PostgreSQL (Supabase) and MongoDB for low-latency queries and transactional integrity."
    },
    {
      icon: Network,
      title: "Real-Time Protocols & REST APIs",
      desc: "Building low-latency bi-directional WebSocket connections and scalable RESTful API endpoints adhering to standard HTTP verbs and status semantics."
    },
    {
      icon: ShieldCheck,
      title: "Authentication & Route Security",
      desc: "Implementing stateless JWT token authentication, secure bearer headers, role-based authorization, and environment configuration safeguards."
    },
    {
      icon: Cpu,
      title: "Algorithmic Foundations & Core CS",
      desc: "Applying deep academic grounding in Data Structures, Algorithms, Operating Systems, DBMS, and Computer Networks to optimize computational complexity."
    }
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Narrative */}
        <div className="lg:col-span-5 space-y-6">
 

          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Building with technical depth and product intuition.
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-neutral-400 leading-relaxed font-sans">
            <p>
              I am a Software Engineer and Computer Science undergraduate based in Lucknow, India, pursuing my B.Tech at Shri Ramswaroop Memorial University (2023–2027).
            </p>
            <p>
              My engineering approach bridges foundational computer science—rigorous algorithmic problem solving and operating system concurrency—with modern product development. I focus on writing clean, modular code across the entire stack.
            </p>
            <p>
              Whether simulating realistic technical interviews with streaming Gemini responses, architecting low-latency WebSocket communication pipelines, or synthesizing study material via NLP, I enjoy turning complex system requirements into seamless, reliable user experiences.
            </p>
          </div>

          {/* Quick Details List */}
          <div className="pt-4 border-t border-neutral-800 space-y-2.5 text-xs text-neutral-300 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Location</span>
              <span>{PERSONAL_INFO.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Academic Track</span>
              <span>B.Tech CSE (2023 – 2027)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Primary Languages</span>
              <span>Java · JavaScript · SQL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Direct Contact</span>
              <a href={`mailto:${PERSONAL_INFO.email}`} className="text-indigo-400 hover:underline">
                {PERSONAL_INFO.email}
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Pillars Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={i}
                className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-800/80 hover:border-neutral-700/80 transition-all hover:bg-neutral-900/50"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white font-display mb-1.5">
                  {pillar.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
