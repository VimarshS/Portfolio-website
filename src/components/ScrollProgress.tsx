import React, { useEffect, useRef } from 'react';

// A thin line at the top of the page that fills as you scroll down.
export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    // At most one update per screen refresh, so scrolling stays smooth
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full origin-left bg-linear-to-r from-indigo-500 via-violet-400 to-fuchsia-400 will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};