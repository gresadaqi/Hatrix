import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { stats } from '../data/content';

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || started) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
        if (reduceMotion) {
          setCount(value);
          observer.disconnect();
          return;
        }
        const start = performance.now();
        const duration = 900;
        const tick = (time: number) => {
          const progress = Math.min((time - start) / duration, 1);
          setCount(Math.round(value * progress));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reduceMotion, started, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function Stats() {
  return (
    <section className="border-y border-white/10 bg-panel/35 px-5 py-7 sm:px-8 lg:px-10" aria-label="Platform statistics">
      <div className="mx-auto grid max-w-[1240px] divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.06 }}
            className="px-5 py-5 text-center"
          >
            <p className="text-4xl font-black text-accent sm:text-5xl"><Counter value={stat.value} suffix={stat.suffix} /></p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
