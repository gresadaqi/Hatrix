import {
  FiActivity,
  FiArchive,
  FiBox,
  FiCode,
  FiDatabase,
  FiFileText,
  FiGitBranch,
  FiGlobe,
  FiHardDrive,
  FiHash,
  FiKey,
  FiLayers,
  FiLock,
  FiSearch,
  FiServer,
  FiShield,
  FiTerminal,
  FiTool,
  FiZap,
} from 'react-icons/fi';
import { SiBurpsuite, SiDocker, SiGnubash, SiJavascript, SiLinux, SiPython } from 'react-icons/si';

export const githubUrl = 'https://github.com/gresadaqi/Hatrix';

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Tools', href: '#tools' },
  { label: 'Why Hatrix', href: '#why-hatrix' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Research', href: '#research' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
];

export const stats = [
  { label: 'Security Tools', value: 12, suffix: '+' },
  { label: 'Research Articles', value: 20, suffix: '+' },
  { label: 'Open Projects', value: 8, suffix: '' },
  { label: 'Privacy Focused', value: 100, suffix: '%' },
];

export const featuredTools = [
  {
    title: 'IOC Extractor',
    category: 'Utilities',
    description: 'Extract indicators from logs, notes and reports for structured SOC triage.',
    status: 'Planned',
    privacy: 'Local-first',
    icon: FiSearch,
  },
  {
    title: 'Hash Analyzer',
    category: 'Crypto',
    description: 'Identify common hash formats and prepare clean analyst notes.',
    status: 'Beta',
    privacy: 'No upload',
    icon: FiHash,
  },
  {
    title: 'Password Strength Checker',
    category: 'Utilities',
    description: 'Evaluate password quality with practical guidance and local processing.',
    status: 'Stable',
    privacy: 'Local-only',
    icon: FiKey,
  },
  {
    title: 'Encode / Decode Toolkit',
    category: 'Encoding',
    description: 'Convert payloads between common web, URL and Base64 formats.',
    status: 'Stable',
    privacy: 'Browser-only',
    icon: FiCode,
  },
  {
    title: 'Security Headers Scanner',
    category: 'Web',
    description: 'Review defensive HTTP headers and document configuration gaps.',
    status: 'Planned',
    privacy: 'Transparent',
    icon: FiGlobe,
  },
  {
    title: 'Cybersecurity Quiz',
    category: 'Education',
    description: 'Practice foundational concepts for security analysts and learners.',
    status: 'Planned',
    privacy: 'Anonymous',
    icon: FiActivity,
  },
];

export const whyHatrix = [
  {
    title: 'Privacy First',
    description: 'Supported utilities process data locally whenever possible.',
    icon: FiLock,
  },
  {
    title: 'Built for Real Workflows',
    description: 'Designed around SOC, pentest and security research tasks.',
    icon: FiTerminal,
  },
  {
    title: 'Open and Transparent',
    description: 'Clear methodology, limitations and source-code visibility.',
    icon: FiGitBranch,
  },
  {
    title: 'Ethical by Design',
    description: 'Created for defensive and authorized security use.',
    icon: FiShield,
  },
];

export const caseStudies = [
  {
    title: 'SOC Alert Enrichment Workflow',
    category: 'Blue Team Automation',
    problem: 'Analysts need quick context around indicators before deciding whether an alert needs escalation.',
    approach: 'Normalize observable data, enrich it from internal notes, and present a concise triage view.',
    technologies: ['Python', 'JSON', 'CLI'],
    outcome: 'A repeatable enrichment pattern that reduces manual lookup steps without hiding analyst judgment.',
  },
  {
    title: 'Web Security Assessment Toolkit',
    category: 'Application Security',
    problem: 'Small web assessments often require repeated checks for headers, encodings and token inspection.',
    approach: 'Group lightweight utilities into a consistent browser-based workflow with clear output states.',
    technologies: ['React', 'TypeScript', 'Security Headers'],
    outcome: 'A practical toolkit structure for authorized web testing and education.',
  },
  {
    title: 'Automated IOC Processing Pipeline',
    category: 'Threat Intelligence',
    problem: 'Unstructured notes can contain indicators that are easy to miss during time-sensitive analysis.',
    approach: 'Extract, classify and deduplicate observables while preserving the original analyst context.',
    technologies: ['Regex', 'Python', 'Markdown'],
    outcome: 'Cleaner handoff artifacts for SOC review, reports and follow-up research.',
  },
];

export const researchArticles = [
  {
    title: 'Understanding HTTP Security Headers',
    category: 'Web Security',
    summary: 'A practical overview of browser-facing headers and the defensive gaps they help reduce.',
    date: '2026-01-16',
    readingTime: '6 min read',
    tags: ['Headers', 'Web', 'Defense'],
  },
  {
    title: 'Passive vs Active Reconnaissance',
    category: 'Reconnaissance',
    summary: 'How collection methods differ, where authorization matters, and how to document scope.',
    date: '2026-02-04',
    readingTime: '7 min read',
    tags: ['OSINT', 'Recon', 'Scope'],
  },
  {
    title: 'Hashing vs Encryption',
    category: 'Cryptography',
    summary: 'A concise comparison for builders who need to choose the right primitive for a task.',
    date: '2026-02-22',
    readingTime: '5 min read',
    tags: ['Crypto', 'Hashing', 'Encryption'],
  },
  {
    title: 'Introduction to Zero Trust',
    category: 'Architecture',
    summary: 'Core ideas behind identity-aware access, least privilege and continuous verification.',
    date: '2026-03-10',
    readingTime: '8 min read',
    tags: ['Zero Trust', 'Identity', 'Architecture'],
  },
  {
    title: 'IOC Handling for SOC Analysts',
    category: 'SOC Operations',
    summary: 'A workflow for collecting, validating and communicating indicators during investigations.',
    date: '2026-03-28',
    readingTime: '6 min read',
    tags: ['SOC', 'IOC', 'Triage'],
  },
];

export const technologyStack = [
  { name: 'Python', icon: SiPython },
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'Linux', icon: SiLinux },
  { name: 'Bash', icon: SiGnubash },
  { name: 'Docker', icon: SiDocker },
  { name: 'Burp Suite', icon: SiBurpsuite },
  { name: 'Nmap', icon: FiSearch },
  { name: 'Git', icon: FiGitBranch },
];

export const commandSections = [
  { label: 'Home', href: '#home', keywords: 'hero landing hatrix', icon: FiTerminal },
  { label: 'Tools', href: '#tools', keywords: 'utilities scanners encoders crypto', icon: FiTool },
  { label: 'Case Studies', href: '#case-studies', keywords: 'projects workflows pipelines', icon: FiArchive },
  { label: 'Research', href: '#research', keywords: 'articles writeups blog', icon: FiFileText },
  { label: 'Technology Stack', href: '#stack', keywords: 'python linux docker nmap', icon: FiLayers },
  { label: 'Ethical Use', href: '#ethical-use', keywords: 'policy responsible authorized', icon: FiShield },
  { label: 'Contact', href: '#contact', keywords: 'email social connect', icon: FiServer },
];

export const footerResources = [
  { label: 'Research', href: '#research' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Technology Stack', href: '#stack' },
  { label: 'Ethical Use', href: '#ethical-use' },
];

export const platformLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Tools', href: '#tools' },
  { label: 'Why Hatrix', href: '#why-hatrix' },
  { label: 'Contact', href: '#contact' },
];

export const utilityIcons = { FiBox, FiDatabase, FiHardDrive, FiZap };
