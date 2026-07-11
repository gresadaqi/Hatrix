import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { FiArrowLeft, FiBell, FiCheckCircle, FiClock, FiDownload, FiEye, FiRefreshCcw, FiVolume2, FiVolumeX, FiX } from 'react-icons/fi';
import { Logo } from './Logo';
import { missions, type EvidenceItem, type Mission, type MissionAlert, type Severity } from '../data/missions';

type MissionControlProps = {
  onExit: () => void;
};

type MissionProgress = {
  completed: string[];
  bestScores: Record<string, number>;
  ranks: Record<string, string>;
  fastestTimes: Record<string, number>;
  evidencePercent: Record<string, number>;
  lastPlayed?: string;
};

type ScoreState = {
  evidence: number;
  response: number;
  containment: number;
  penalties: number;
};

const progressKey = 'hatrix-mission-progress';
const actions = [
  'Investigate Source IP',
  'Review Authentication Logs',
  'Inspect User Account',
  'Inspect Endpoint',
  'Analyze File Hash',
  'Review Network Activity',
  'Disable User Account',
  'Block Source IP',
  'Isolate Endpoint',
  'Contain Incident',
];

const severityClass: Record<Severity, string> = {
  Critical: 'border-accent/60 bg-accent/10 text-red-100',
  High: 'border-orange-400/30 bg-orange-400/10 text-orange-100',
  Medium: 'border-yellow-400/25 bg-yellow-400/10 text-yellow-100',
  Low: 'border-zinc-500/25 bg-zinc-500/10 text-zinc-200',
};

function loadProgress(): MissionProgress {
  try {
    return JSON.parse(localStorage.getItem(progressKey) || '{"completed":[],"bestScores":{},"ranks":{},"fastestTimes":{},"evidencePercent":{}}');
  } catch {
    return { completed: [], bestScores: {}, ranks: {}, fastestTimes: {}, evidencePercent: {} };
  }
}

