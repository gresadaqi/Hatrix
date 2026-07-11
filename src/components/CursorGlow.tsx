import { useEffect, useState } from 'react';

export function CursorGlow() {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || touch) return;
    setEnabled(true);
    const onPointerMove = (event: PointerEvent) => setPosition({ x: event.clientX, y: event.clientY });
    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed z-[1] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-3xl"
      style={{ left: position.x, top: position.y }}
      aria-hidden="true"
    />
  );
}
