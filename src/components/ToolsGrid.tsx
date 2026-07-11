import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiGithub, FiSearch } from 'react-icons/fi';
import { categories, tools, type ToolCategory } from '../data/tools';

const allCategories = ['All', ...categories] as const;

export function ToolsGrid() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof allCategories)[number]>('All');

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
      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
        <label className="relative block">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools"
            className="h-12 w-full rounded-md border border-white/10 bg-panel pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-accent/70 focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`h-12 rounded-md border px-4 text-sm font-semibold transition ${
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
            className="group rounded-md border border-white/10 bg-panel p-5 shadow-card transition hover:-translate-y-1 hover:border-accent/55 hover:shadow-glow"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-zinc-400">{tool.description}</p>
              </div>
              <span className="rounded bg-accent/12 px-2.5 py-1 text-xs font-semibold text-accent">{tool.category as ToolCategory}</span>
            </div>
            <div className="mb-5 flex items-center gap-3 text-xs text-zinc-400">
              <span>v{tool.version}</span>
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              <span>{tool.status}</span>
            </div>
            <div className="flex gap-3">
              <a href={tool.githubUrl} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent/60 hover:bg-white/5">
                <FiGithub /> GitHub
              </a>
              <a href={tool.docsUrl} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-white/8 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent">
                <FiBookOpen /> Docs
              </a>
            </div>
          </motion.article>
        ))}
      </motion.div>
      {filteredTools.length === 0 && <p className="mt-10 rounded-md border border-white/10 bg-panel p-6 text-zinc-400">No tools match the current search.</p>}
    </div>
  );
}
