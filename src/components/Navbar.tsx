import { useEffect, useState } from 'react';
import { FiGithub, FiMenu, FiSearch, FiX } from 'react-icons/fi';
import { githubUrl, navItems } from '../data/content';
import { Logo } from './Logo';

type NavbarProps = {
  onOpenCommand: () => void;
};

export function Navbar({ onOpenCommand }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-24% 0px -62% 0px', threshold: [0.15, 0.35, 0.65] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const navClass = scrolled
    ? 'border-white/10 bg-base/86 shadow-[0_12px_42px_rgba(0,0,0,.32)] backdrop-blur-xl'
    : 'border-transparent bg-transparent backdrop-blur-0';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition duration-300 ${navClass}`}>
      <nav className="mx-auto flex h-24 max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#home" aria-label="Hatrix home">
          <Logo />
        </a>
        <div className="hidden items-center gap-4 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link rounded-lg px-2 py-2 text-sm font-medium transition ${
                active === item.href.slice(1) ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
              aria-current={active === item.href.slice(1) ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCommand}
            className="hidden h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-zinc-400 transition hover:border-accent/45 hover:text-white active:scale-[0.98] md:inline-flex"
            aria-label="Open command palette"
          >
            <FiSearch />
            <span>Search</span>
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-500">Ctrl K</kbd>
          </button>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden h-11 items-center gap-2 rounded-xl border border-accent/65 bg-accent/10 px-4 text-sm font-semibold text-white transition hover:bg-accent/20 active:scale-[0.98] md:inline-flex"
          >
            <FiGithub /> GitHub
          </a>
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-white lg:hidden"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-navigation" className="border-t border-white/10 bg-base/96 px-5 py-4 backdrop-blur-xl lg:hidden">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenCommand();
            }}
            className="mb-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-semibold text-white"
          >
            <FiSearch /> Search
          </button>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href={githubUrl} target="_blank" rel="noreferrer" className="mt-3 flex h-11 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-white">
            <FiGithub /> GitHub
          </a>
        </div>
      )}
    </header>
  );
}
