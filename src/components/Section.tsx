import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

type SectionProps = PropsWithChildren<{
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
}>;

export function Section({ id, eyebrow, title, description, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-28 px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          className="mb-12 max-w-3xl"
        >
          {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-accent">{eyebrow}</p>}
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{title}</h2>
          {description && <p className="mt-5 text-base leading-8 text-zinc-400 sm:text-lg">{description}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
