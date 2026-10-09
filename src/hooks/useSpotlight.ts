import { useEffect } from 'react';

// One mouse listener for every element with the "spotlight" class.
// It stores the mouse position inside the card as CSS variables (--mx, --my).
export function useSpotlight() {
  useEffect(() => {
    // Only for devices with a real mouse
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;

    let frame = 0;
    let lastEvent: MouseEvent | null = null;

    const update = () => {
      frame = 0;
      const event = lastEvent;
      if (!event) return;

      const target = event.target as Element | null;
      const card = target?.closest?.('.spotlight') as HTMLElement | null;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };

    const onMove = (event: MouseEvent) => {
      lastEvent = event;
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}