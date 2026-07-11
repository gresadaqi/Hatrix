import { useEffect, useMemo, useRef, useState } from 'react';
import { FiExternalLink, FiSearch, FiX } from 'react-icons/fi';
import { commandSections, githubUrl, caseStudies, researchArticles } from '../data/content';
import { tools } from '../data/tools';

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

type CommandItem = {
  label: string;
  description: string;
  href: string;
  keywords: string;
  external?: boolean;
};

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<CommandItem[]>(() => {
    const sectionItems = commandSections.map((item) => ({
      label: item.label,
      description: 'Navigate to section',
      href: item.href,
      keywords: item.keywords,
    }));

    const toolItems = tools.map((tool) => ({
      label: tool.name,
      description: `${tool.category} tool`,
      href: '#tools',
      keywords: `${tool.name} ${tool.category} ${tool.description}`,
    }));

    const projectItems = caseStudies.map((study) => ({
      label: study.title,
      description: study.category,
      href: '#case-studies',
      keywords: `${study.title} ${study.category} ${study.problem}`,
    }));

    const articleItems = researchArticles.map((article) => ({
      label: article.title,
      description: article.category,
      href: '#research',
      keywords: `${article.title} ${article.category} ${article.summary} ${article.tags.join(' ')}`,
    }));

    return [
      ...sectionItems,
      ...toolItems,
      ...projectItems,
      ...articleItems,
      {
        label: 'Open GitHub',
        description: 'Repository',
        href: githubUrl,
        keywords: 'github repository source code',
        external: true,
      },
      {
        label: 'Open Contact',
        description: 'Contact section',
        href: '#contact',
        keywords: 'contact email connect',
      },
    ];
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items.slice(0, 9);
    return items
      .filter((item) => `${item.label} ${item.description} ${item.keywords}`.toLowerCase().includes(normalized))
      .slice(0, 12);
  }, [items, query]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    inputRef.current?.focus();
    return () => previous?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const activateItem = (item: CommandItem) => {
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.hash = item.href;
    }
    setQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/70 px-4 py-16 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={onClose}>
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#111]/95 shadow-card" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <FiSearch className="text-zinc-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools, projects, articles or sections"
            className="h-11 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
          <button type="button" className="grid h-9 w-9 place-items-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white" onClick={onClose} aria-label="Close command palette">
            <FiX />
          </button>
        </div>
        <div className="max-h-[24rem] overflow-y-auto p-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <button
                key={`${item.label}-${item.href}`}
                type="button"
                onClick={() => activateItem(item)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-white/5 focus-visible:bg-white/5"
              >
                <span>
                  <span className="block text-sm font-semibold text-white">{item.label}</span>
                  <span className="mt-1 block text-xs text-zinc-500">{item.description}</span>
                </span>
                {item.external && <FiExternalLink className="text-zinc-500" />}
              </button>
            ))
          ) : (
            <p className="rounded-xl border border-white/10 bg-panel p-5 text-sm text-zinc-400">No commands match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
