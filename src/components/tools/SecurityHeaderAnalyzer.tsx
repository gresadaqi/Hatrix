import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiClipboard, FiDownload, FiPlay, FiRefreshCw, FiShield, FiTrash2, FiX } from 'react-icons/fi';
import type { SecurityAnalysis, WorkerScanResponse } from '../../types/securityHeaders';
import { analyzeSecurityHeaders, createTextReport, demoScan } from '../../utils/securityHeaders';

type Props = { onClose: () => void };
const apiUrl = import.meta.env.VITE_SECURITY_HEADER_API_URL as string | undefined;

function download(name: string, content: string, type: string) {
  const href = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(href);
}

function isPublicHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname);
  } catch { return false; }
}

export function SecurityHeaderAnalyzer({ onClose }: Props) {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<SecurityAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const report = useMemo(() => analysis ? createTextReport(analysis) : '', [analysis]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', key);
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', key); };
  }, [onClose]);

  const analyze = async () => {
    setError(''); setFeedback('');
    if (!apiUrl) { setError('Security Header API is not configured. Set VITE_SECURITY_HEADER_API_URL and rebuild the site.'); return; }
    if (!isPublicHttpUrl(url.trim())) { setError('Enter a complete public HTTP or HTTPS URL.'); return; }
    setLoading(true); setAnalysis(null);
    try {
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: url.trim() }) });
      const data = await response.json() as WorkerScanResponse;
      if (!response.ok || data.error) throw new Error(data.error || `Analyzer API returned HTTP ${response.status}.`);
      setAnalysis(analyzeSecurityHeaders(url.trim(), data));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The analysis request failed.');
    } finally { setLoading(false); }
  };

  const copy = async (text: string, message: string) => {
    await navigator.clipboard.writeText(text);
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2000);
  };

  const loadDemo = () => {
    setUrl('https://demo.example/'); setError(''); setFeedback('');
    setAnalysis(analyzeSecurityHeaders('https://demo.example/', demoScan, true));
  };
  const clear = () => { setUrl(''); setAnalysis(null); setError(''); setFeedback(''); };

  return (
    <motion.div className="fixed inset-0 z-[120] overflow-y-auto bg-black/85 p-4 backdrop-blur-sm sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <motion.section role="dialog" aria-modal="true" aria-labelledby="header-analyzer-title" className="relative mx-auto max-w-6xl rounded-[1.35rem] border border-accent/35 bg-panel p-5 shadow-glow sm:p-8" initial={{ y: 20, scale: 0.99 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.99 }}>
        <button type="button" onClick={onClose} aria-label="Close tool" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-zinc-300 transition hover:border-accent hover:text-white"><FiX /></button>
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-xl text-accent"><FiShield /></div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-accent">Web Security Assessment</p>
        <h2 id="header-analyzer-title" className="mt-2 pr-12 text-3xl font-black text-white sm:text-4xl">Security Header Analyzer</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">Analyze browser security controls returned by a public website and receive transparent scoring and remediation guidance.</p>
        <p className="mt-3 text-sm font-semibold text-amber-300">Only scan websites you own or are authorized to assess.</p>

        <div className="mt-7 rounded-2xl border border-white/10 bg-base p-4">
          <label className="text-sm font-semibold text-zinc-200">Public website URL
            <input type="url" value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && void analyze()} placeholder="https://example.com" className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-panel px-4 font-mono text-sm text-white outline-none placeholder:text-zinc-700 focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" disabled={loading} onClick={() => void analyze()} className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-red-600 disabled:opacity-50">{loading ? <FiRefreshCw className="animate-spin" /> : <FiPlay />} {loading ? 'Analyzing…' : 'Analyze'}</button>
            <button type="button" disabled={loading} onClick={clear} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 hover:border-accent"><FiTrash2 /> Clear</button>
            <button type="button" disabled={loading} onClick={loadDemo} className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-semibold text-white hover:bg-accent/20"><FiShield /> Load Demo</button>
          </div>
          {!apiUrl && <p className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-200">Live analysis is not configured. Set <code>VITE_SECURITY_HEADER_API_URL</code>; demo mode remains available.</p>}
          {error && <p role="alert" className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-3 text-sm text-red-200">{error}</p>}
          {feedback && <p aria-live="polite" className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-400"><FiCheck /> {feedback}</p>}
        </div>

        {analysis && (
          <div className="mt-7 space-y-6">
            {analysis.demo && <div className="rounded-xl border border-sky-400/30 bg-sky-400/10 p-3 text-sm font-semibold text-sky-200">Demo analysis — sample data only; no API request was made.</div>}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5"><p className="text-xs uppercase tracking-widest text-zinc-400">Score</p><p className="mt-2 text-4xl font-black text-white">{analysis.score}<span className="text-lg text-zinc-500">/100</span></p><p className="mt-1 font-bold text-accent">Grade {analysis.grade}</p></div>
              <div className="rounded-2xl border border-white/10 bg-base p-5"><p className="text-xs uppercase tracking-widest text-zinc-500">HTTP status</p><p className="mt-2 text-2xl font-bold text-white">{analysis.httpStatus}</p><p className="mt-1 text-sm text-zinc-400">HTTPS: {analysis.https ? 'Yes' : 'No'}</p></div>
              <div className="rounded-2xl border border-white/10 bg-base p-5"><p className="text-xs uppercase tracking-widest text-zinc-500">Network</p><p className="mt-2 text-lg font-bold text-white">{analysis.responseTime} ms</p><p className="mt-1 text-sm text-zinc-400">{analysis.redirectCount} redirects</p></div>
              <div className="rounded-2xl border border-white/10 bg-base p-5"><p className="text-xs uppercase tracking-widest text-zinc-500">Analyzed</p><p className="mt-2 text-sm font-bold text-white">{new Date(analysis.timestamp).toLocaleString()}</p></div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-base p-5 text-sm"><p className="text-zinc-500">Final URL after redirects</p><p className="mt-2 break-all font-mono text-zinc-200">{analysis.finalUrl}</p><p className="mt-4 leading-6 text-zinc-300">{analysis.summary}</p></div>

            <div>
              <h3 className="text-2xl font-black text-white">Header findings</h3>
              <div className="mt-4 grid gap-4">
                {analysis.findings.map((item) => (
                  <article key={item.name} className="rounded-2xl border border-white/10 bg-base p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3"><h4 className="font-bold text-white">{item.name}</h4><div className="flex gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.status === 'Present' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-accent/10 text-red-300'}`}>{item.status}</span><span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-300">{item.risk} risk</span><span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-300">{item.maxScore ? `${item.score}/${item.maxScore}` : 'Informational'}</span></div></div>
                    <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-all rounded-xl border border-white/10 bg-panel p-3 text-xs text-zinc-300">{item.value}</pre>
                    <p className="mt-4 text-sm leading-6 text-zinc-400"><span className="font-semibold text-zinc-200">Why it matters:</span> {item.why}</p>
                    {item.weaknesses.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-300">{item.weaknesses.map((weakness) => <li key={weakness}>{weakness}</li>)}</ul>}
                    <p className="mt-3 text-sm leading-6 text-zinc-400"><span className="font-semibold text-zinc-200">Recommended:</span> {item.recommendation}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-base p-5"><h3 className="text-xl font-bold text-white">Score calculation</h3><div className="mt-4 grid gap-2 sm:grid-cols-2">{analysis.scoreExplanation.map((line) => <p key={line} className="rounded-lg bg-panel px-3 py-2 text-sm text-zinc-300">{line}</p>)}</div></div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => void copy(report, 'Report copied.')} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white"><FiClipboard /> Copy Report</button>
              <button type="button" onClick={() => download('hatrix-security-header-report.txt', report, 'text/plain')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:border-accent"><FiDownload /> Download Report as TXT</button>
              <button type="button" onClick={() => download('hatrix-security-header-findings.json', JSON.stringify(analysis, null, 2), 'application/json')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:border-accent"><FiDownload /> Download Findings as JSON</button>
              <button type="button" onClick={() => void copy(analysis.missingHeaders.join('\n') || 'No missing headers detected.', 'Missing headers copied.')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:border-accent"><FiClipboard /> Copy Missing Headers</button>
            </div>
            <p className="border-t border-white/10 pt-5 text-xs leading-5 text-zinc-500">This focused header assessment is not a complete security audit. The analyzer does not crawl, scan ports, fetch linked resources, or execute target JavaScript.</p>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
