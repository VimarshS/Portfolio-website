import React, { useEffect, useState } from 'react';
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
import { Reveal } from './components/Reveal';
import { ScrollProgress } from './components/ScrollProgress';
import { useSpotlight } from './hooks/useSpotlight';

export default function App() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
    useSpotlight();
    // Shortcut to the admin page: Alt + Shift + A
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.code === 'KeyA') {
        const target = e.target as HTMLElement | null;
        // Do nothing while the visitor is typing in a form field
        if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
        e.preventDefault();
        window.location.href = '/admin';
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#050506] text-neutral-200 selection:bg-indigo-500/20 selection:text-indigo-200 relative tech-grid-pattern">
      {/* Reading progress line at the top */}
      <ScrollProgress />
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
        <Reveal>
          <Experience />
        </Reveal>
        <Reveal>
          <AchievementsAndEducation />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
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
