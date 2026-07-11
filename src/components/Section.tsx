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
    <section id={id} className="scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          className="mb-10 max-w-3xl"
        >
          {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-accent">{eyebrow}</p>}
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          {description && <p className="mt-4 text-base leading-7 text-zinc-400 sm:text-lg">{description}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
