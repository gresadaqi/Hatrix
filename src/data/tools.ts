export type ToolCategory = 'Web' | 'Network' | 'OSINT' | 'Crypto' | 'Encoding' | 'Utilities' | 'Web Security';

export type ToolStatus = 'Stable' | 'Beta' | 'Planned';

export type SecurityTool = {
  name: string;
  description: string;
  category: ToolCategory;
  version: string;
  status: ToolStatus;
  githubUrl: string;
  docsUrl: string;
  action?: 'ioc-transform' | 'security-headers';
};

export const categories: ToolCategory[] = ['Web', 'Network', 'OSINT', 'Crypto', 'Encoding', 'Utilities', 'Web Security'];

export const tools: SecurityTool[] = [
  {
    name: 'Security Header Analyzer',
    description: 'Analyze a website’s HTTP security headers and receive a score, findings, and remediation guidance.',
    category: 'Web Security',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
    action: 'security-headers',
  },
  {
    name: 'IOC Defanger / Refanger',
    description: 'Defang or restore URLs, domains, IP addresses, and email indicators entirely in your browser.',
    category: 'Utilities',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
    action: 'ioc-transform',
  },
  {
    name: 'Password Generator',
    description: 'Generate strong passwords with configurable length, symbols, and entropy targets.',
    category: 'Utilities',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'Hash Generator',
    description: 'Create common digest outputs for strings, files, and quick integrity checks.',
    category: 'Crypto',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'Port Scanner',
    description: 'Fast TCP port discovery for controlled lab and authorized assessment workflows.',
    category: 'Network',
    version: '0.9.0',
    status: 'Beta',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'Network Scanner',
    description: 'Map hosts, services, and basic exposure across permitted network ranges.',
    category: 'Network',
    version: '0.8.2',
    status: 'Beta',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'Subdomain Finder',
    description: 'Collect and normalize subdomain intelligence from public sources.',
    category: 'OSINT',
    version: '1.1.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'DNS Lookup',
    description: 'Resolve DNS records with clean output for triage, recon, and reporting.',
    category: 'OSINT',
    version: '1.0.1',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'WHOIS Lookup',
    description: 'Query registration metadata and summarize ownership signals.',
    category: 'OSINT',
    version: '0.7.0',
    status: 'Beta',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'JWT Decoder',
    description: 'Decode token headers and payloads without sending sensitive data to a server.',
    category: 'Web',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'Base64 Encoder',
    description: 'Encode text and payload snippets for transport, testing, and debugging.',
    category: 'Encoding',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'Base64 Decoder',
    description: 'Decode Base64 strings with immediate validation and readable output.',
    category: 'Encoding',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'URL Encoder',
    description: 'Encode URLs and query parameters for web testing and payload preparation.',
    category: 'Web',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'URL Decoder',
    description: 'Decode URL-escaped strings for log analysis and request inspection.',
    category: 'Web',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'AES Encryptor',
    description: 'Encrypt local text samples with AES modes for labs and learning.',
    category: 'Crypto',
    version: '0.6.0',
    status: 'Beta',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'AES Decryptor',
    description: 'Decrypt AES test samples with explicit key, IV, and mode controls.',
    category: 'Crypto',
    version: '0.6.0',
    status: 'Beta',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'SHA256 Generator',
    description: 'Create SHA-256 digests for strings and quick verification tasks.',
    category: 'Crypto',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
  },
  {
    name: 'MD5 Generator',
    description: 'Generate MD5 digests for legacy compatibility and controlled test cases.',
    category: 'Crypto',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: '#',
    docsUrl: '#',
  },
];
