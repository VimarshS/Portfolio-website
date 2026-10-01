import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if device supports fine hover pointer
    const checkFinePointer = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsMobile(!hasFinePointer || prefersReducedMotion);
    };

    checkFinePointer();
    window.addEventListener('resize', checkFinePointer);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, textarea, select, [role="button"]');
        setIsPointer(!!interactive);
      }
    };

    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('resize', checkFinePointer);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* Center dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 w-2 h-2 rounded-full bg-indigo-400 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`
        }}
      />
      {/* Soft trailing ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-indigo-400/40 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
          isPointer ? 'w-10 h-10 bg-indigo-500/10 scale-125' : 'w-6 h-6'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`
        }}
      />
    </>
  );
};
