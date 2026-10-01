import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { ProjectsSection } from './components/Projects';
import { Experience } from './components/Experience';
import { AchievementsAndEducation } from './components/AchievementsAndEducation';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050506] text-neutral-200 selection:bg-indigo-500/20 selection:text-indigo-200 relative tech-grid-pattern">
      {/* Subtle Custom Cursor for desktop */}
      <CustomCursor />

      {/* Primary Sticky Top Bar */}
      <Navbar onOpenResume={() => setIsResumeModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero onOpenResume={() => setIsResumeModalOpen(true)} />
        <About />
        <Skills />
        <ProjectsSection />
        <Experience />
        <AchievementsAndEducation />
        <Contact />
      </main>

      {/* Minimalist Footer */}
      <Footer />

      {/* Resume Breakdown & Download Modal */}
      <ResumeModal 
        isOpen={isResumeModalOpen} 
        onClose={() => setIsResumeModalOpen(false)} 
      />
    </div>
  );
}
