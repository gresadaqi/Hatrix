import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiCopy, FiRefreshCw, FiShield, FiTrash2, FiX } from 'react-icons/fi';

type Props = { onClose: () => void };
const defang = (value: string) => value.replace(/https:\/\//gi, 'hxxps://').replace(/http:\/\//gi, 'hxxp://').replace(/(?<!\[)\.(?!\])/g, '[.]').replace(/(?<!\[)@(?!\])/g, '[@]');
const refang = (value: string) => value.replace(/hxxps:\/\//gi, 'https://').replace(/hxxp:\/\//gi, 'http://').replace(/\[\.\]/g, '.').replace(/\[@\]/g, '@');

export function IocDefanger({ onClose }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const key = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', key);
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', key); };
  }, [onClose]);
  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const clear = () => { setInput(''); setOutput(''); setCopied(false); };

  return (
    <motion.div className="fixed inset-0 z-[120] grid overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <motion.section role="dialog" aria-modal="true" aria-labelledby="ioc-title" className="relative m-auto w-full max-w-5xl rounded-[1.35rem] border border-accent/35 bg-panel p-6 shadow-glow sm:p-8" initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.98 }}>
        <button type="button" onClick={onClose} aria-label="Close tool" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-zinc-300 transition hover:border-accent hover:text-white"><FiX /></button>
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-xl text-accent"><FiShield /></div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-accent">Local Security Utility</p>
        <h2 id="ioc-title" className="mt-2 pr-12 text-3xl font-black text-white sm:text-4xl">IOC Defanger / Refanger</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">Safely transform indicators before sharing them, or restore defanged values for authorized analysis.</p>
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <label className="text-sm font-semibold text-zinc-200">Input<textarea value={input} onChange={(event) => setInput(event.target.value)} rows={11} placeholder={'https://example.com/login\n192.168.1.10\nuser@example.com'} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-base p-4 font-mono text-sm font-normal leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-accent" /></label>
          <label className="text-sm font-semibold text-zinc-200">Output<textarea value={output} readOnly rows={11} placeholder="Transformed indicators appear here" className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-base p-4 font-mono text-sm font-normal leading-6 text-zinc-200 outline-none placeholder:text-zinc-700 focus:border-accent" /></label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => setOutput(defang(input))} className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-red-600"><FiShield /> Defang</button>
          <button type="button" onClick={() => setOutput(refang(input))} className="inline-flex items-center gap-2 rounded-xl border border-accent/50 bg-accent/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-accent/20"><FiRefreshCw /> Refang</button>
          <button type="button" onClick={copy} disabled={!output} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-accent disabled:opacity-40">{copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied' : 'Copy'}</button>
          <button type="button" onClick={clear} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-accent"><FiTrash2 /> Clear</button>
        </div>
        <p className="mt-6 border-t border-white/10 pt-5 text-sm text-zinc-500">All processing happens locally in your browser.</p>
      </motion.section>
    </motion.div>
  );
}
