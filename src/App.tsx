import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiArrowRight,
  FiBookOpen,
  FiChevronRight,
  FiCopy,
  FiExternalLink,
  FiGithub,
  FiMail,
  FiShield,
} from 'react-icons/fi';
import { CommandPalette } from './components/CommandPalette';
import { CursorGlow } from './components/CursorGlow';
import { Hero } from './components/Hero';
import { Logo } from './components/Logo';
import { Navbar } from './components/Navbar';
import { Section } from './components/Section';
import { Stats } from './components/Stats';
import { Toast } from './components/Toast';
import { ToolsGrid } from './components/ToolsGrid';
import {
  caseStudies,
  featuredTools,
  footerResources,
  githubUrl,
  platformLinks,
  researchArticles,
  technologyStack,
  whyHatrix,
} from './data/content';

const MissionControl = lazy(() => import('./components/MissionControl').then((module) => ({ default: module.MissionControl })));

type SavedMissionProgress = {
  completed: string[];
  bestScores: Record<string, number>;
  ranks: Record<string, string>;
  fastestTimes: Record<string, number>;
  evidencePercent: Record<string, number>;
  lastPlayed?: string;
};

function LoadingScreen() {
  return (
    <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-base" exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
      <div className="text-center">
        <motion.div
          className="mx-auto mb-5 h-16 w-16 rounded-2xl border border-accent/60 bg-panel"
          animate={{ opacity: [0.55, 1, 0.55], boxShadow: ['0 0 0 rgba(229,9,20,0)', '0 0 28px rgba(229,9,20,.35)', '0 0 0 rgba(229,9,20,0)'] }}
          transition={{ duration: 1.35, repeat: Infinity }}
        />
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-zinc-400">Initializing Hatrix</p>
      </div>
    </motion.div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [activeCase, setActiveCase] = useState(caseStudies[0].title);
  const [activeArticle, setActiveArticle] = useState(researchArticles[0].title);
  const [missionOpen, setMissionOpen] = useState(false);
  const [missionProgress, setMissionProgress] = useState<SavedMissionProgress>({
    completed: [],
    bestScores: {},
    ranks: {},
    fastestTimes: {},
    evidencePercent: {},
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hatrix-mission-progress');
      if (stored) setMissionProgress(JSON.parse(stored));
    } catch {
      setMissionProgress({ completed: [], bestScores: {}, ranks: {}, fastestTimes: {}, evidencePercent: {} });
    }
  }, [missionOpen]);

  const selectedCase = useMemo(() => caseStudies.find((item) => item.title === activeCase) ?? caseStudies[0], [activeCase]);
  const selectedArticle = useMemo(() => researchArticles.find((item) => item.title === activeArticle) ?? researchArticles[0], [activeArticle]);

  const copyEthicalUse = async () => {
    const text = 'Hatrix is designed for education, defensive security, research and authorized testing.';
    await navigator.clipboard.writeText(text);
    setToast('Ethical use policy copied.');
  };

  if (missionOpen) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <MissionControl onExit={() => setMissionOpen(false)} />
      </Suspense>
    );
  }

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <CursorGlow />
      <Navbar onOpenCommand={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <Toast message={toast} />
      <main>
        <Hero onLaunchMissionControl={() => setMissionOpen(true)} />
        <Stats />
        <section className="px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1240px] gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-[1.35rem] border border-accent/25 bg-panel p-7 shadow-card">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">Hatrix Mission Control</p>
              <h2 className="text-3xl font-black text-white sm:text-4xl">Simulated SOC incident-response lab</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-400">
                Investigate simulated alerts, collect evidence, use a safe analyst terminal, contain the incident, and export a local report. No data leaves the browser.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-base p-4">
                  <p className="text-xs text-zinc-500">Active simulated incident</p>
                  <p className="mt-2 font-bold text-white">Finance admin compromise</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-base p-4">
                  <p className="text-xs text-zinc-500">Severity</p>
                  <p className="mt-2 font-bold text-accent">Critical</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-base p-4">
                  <p className="text-xs text-zinc-500">Affected asset</p>
                  <p className="mt-2 font-bold text-white">FIN-WKS-014</p>
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm text-zinc-400"><span>Investigation progress</span><span>0%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-2 w-0 rounded-full bg-accent" /></div>
              </div>
              <button type="button" onClick={() => setMissionOpen(true)} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 font-bold text-white shadow-glow transition hover:bg-red-600 sm:w-auto">
                Launch Mission <FiArrowRight />
              </button>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-panel p-7 shadow-card">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">Local Progress</p>
              <p className="text-5xl font-black text-white">{missionProgress.completed.length}/3</p>
              <p className="mt-2 text-sm text-zinc-400">Completed missions stored locally in this browser.</p>
              <div className="mt-6 grid gap-3 text-sm">
                <p className="flex justify-between border-b border-white/10 pb-2 text-zinc-300"><span>Best score</span><span>{Math.max(0, ...Object.values(missionProgress.bestScores))}</span></p>
                <p className="flex justify-between border-b border-white/10 pb-2 text-zinc-300"><span>Best rank</span><span>{Object.values(missionProgress.ranks)[0] || 'Not started'}</span></p>
                <p className="flex justify-between text-zinc-300"><span>Last mission</span><span>{missionProgress.lastPlayed || 'None'}</span></p>
              </div>
            </div>
          </div>
        </section>
        <section className="px-5 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-accent">Featured Tools</p>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Premium tool preview</h2>
              <p className="mt-5 text-base leading-8 text-zinc-400 sm:text-lg">
                Three practical utilities shown as a product-style preview before the full searchable library.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {featuredTools.slice(0, 3).map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.article
                    key={tool.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: index * 0.06 }}
                    className="group rounded-[1.35rem] border border-white/10 bg-panel p-7 shadow-card transition hover:-translate-y-2 hover:border-accent/55 hover:shadow-glow"
                    tabIndex={0}
                  >
                    <div className="mb-7 flex items-center justify-between">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-2xl text-accent">
                        <Icon />
                      </div>
                      <span className="rounded-full bg-accent/12 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent">{tool.category}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white">{tool.title}</h3>
                    <p className="mt-4 min-h-20 text-sm leading-7 text-zinc-400">{tool.description}</p>
                    <div className="mt-6">
                      <span className="rounded-full border border-white/10 bg-base px-3 py-1.5 text-xs font-semibold text-zinc-300">{tool.status}</span>
                    </div>
                    <a href="#tools" className="group/button mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-base px-5 py-3.5 text-sm font-bold text-white transition hover:border-accent/70 hover:bg-accent/10">
                      Open Tool <FiArrowRight className="transition group-hover/button:translate-x-1" />
                    </a>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <Section id="tools" eyebrow="Tools Library" title="Searchable cybersecurity utilities" description="Filter and search the complete Hatrix tool catalog for encoding, hashing, recon, education and defensive analysis.">
          <ToolsGrid onAction={setToast} />
        </Section>

        <Section id="why-hatrix" eyebrow="Why Hatrix" title="Built for measured, authorized security work" description="Hatrix favors local workflows, clear limitations and practical outputs over theatrics. The platform is designed to support learning, research and real operational tasks.">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {whyHatrix.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-white/10 bg-panel p-6 shadow-card">
                  <Icon className="mb-5 text-2xl text-accent" />
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
                </motion.article>
              );
            })}
          </div>
        </Section>

        <Section id="case-studies" eyebrow="Case Studies" title="Research-backed project patterns" description="Representative project cards for future Hatrix work. They describe realistic problems, approaches and outcomes without inflated claims.">
          <div className="grid gap-5 lg:grid-cols-3">
            {caseStudies.map((study) => (
              <article key={study.title} className={`rounded-2xl border bg-panel p-6 shadow-card transition ${activeCase === study.title ? 'border-accent/55' : 'border-white/10 hover:border-accent/35'}`}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{study.category}</p>
                <h3 className="text-xl font-bold text-white">{study.title}</h3>
                <p className="mt-4 text-sm leading-6 text-zinc-400"><span className="text-zinc-200">Problem:</span> {study.problem}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400"><span className="text-zinc-200">Approach:</span> {study.approach}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {study.technologies.map((tech) => <span key={tech} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-300">{tech}</span>)}
                </div>
                <button type="button" onClick={() => { setActiveCase(study.title); setToast(`${study.title} selected.`); }} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent/60 hover:bg-white/5">
                  View Case Study <FiChevronRight />
                </button>
              </article>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-base/70 p-6">
            <p className="text-sm font-semibold text-white">Outcome: {selectedCase.outcome}</p>
          </div>
        </Section>

        <Section id="research" eyebrow="Latest Security Research" title="Writeups, explainers and analyst notes" description="Sample research entries that can evolve into full Hatrix articles as the platform grows.">
          <div className="grid gap-5 lg:grid-cols-5">
            <div className="grid gap-4 lg:col-span-3">
              {researchArticles.map((article) => (
                <article key={article.title} id={`article-${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className={`rounded-2xl border bg-panel p-6 transition ${activeArticle === article.title ? 'border-accent/55' : 'border-white/10 hover:border-accent/35'}`}>
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                    <span className="font-semibold uppercase tracking-[0.2em] text-accent">{article.category}</span>
                    <span>{article.date}</span>
                    <span>{article.readingTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{article.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{article.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-300">{tag}</span>)}
                  </div>
                  <button type="button" onClick={() => { setActiveArticle(article.title); setToast(`${article.title} selected.`); }} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-accent">
                    Read Article <FiArrowRight />
                  </button>
                </article>
              ))}
            </div>
            <aside className="lg:col-span-2">
              <div className="sticky top-28 rounded-2xl border border-white/10 bg-panel p-6">
                <FiBookOpen className="mb-5 text-2xl text-accent" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{selectedArticle.category}</p>
                <h3 className="mt-3 text-2xl font-bold text-white">{selectedArticle.title}</h3>
                <p className="mt-4 text-sm leading-6 text-zinc-400">{selectedArticle.summary}</p>
              </div>
            </aside>
          </div>
        </Section>

        <Section id="stack" eyebrow="Technology Stack" title="Tools and environments Hatrix is built around">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {technologyStack.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="group rounded-2xl border border-white/10 bg-panel p-5 text-center transition hover:-translate-y-1 hover:border-accent/40">
                  <Icon className="mx-auto text-2xl text-zinc-400 transition group-hover:text-white" />
                  <p className="mt-3 text-sm font-semibold text-zinc-300">{item.name}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <section id="ethical-use" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-accent/25 bg-[linear-gradient(135deg,rgba(229,9,20,.16),rgba(20,20,20,.78))] p-8 shadow-card sm:p-10">
            <FiShield className="mb-5 text-3xl text-accent" />
            <h2 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl">Security tools should be used responsibly.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">Hatrix is designed for education, defensive security, research and authorized testing.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#tools" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-glow transition hover:bg-red-600">Explore Tools <FiArrowRight /></a>
              <button type="button" onClick={copyEthicalUse} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-accent/60 hover:bg-white/5">Read Ethical Use Policy <FiCopy /></button>
            </div>
          </div>
        </section>

        <Section id="contact" eyebrow="Contact" title="Connect with Hatrix" description="Use the repository for source visibility and the contact action for future collaboration updates.">
          <div className="flex flex-wrap gap-3">
            <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-panel px-5 py-3 font-semibold text-white transition hover:border-accent/60 hover:bg-white/5"><FiGithub /> GitHub <FiExternalLink /></a>
            <button type="button" onClick={() => setToast('Contact channel will be connected when public inbox details are ready.')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-panel px-5 py-3 font-semibold text-white transition hover:border-accent/60 hover:bg-white/5"><FiMail /> Contact</button>
          </div>
        </Section>
      </main>
      <footer className="border-t border-white/10 px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-5 max-w-md text-sm leading-6 text-zinc-400">A cybersecurity platform for practical tools, research, automation and authorized security workflows.</p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-300"><span className="h-2.5 w-2.5 rounded-full bg-accent shadow-glow" /> All systems operational</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Platform</h3>
            <div className="mt-4 grid gap-3">
              {platformLinks.map((link) => <a key={link.href} href={link.href} className="text-sm text-zinc-400 hover:text-white">{link.label}</a>)}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Resources</h3>
            <div className="mt-4 grid gap-3">
              {footerResources.map((link) => <a key={link.href} href={link.href} className="text-sm text-zinc-400 hover:text-white">{link.label}</a>)}
              <a href={githubUrl} target="_blank" rel="noreferrer" className="text-sm text-zinc-400 hover:text-white">GitHub</a>
              <a href="#contact" className="text-sm text-zinc-400 hover:text-white">Contact</a>
              <button type="button" onClick={() => setToast('Privacy note: public policy page will be added with final legal copy.')} className="text-left text-sm text-zinc-400 hover:text-white">Privacy</button>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-500">
          Hatrix {'\u00A9'} 2026. Building Cybersecurity Tools.
        </div>
      </footer>
    </>
  );
}

export default App;
