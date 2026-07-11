import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiGithub, FiSearch, FiShield, FiZap } from 'react-icons/fi';
import { githubUrl } from '../data/content';
import { Logo } from './Logo';

type HeroProps = {
  onLaunchMissionControl: () => void;
};

export function Hero({ onLaunchMissionControl }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const activity = ['Security headers module ready', 'IOC parser indexed', 'Crypto utilities verified'];

  return (
    <section id="home" className="relative overflow-hidden px-5 pt-28 sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_45%,rgba(229,9,20,0.34),transparent_34%),radial-gradient(circle_at_18%_76%,rgba(229,9,20,0.08),transparent_26%),linear-gradient(180deg,#0B0B0B_0%,#111_56%,#0B0B0B_100%)]" />
      <div className="animated-grid absolute inset-0 opacity-[0.23]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.72)_100%)]" />
      <div className="noise-overlay" />

      <div className="relative mx-auto grid min-h-[760px] max-w-[1240px] items-center gap-12 py-14 lg:grid-cols-[55fr_45fr] lg:py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="mb-7">
            <Logo />
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white shadow-glow">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-55" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            OPEN SOURCE SECURITY PLATFORM
          </div>
          <h1 className="mt-7 text-6xl font-black leading-[0.94] tracking-tight text-white sm:text-7xl lg:text-[88px]">
            Hatrix
            <span className="block bg-gradient-to-r from-accent via-red-400 to-white bg-clip-text text-transparent">
              Security Platform
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-semibold leading-9 text-zinc-200 sm:text-2xl">
            Cybersecurity Tools / Research / Automation
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
            Practical cybersecurity tools, research and automation built for ethical hackers, SOC analysts and security researchers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {['Privacy First', 'Ethical Use', 'Open Source'].map((label) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-panel/75 px-3.5 py-2 text-sm font-medium text-zinc-200">
                {label === 'Ethical Use' ? <FiShield className="text-accent" /> : <FiCheckCircle className="text-accent" />}
                {label}
              </span>
            ))}
          </div>
          <div className="mt-9 grid gap-3 sm:flex">
            <button type="button" onClick={onLaunchMissionControl} className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-7 py-4 text-base font-bold text-white shadow-glow transition hover:bg-red-600 active:scale-[0.98] sm:w-auto">
              Launch Mission Control <FiZap className="transition group-hover:translate-x-1" />
            </button>
            <a href="#tools" className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-7 py-4 text-base font-bold text-white shadow-glow transition hover:bg-red-600 active:scale-[0.98] sm:w-auto">
              Explore Tools <FiArrowRight className="transition group-hover:translate-x-1" />
            </a>
            <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-panel/80 px-7 py-4 text-base font-bold text-white transition hover:border-accent/70 hover:bg-white/5 active:scale-[0.98] sm:w-auto">
              <FiGithub /> GitHub
            </a>
            <a href="#research" className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-4 text-sm font-bold text-zinc-300 transition hover:text-white sm:w-auto">
              View Research <FiArrowRight className="transition group-hover:translate-x-1" />
            </a>
          </div>
          <div className="mt-7 rounded-2xl border border-accent/25 bg-panel/80 p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Simulated Mission Preview</p>
              <span className="rounded-full border border-accent/30 px-2.5 py-1 text-xs text-red-100">Critical</span>
            </div>
            <h2 className="text-lg font-bold text-white">Compromised Finance Administrator Account</h2>
            <div className="mt-4 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
              <p><span className="block text-zinc-500">Affected asset</span>FIN-WKS-014</p>
              <p><span className="block text-zinc-500">Progress</span>0% investigation</p>
              <p><span className="block text-zinc-500">Activity</span>Simulated only</p>
            </div>
            <button type="button" onClick={onLaunchMissionControl} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-base px-4 py-3 text-sm font-bold text-white transition hover:border-accent/60 hover:bg-accent/10 sm:w-auto">
              Launch Mission <FiArrowRight />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="relative mx-auto w-full max-w-[520px] lg:min-w-[520px]"
        >
          <div className="absolute -inset-8 rounded-[2rem] bg-accent/20 blur-3xl" />
          <motion.div
            className="absolute -right-2 -top-7 z-20 rounded-2xl border border-accent/35 bg-panel/90 px-4 py-3 text-sm font-semibold text-white shadow-glow backdrop-blur"
            animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            All Systems Operational
          </motion.div>
          <motion.div
            className="absolute -bottom-6 left-4 z-20 rounded-2xl border border-white/10 bg-base/95 px-4 py-3 text-sm font-semibold text-zinc-200 shadow-card backdrop-blur"
            animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          >
            <FiShield className="mr-2 inline text-accent" />
            Local Processing Enabled
          </motion.div>

          <div className="relative overflow-hidden rounded-[1.6rem] border border-white/12 bg-[#111]/90 shadow-[0_30px_90px_rgba(0,0,0,.58)] backdrop-blur-xl">
            <div className="flex h-12 items-center justify-between border-b border-white/10 px-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
              </div>
              <span className="font-mono text-xs text-zinc-500">hatrix-status</span>
            </div>

            <div className="p-6">
              <div className="mb-6 flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">System Status</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Platform ready</h2>
                </div>
                <div className="rounded-2xl border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-bold text-white">Live</div>
              </div>

              <div className="mb-6 rounded-2xl border border-white/10 bg-base/70 p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-zinc-300">Animated scan progress</span>
                  <span className="font-mono text-accent">86%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-red-400"
                    initial={{ width: '18%' }}
                    animate={reduceMotion ? { width: '86%' } : { width: ['18%', '86%', '64%', '86%'] }}
                    transition={{ duration: 5, repeat: reduceMotion ? 0 : Infinity }}
                  />
                </div>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-3">
                {[
                  ['Threat Signals', '47'],
                  ['Tools Available', '12'],
                  ['Research Count', '20'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-panel p-4">
                    <p className="text-2xl font-black text-accent">{value}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-base/70 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-white">Recent Activity</p>
                  <FiZap className="text-accent" />
                </div>
                <div className="space-y-3">
                  {activity.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduceMotion ? 0 : 0.55 + index * 0.16 }}
                      className="flex items-center gap-3 text-sm text-zinc-300"
                    >
                      <FiSearch className="text-accent" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
