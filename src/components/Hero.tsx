import { motion } from 'framer-motion';
import { FiArrowRight, FiGithub } from 'react-icons/fi';
import { Logo } from './Logo';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden px-5 pt-32 sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_26%,rgba(229,9,20,0.22),transparent_32%),linear-gradient(180deg,#0B0B0B_0%,#101010_55%,#0B0B0B_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:42px_42px]" />
      <motion.div
        className="absolute right-[-12rem] top-24 h-[34rem] w-[34rem] rounded-full border border-accent/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 hidden h-56 w-96 rounded-md border border-white/10 bg-panel/50 shadow-card backdrop-blur md:block"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45, duration: 0.7 }}
      >
        <div className="flex h-10 items-center gap-2 border-b border-white/10 px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
        </div>
        <div className="space-y-3 p-5 font-mono text-xs text-zinc-300">
          <p><span className="text-accent">$</span> hatrix scan --scope authorized</p>
          <p className="text-zinc-500">loading modules: web, osint, crypto, network</p>
          <p>risk signals <span className="text-accent">16</span> | verified <span className="text-white">12</span></p>
          <div className="h-2 overflow-hidden rounded bg-white/10">
            <motion.div className="h-full bg-accent" initial={{ width: '12%' }} animate={{ width: '86%' }} transition={{ duration: 2.2, repeat: Infinity, repeatType: 'reverse' }} />
          </div>
        </div>
      </motion.div>
      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="max-w-3xl pb-16"
        >
          <Logo />
          <h1 className="mt-8 text-6xl font-black text-white sm:text-7xl lg:text-8xl">Hatrix</h1>
          <p className="mt-5 text-xl font-medium text-zinc-300 sm:text-2xl">Cybersecurity Tools • Research • Automation</p>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            A focused platform for offensive and defensive utilities, security automation, writeups, and practical resources.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#tools" className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-white shadow-glow transition hover:bg-red-600">
              Explore Tools <FiArrowRight />
            </a>
            <a href="#" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-accent/60 hover:bg-white/5">
              <FiGithub /> GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
