import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiBookOpen, FiChevronRight, FiGithub, FiSearch, FiShield, FiTool } from 'react-icons/fi';
import { categories, tools, type ToolCategory } from '../data/tools';
import { IocDefanger } from './tools/IocDefanger';
import { SecurityHeaderAnalyzer } from './tools/SecurityHeaderAnalyzer';

const allCategories = ['All', ...categories] as const;

type ToolsGridProps = {
  onAction: (message: string) => void;
};

export function ToolsGrid({ onAction }: ToolsGridProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof allCategories)[number]>('All');
  const [iocToolOpen, setIocToolOpen] = useState(false);
  const [headerToolOpen, setHeaderToolOpen] = useState(false);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = category === 'All' || tool.category === category;
      const matchesQuery =
        !normalizedQuery ||
        [tool.name, tool.description, tool.category, tool.status].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div>
      <AnimatePresence>
        {iocToolOpen && <IocDefanger onClose={() => setIocToolOpen(false)} />}
        {headerToolOpen && <SecurityHeaderAnalyzer onClose={() => setHeaderToolOpen(false)} />}
      </AnimatePresence>
      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search tools</span>
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools"
            className="h-12 w-full rounded-xl border border-white/10 bg-panel pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-accent/70 focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Tool categories">
          {allCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`h-12 rounded-xl border px-4 text-sm font-semibold transition active:scale-[0.98] ${
                category === item
                  ? 'border-accent bg-accent text-white shadow-glow'
                  : 'border-white/10 bg-panel text-zinc-300 hover:border-accent/60 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredTools.map((tool, index) => (
          <motion.article
            layout
            key={tool.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: Math.min(index * 0.03, 0.25) }}
            className="group rounded-2xl border border-white/10 bg-panel p-5 shadow-card transition hover:-translate-y-1 hover:border-accent/45 hover:shadow-glow"
            tabIndex={0}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-base text-accent">
                  <FiShield />
                </div>
                <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-zinc-400">{tool.description}</p>
              </div>
              <span className="rounded-full bg-accent/12 px-2.5 py-1 text-xs font-semibold text-accent">{tool.category as ToolCategory}</span>
            </div>
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span>v{tool.version}</span>
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              <span>{tool.status}</span>
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              <span>Privacy aware</span>
            </div>
            {tool.action ? (
              <button type="button" onClick={() => tool.action === 'ioc-transform' ? setIocToolOpen(true) : setHeaderToolOpen(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-glow transition hover:bg-red-600 active:scale-[0.98]"><FiTool /> Open Tool</button>
            ) : <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onAction(`${tool.name} repository link will be added when it is published.`)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent/60 hover:bg-white/5 active:scale-[0.98]"
              >
                <FiGithub /> GitHub
              </button>
              <button
                type="button"
                onClick={() => onAction(`${tool.name} documentation entry selected.`)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/8 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent active:scale-[0.98]"
              >
                <FiBookOpen /> Docs
              </button>
            </div>}
          </motion.article>
        ))}
      </motion.div>
      {filteredTools.length === 0 && (
        <div className="mt-10 rounded-2xl border border-white/10 bg-panel p-6 text-zinc-400">
          <p>No tools match the current search.</p>
          <button type="button" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent" onClick={() => { setQuery(''); setCategory('All'); }}>
            Reset filters <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