function rankFor(score: number) {
  if (score >= 92) return 'Threat Hunter';
  if (score >= 82) return 'Incident Responder';
  if (score >= 68) return 'SOC Analyst';
  if (score >= 48) return 'Junior Analyst';
  return 'Trainee';
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function MissionPanel({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-panel/95 p-4 shadow-card ${className}`}>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-zinc-300">{title}</h2>
      {children}
    </section>
  );
}

function ThreatMap({ mission }: { mission: Mission }) {
  const [zoom, setZoom] = useState(1);

  return (
    <MissionPanel title="Simulated Threat Activity" className="lg:col-span-2">
      <div className="relative h-72 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d]">
        <div className="absolute inset-0 origin-center transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:28px_28px]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" aria-hidden="true">
            <path d="M8 21 C20 12 31 17 42 12 C52 8 62 12 73 17 C84 22 91 30 92 40 C80 44 70 42 61 48 C50 55 38 49 29 44 C18 39 9 35 8 21Z" fill="#171717" stroke="rgba(255,255,255,.12)" />
            <path className="map-line" d={`M${mission.map.source.x} ${mission.map.source.y} C45 18 56 18 ${mission.map.target.x} ${mission.map.target.y}`} fill="none" stroke="#E50914" strokeWidth="0.45" strokeDasharray="2 2" />
            <circle cx={mission.map.source.x} cy={mission.map.source.y} r="1.8" fill="#E50914" />
            <circle cx={mission.map.target.x} cy={mission.map.target.y} r="2.2" fill="#fff" />
            <circle cx={mission.map.target.x} cy={mission.map.target.y} r="5" fill="none" stroke="rgba(229,9,20,.42)" />
          </svg>
          <span className="absolute rounded bg-base/80 px-2 py-1 text-xs text-zinc-300" style={{ left: `${mission.map.source.x}%`, top: `${mission.map.source.y + 5}%` }}>{mission.map.source.label}</span>
          <span className="absolute rounded bg-base/80 px-2 py-1 text-xs text-zinc-300" style={{ left: `${mission.map.target.x - 5}%`, top: `${mission.map.target.y + 7}%` }}>{mission.map.target.label}</span>
        </div>
        <div className="absolute right-3 top-3 grid gap-2">
          <button className="h-8 w-8 rounded-lg border border-white/10 bg-base text-zinc-300" type="button" onClick={() => setZoom((value) => Math.min(1.35, value + 0.12))} aria-label="Zoom in simulated map">+</button>
          <button className="h-8 w-8 rounded-lg border border-white/10 bg-base text-zinc-300" type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.12))} aria-label="Zoom out simulated map">-</button>
        </div>
      </div>
    </MissionPanel>
  );
}

export function MissionControl({ onExit }: MissionControlProps) {
  const [missionIndex, setMissionIndex] = useState(0);
  const mission = missions[missionIndex];
  const [selectedAlert, setSelectedAlert] = useState(mission.alerts[0].id);
  const [collected, setCollected] = useState<string[]>([]);
  const [timeline, setTimeline] = useState(mission.timeline);
  const [terminal, setTerminal] = useState<string[]>(['Hatrix analyst console. Type help for safe simulated commands.']);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [intel, setIntel] = useState<{ title: string; rows: string[] } | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState<ScoreState>({ evidence: 0, response: 40, containment: 0, penalties: 0 });
  const [contained, setContained] = useState(false);
  const [sound, setSound] = useState(() => localStorage.getItem('hatrix-sound') === 'on');
  const [statusMessage, setStatusMessage] = useState('Mission Control loaded. All information is simulated.');
  const terminalRef = useRef<HTMLInputElement>(null);

  const evidence = mission.evidence.filter((item) => collected.includes(item.id));
  const totalScore = Math.max(0, Math.min(100, score.evidence + score.response + score.containment - score.penalties));
  const rank = rankFor(totalScore);
  const selected = mission.alerts.find((alert) => alert.id === selectedAlert) ?? mission.alerts[0];
  const progress = Math.round((collected.length / mission.evidence.length) * 100);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('hatrix-sound', sound ? 'on' : 'off');
  }, [sound]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIntel(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (contained || collected.length > 0 || seconds !== 45) return;
    setScore((current) => ({ ...current, penalties: current.penalties + 5 }));
    setTimeline((items) => [...items, { time: formatTime(seconds), text: 'Critical alert remained uninvestigated; simulated incident risk increased.' }]);
  }, [collected.length, contained, seconds]);

  const playCue = () => {
    if (!sound) return;
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 620;
    gain.gain.value = 0.025;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.05);
  };

  const resetMission = (index = missionIndex) => {
    const next = missions[index];
    setMissionIndex(index);
    setSelectedAlert(next.alerts[0].id);
    setCollected([]);
    setTimeline(next.timeline);
    setTerminal(['Hatrix analyst console. Type help for safe simulated commands.']);
    setCommand('');
    setHistory([]);
    setHistoryIndex(-1);
    setIntel(null);
    setSummaryOpen(false);
    setSeconds(0);
    setScore({ evidence: 0, response: 40, containment: 0, penalties: 0 });
    setContained(false);
    setStatusMessage(`${next.title} loaded. All activity is simulated.`);
  };

  const addTimeline = (text: string) => setTimeline((items) => [...items, { time: formatTime(seconds), text }]);
  const collectEvidence = (ids: string[]) => {
    const newlyCollected = mission.evidence.filter((item) => ids.includes(item.id) && !collected.includes(item.id));
    if (!newlyCollected.length) return;
    setCollected((items) => [...items, ...newlyCollected.map((item) => item.id)]);
    setScore((current) => ({ ...current, evidence: Math.min(35, current.evidence + newlyCollected.length * 7) }));
    addTimeline(`Evidence collected: ${newlyCollected.map((item) => item.name).join(', ')}.`);
    setStatusMessage('Evidence collected.');
  };

  const performAction = (action: string) => {
    const reveal = mission.evidence.filter((item) => item.reveals.includes(action)).map((item) => item.id);
    if (action === 'Contain Incident') {
      if (collected.length < Math.ceil(mission.evidence.length * 0.55)) {
        setScore((current) => ({ ...current, penalties: current.penalties + 10 }));
        setStatusMessage('Warning: attempted containment without enough evidence.');
        addTimeline('Containment attempted before evidence threshold was met.');
        playCue();
        return;
      }
      setContained(true);
      setScore((current) => ({ ...current, containment: Math.min(25, current.containment + 18) }));
      addTimeline('Incident contained after analyst action.');
      setSummaryOpen(true);
      saveProgress();
      playCue();
      return;
    }
    if (['Disable User Account', 'Block Source IP', 'Isolate Endpoint'].includes(action)) {
      if (collected.length < 2) setScore((current) => ({ ...current, penalties: current.penalties + 6 }));
      else setScore((current) => ({ ...current, containment: Math.min(25, current.containment + 6) }));
    }
    collectEvidence(reveal);
    if (action === 'Investigate Source IP') setIntel({ title: 'Simulated IP Intelligence', rows: mission.intel.ip });
    if (action === 'Inspect User Account') setIntel({ title: 'Simulated User Intelligence', rows: mission.intel.user });
    if (action === 'Inspect Endpoint') setIntel({ title: 'Simulated Host Intelligence', rows: mission.intel.host });
    if (action === 'Analyze File Hash') setIntel({ title: 'Simulated Hash Intelligence', rows: mission.intel.hash });
    setStatusMessage(`${action} completed.`);
    playCue();
  };

  const saveProgress = () => {
    const stored = loadProgress();
    const next: MissionProgress = {
      completed: Array.from(new Set([...stored.completed, mission.id])),
      bestScores: { ...stored.bestScores, [mission.id]: Math.max(stored.bestScores[mission.id] || 0, totalScore) },
      ranks: { ...stored.ranks, [mission.id]: rank },
      fastestTimes: { ...stored.fastestTimes, [mission.id]: Math.min(stored.fastestTimes[mission.id] || seconds, seconds) },
      evidencePercent: { ...stored.evidencePercent, [mission.id]: progress },
      lastPlayed: mission.id,
    };
    localStorage.setItem(progressKey, JSON.stringify(next));
  };

  const terminalResponse = (raw: string) => {
    const input = raw.trim().slice(0, 96).toLowerCase().replace(/\s+/g, ' ');
    if (!input) return;
    setHistory((items) => [...items, raw.trim().slice(0, 96)]);
    setHistoryIndex(-1);
    const push = (lines: string[]) => setTerminal((items) => [...items, `> ${raw.trim().slice(0, 96)}`, ...lines]);
    if (input === 'clear') {
      setTerminal([]);
      return;
    }
    if (input === 'exit') {
      onExit();
      return;
    }
    if (input === 'help') push(['Commands: help, show incident, show alerts, show timeline, show evidence, investigate ip <ip>, investigate user <user>, inspect host <host>, inspect hash <hash>, contain incident, clear, exit']);
    else if (input === 'show incident') push([`${mission.incidentId}: ${mission.title}`, mission.description]);
    else if (input === 'show alerts') push(mission.alerts.map((alert) => `${alert.timestamp} ${alert.severity} ${alert.title} (${alert.asset})`));
    else if (input === 'show timeline') push(timeline.map((item) => `${item.time} ${item.text}`));
    else if (input === 'show evidence') push(evidence.length ? evidence.map((item) => `${item.name}: ${item.description}`) : ['No evidence collected yet.']);
    else if (input.startsWith('investigate ip')) {
      performAction('Investigate Source IP');
      push(mission.intel.ip);
    } else if (input.startsWith('investigate user')) {
      performAction('Inspect User Account');
      push(mission.intel.user);
    } else if (input.startsWith('inspect host')) {
      performAction('Inspect Endpoint');
      push(mission.intel.host);
    } else if (input.startsWith('inspect hash')) {
      performAction('Analyze File Hash');
      push(mission.intel.hash);
    } else if (input === 'contain incident') {
      performAction('Contain Incident');
      push(['Containment command processed. Review mission status.']);
    } else push(['Unsupported simulated command. Type help for available commands.']);
  };

  const onTerminalKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      terminalResponse(command);
      setCommand('');
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setCommand(history[next] || '');
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = Math.min(history.length, historyIndex + 1);
      setHistoryIndex(next);
      setCommand(history[next] || '');
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const options = ['help', 'show incident', 'show alerts', 'show timeline', 'show evidence', `investigate ip ${mission.sourceIp}`, `investigate user ${mission.affectedUser}`, `inspect host ${mission.affectedHost}`, `inspect hash ${mission.suspiciousHash}`, 'contain incident', 'clear', 'exit'];
      const match = options.find((item) => item.startsWith(command.toLowerCase()));
      if (match) setCommand(match);
    }
  };

  const downloadReport = () => {
    const report = {
      mission: mission.title,
      outcome: contained ? 'Contained' : 'Incomplete',
      finalScore: totalScore,
      analystRank: rank,
      responseTime: formatTime(seconds),
      evidenceCollected: evidence.map((item) => item.name),
      missedEvidence: mission.evidence.filter((item) => !collected.includes(item.id)).map((item) => item.name),
      incidentImpact: contained ? 'Impact limited in simulation.' : 'Incident remains active in simulation.',
      recommendedNextSteps: ['Reset credentials', 'Review conditional access policy', 'Document lessons learned'],
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mission.id}-incident-report.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-base text-white" aria-label="Hatrix Mission Control">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-base/90 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
          <Logo />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-xl border border-white/10 bg-panel px-3 py-2"><FiClock className="mr-2 inline text-accent" />{formatTime(seconds)}</span>
            <span className="rounded-xl border border-white/10 bg-panel px-3 py-2">Score {totalScore}</span>
            <span className="rounded-xl border border-white/10 bg-panel px-3 py-2">{contained ? 'Contained' : mission.status}</span>
            <button type="button" onClick={() => setSound((value) => !value)} className="rounded-xl border border-white/10 bg-panel px-3 py-2" aria-label="Toggle optional sound">{sound ? <FiVolume2 /> : <FiVolumeX />}</button>
            <button type="button" onClick={onExit} className="rounded-xl border border-accent/50 px-4 py-2 font-semibold text-white"><FiArrowLeft className="mr-2 inline" />Exit Mission Control</button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-4 p-4 xl:grid-cols-[1.25fr_.85fr_.9fr]">
        <ThreatMap mission={mission} />

        <MissionPanel title="Alert Queue">
          <div className="grid gap-3">
            {mission.alerts.map((alert: MissionAlert) => (
              <button key={alert.id} type="button" onClick={() => setSelectedAlert(alert.id)} className={`rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${selectedAlert === alert.id ? 'border-accent/60 bg-accent/10' : 'border-white/10 bg-base/70'}`}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${severityClass[alert.severity]}`}>{alert.severity}</span>
                  <span className="text-xs text-zinc-500">{alert.timestamp}</span>
                </div>
                <p className="font-semibold text-white">{alert.title}</p>
                <p className="mt-1 text-xs text-zinc-400">{alert.asset} / {alert.status} / {alert.confidence}% confidence</p>
              </button>
            ))}
          </div>
        </MissionPanel>

        <MissionPanel title="Incident Overview">
          <div className="space-y-3 text-sm text-zinc-300">
            <p className="text-lg font-bold text-white">{mission.title}</p>
            <p className="leading-6 text-zinc-400">{mission.description}</p>
            {[
              ['Incident ID', mission.incidentId],
              ['Severity', mission.severity],
              ['Risk Score', `${mission.riskScore}`],
              ['Affected User', mission.affectedUser],
              ['Affected Host', mission.affectedHost],
              ['Source IP', mission.sourceIp],
              ['First Seen', mission.firstSeen],
              ['Current Status', contained ? 'Contained' : mission.status],
            ].map(([label, value]) => <p key={label} className="flex justify-between gap-4 border-b border-white/10 pb-2"><span className="text-zinc-500">{label}</span><span>{value}</span></p>)}
            <div className="flex flex-wrap gap-2 pt-2">{mission.mitre.map((tech) => <span key={tech} className="rounded-full border border-white/10 px-2.5 py-1 text-xs">{tech}</span>)}</div>
            <div className="pt-2">
              <div className="mb-2 flex justify-between text-xs"><span>Investigation progress</span><span>{progress}%</span></div>
              <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-accent" style={{ width: `${progress}%` }} /></div>
            </div>
          </div>
        </MissionPanel>

        <MissionPanel title="Incident Timeline">
          <div className="max-h-80 space-y-3 overflow-y-auto">
            {timeline.map((item, index) => (
              <div key={`${item.time}-${index}`} className="border-l border-accent/35 pl-3">
                <p className="font-mono text-xs text-accent">{item.time}</p>
                <p className="text-sm leading-6 text-zinc-300">{item.text}</p>
              </div>
            ))}
          </div>
        </MissionPanel>

        <MissionPanel title="Evidence Locker">
          <div className="grid gap-3">
            {mission.evidence.map((item: EvidenceItem) => {
              const isCollected = collected.includes(item.id);
              return (
                <div key={item.id} className={`rounded-xl border p-3 ${isCollected ? 'border-accent/35 bg-accent/10' : 'border-white/10 bg-base/60'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-white">{item.name}</p>
                    <span className="text-xs text-zinc-400">{isCollected ? 'Collected' : 'Missing'}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{item.type} / {item.confidence}% confidence</p>
                  {isCollected && <p className="mt-2 text-sm leading-6 text-zinc-300">{item.description}</p>}
                  <button type="button" disabled={!isCollected} onClick={() => setIntel({ title: item.name, rows: [item.description, `Type: ${item.type}`, `Confidence: ${item.confidence}%`] })} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><FiEye /> View Details</button>
                </div>
              );
            })}
          </div>
        </MissionPanel>

        <MissionPanel title="Investigation Actions">
          <div className="grid gap-2 sm:grid-cols-2">
            {actions.map((action) => (
              <button key={action} type="button" onClick={() => performAction(action)} className="rounded-xl border border-white/10 bg-base px-3 py-3 text-left text-sm font-semibold text-zinc-200 transition hover:border-accent/50 hover:bg-accent/10">
                {action}
              </button>
            ))}
          </div>
        </MissionPanel>

        <MissionPanel title="Analyst Terminal" className="xl:col-span-2">
          <div className="h-72 overflow-y-auto rounded-xl border border-white/10 bg-black p-4 font-mono text-xs leading-6 text-zinc-300" onClick={() => terminalRef.current?.focus()}>
            {terminal.map((line, index) => <p key={`${line}-${index}`} className={line.startsWith('>') ? 'text-accent' : ''}>{line}</p>)}
            <label className="mt-2 flex items-center gap-2">
              <span className="text-accent">$</span>
              <input ref={terminalRef} value={command} onChange={(event) => setCommand(event.target.value.slice(0, 96))} onKeyDown={onTerminalKey} className="flex-1 bg-transparent outline-none" aria-label="Analyst terminal command input" autoComplete="off" />
              <span className="h-4 w-2 animate-pulse bg-accent" />
            </label>
          </div>
        </MissionPanel>

        <MissionPanel title="Analyst Score">
          <div className="space-y-3">
            <p className="text-5xl font-black text-accent">{totalScore}</p>
            <p className="font-semibold text-white">{rank}</p>
            {[
              ['Evidence score', score.evidence],
              ['Response score', score.response],
              ['Containment score', score.containment],
              ['Penalties', score.penalties],
            ].map(([label, value]) => <p key={label} className="flex justify-between border-b border-white/10 pb-2 text-sm text-zinc-300"><span>{label}</span><span>{value}</span></p>)}
          </div>
        </MissionPanel>

        <MissionPanel title="Mission Summary" className="xl:col-span-3">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="text-sm leading-7 text-zinc-300">
              <p><FiBell className="mr-2 inline text-accent" />{statusMessage}</p>
              <p>Selected alert: <span className="text-white">{selected.title}</span> ({selected.severity}) affecting {selected.asset}.</p>
              <p>Mission outcome: <span className="text-white">{contained ? 'Contained' : 'In progress'}</span>. Evidence collected: {collected.length}/{mission.evidence.length}.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => resetMission()} className="rounded-xl border border-white/10 px-4 py-3 font-semibold"><FiRefreshCcw className="mr-2 inline" />Restart Mission</button>
              <button type="button" onClick={() => resetMission((missionIndex + 1) % missions.length)} className="rounded-xl border border-white/10 px-4 py-3 font-semibold">Try Another Scenario</button>
              <button type="button" onClick={downloadReport} className="rounded-xl border border-accent/50 px-4 py-3 font-semibold"><FiDownload className="mr-2 inline" />Download Incident Report</button>
              <button type="button" onClick={onExit} className="rounded-xl bg-accent px-4 py-3 font-semibold">Return to Hatrix</button>
            </div>
          </div>
        </MissionPanel>
      </div>

      {intel && (
        <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-white/10 bg-base p-5 shadow-card" role="dialog" aria-modal="true" aria-label={intel.title}>
          <button type="button" onClick={() => setIntel(null)} className="mb-6 rounded-xl border border-white/10 p-2" aria-label="Close intelligence panel"><FiX /></button>
          <h2 className="text-2xl font-bold text-white">{intel.title}</h2>
          <p className="mt-2 text-sm text-zinc-500">Simulated intelligence only.</p>
          <div className="mt-6 grid gap-3">{intel.rows.map((row) => <p key={row} className="rounded-xl border border-white/10 bg-panel p-3 text-sm text-zinc-300">{row}</p>)}</div>
        </aside>
      )}

      {summaryOpen && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/75 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label="Mission report">
          <div className="max-w-2xl rounded-2xl border border-white/10 bg-panel p-6 shadow-card">
            <FiCheckCircle className="mb-4 text-3xl text-accent" />
            <h2 className="text-3xl font-bold text-white">Mission Report</h2>
            <p className="mt-3 text-zinc-300">Outcome: {contained ? 'Incident contained' : 'Mission incomplete'} / Score {totalScore} / Rank {rank} / Response time {formatTime(seconds)}</p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">Collected evidence: {evidence.map((item) => item.name).join(', ') || 'none'}.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" onClick={() => resetMission()} className="rounded-xl border border-white/10 px-4 py-3 font-semibold"><FiRefreshCcw className="mr-2 inline" />Restart Mission</button>
              <button type="button" onClick={() => resetMission((missionIndex + 1) % missions.length)} className="rounded-xl border border-white/10 px-4 py-3 font-semibold">Try Another Scenario</button>
              <button type="button" onClick={downloadReport} className="rounded-xl border border-accent/50 px-4 py-3 font-semibold"><FiDownload className="mr-2 inline" />Download Incident Report</button>
              <button type="button" onClick={onExit} className="rounded-xl bg-accent px-4 py-3 font-semibold">Return to Hatrix</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
