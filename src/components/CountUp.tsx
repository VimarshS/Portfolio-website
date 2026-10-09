import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** Text such as "250+" or "5+". Anything else (like "3rd Place") is shown as it is. */
  value: string;
}

const DURATION = 1200;

// Counts a number up from zero the first time it comes into view.
export const CountUp: React.FC<CountUpProps> = ({ value }) => {
  const match = /^(\d+)(\+?)$/.exec(value);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';

  const reduce =
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // People who asked for less motion see the final number straight away
  const [shown, setShown] = useState(target !== null && !reduce ? 0 : target ?? 0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (target === null || reduce) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShown(target);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        const eased = 1 - Math.pow(1 - t, 3); // starts fast, ends slowly
        setShown(Math.round(target * eased));
        if (t < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [target, reduce]);

  if (target === null) return <span>{value}</span>;

  return (
    <span ref={ref}>
      {/* Screen readers get the final number, not the counting */}
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
    </span>
  );
};