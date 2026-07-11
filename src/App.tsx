import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiShield, FiTerminal } from 'react-icons/fi';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Section } from './components/Section';
import { ToolsGrid } from './components/ToolsGrid';

const projects = [
  ['Attack Surface Monitor', 'Continuous exposure tracking for domains, records, and externally visible services.'],
  ['Blue Team Playbooks', 'Reusable detection, triage, and response workflows for practical operations.'],
  ['Payload Lab', 'Controlled educational payload examples for authorized security testing.'],
];

const articles = [
  ['Building Reliable Recon Pipelines', 'A future writeup on collection quality, validation, and repeatable automation.'],
  ['Defensive Utility Design', 'Notes on building tools that help analysts move faster without losing context.'],
  ['Practical Crypto Helpers', 'Research notes for safe local encoders, decoders, and digest utilities.'],
];

function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-base"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="text-center">
        <motion.div
          className="mx-auto mb-5 h-16 w-16 rounded-md border border-accent bg-panel"
          animate={{ rotate: [0, 0, 90, 90, 180], boxShadow: ['0 0 0 rgba(229,9,20,0)', '0 0 34px rgba(229,9,20,.45)', '0 0 0 rgba(229,9,20,0)'] }}
          transition={{ duration: 1.35, repeat: Infinity }}
        />
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-zinc-400">Initializing Hatrix</p>
      </div>
    </motion.div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <Navbar />
      <main>
        <Hero />
        <Section
          id="about"
          eyebrow="About"
          title="Security tooling with practical intent"
          description="A cybersecurity team focused on building offensive and defensive security tools, automation, penetration testing utilities, blue team resources, and educational projects."
        >
          <div className="grid gap-5 md:grid-cols-3">
            {['Offensive Utilities', 'Defensive Resources', 'Automation First'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-md border border-white/10 bg-panel p-6 shadow-card"
              >
                <FiShield className="mb-5 text-2xl text-accent" />
                <h3 className="mb-3 text-lg font-bold text-white">{item}</h3>
                <p className="text-sm leading-6 text-zinc-400">
                  Focused, documented, and built to be extended as the Hatrix platform grows.
                </p>
              </motion.div>
            ))}
          </div>
        </Section>
        <Section id="tools" eyebrow="Tools" title="Searchable cybersecurity utilities" description="Filter by category or search by name, status, or purpose. The data model is ready for real repositories and documentation links.">
          <ToolsGrid />
        </Section>
        <Section id="projects" eyebrow="Projects" title="Upcoming cybersecurity projects">
          <div className="grid gap-5 md:grid-cols-3">
            {projects.map(([title, description]) => (
              <article key={title} className="rounded-md border border-white/10 bg-panel p-6 transition hover:border-accent/50">
                <FiTerminal className="mb-5 text-2xl text-accent" />
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
              </article>
            ))}
          </div>
        </Section>
        <Section id="blog" eyebrow="Blog" title="Writeups and research">
          <div className="grid gap-5 lg:grid-cols-3">
            {articles.map(([title, description]) => (
              <article key={title} className="rounded-md border border-white/10 bg-panel p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Coming Soon</p>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
              </article>
            ))}
          </div>
        </Section>
        <Section id="contact" eyebrow="Contact" title="Connect with Hatrix" description="Follow development, request documentation, or reach out for collaboration.">
          <div className="flex flex-wrap gap-3">
            <a href="#" className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-panel px-5 py-3 font-semibold text-white transition hover:border-accent/60 hover:bg-white/5"><FiGithub /> GitHub</a>
            <a href="#" className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-panel px-5 py-3 font-semibold text-white transition hover:border-accent/60 hover:bg-white/5"><FiMail /> Email</a>
            <a href="#" className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-panel px-5 py-3 font-semibold text-white transition hover:border-accent/60 hover:bg-white/5"><FiLinkedin /> LinkedIn</a>
          </div>
        </Section>
      </main>
      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-zinc-500">
        <p className="text-zinc-300">Hatrix © 2026</p>
        <p className="mt-2">Building Cybersecurity Tools</p>
      </footer>
    </>
  );
}

export default App;
