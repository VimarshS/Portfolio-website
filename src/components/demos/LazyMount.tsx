import React, { useEffect, useRef, useState } from 'react';

// Grey pulsing placeholder shown before a demo loads
export const DemoSkeleton: React.FC = () => (
  <div className="min-h-[260px] rounded-lg bg-neutral-900/40 animate-pulse" aria-hidden="true" />
);

interface LazyMountProps {
  children: React.ReactNode;
  rootMargin?: string;
}

// Renders its children only when this area gets close to the screen.
// Once shown, it stays mounted.
export const LazyMount: React.FC<LazyMountProps> = ({ children, rootMargin = '300px' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;

    // Very old browsers: just show the demo
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return <div ref={ref}>{visible ? children : <DemoSkeleton />}</div>;
};