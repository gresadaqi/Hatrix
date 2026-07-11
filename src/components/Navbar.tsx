import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Logo } from './Logo';

const navItems = ['Home', 'About', 'Tools', 'Projects', 'Blog', 'Contact'];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-base/82 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#home" aria-label="Hatrix home">
          <Logo />
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              {item}
            </a>
          ))}
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-white md:hidden"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-white/10 bg-base px-5 py-4 md:hidden">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block rounded-md px-3 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
