export type ToolCategory = 'Web' | 'Network' | 'OSINT' | 'Crypto' | 'Encoding' | 'Utilities';

export type ToolStatus = 'Stable' | 'Beta' | 'Planned';

export type SecurityTool = {
  name: string;
  description: string;
  category: ToolCategory;
  version: string;
  status: ToolStatus;
  githubUrl: string;
  docsUrl: string;
};

export const categories: ToolCategory[] = ['Web', 'Network', 'OSINT', 'Crypto', 'Encoding', 'Utilities'];

export const tools: SecurityTool[] = [
  {
    name: 'Password Generator',
    description: 'Generate strong passwords with configurable length, symbols, and entropy targets.',
    category: 'Utilities',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: 'https://github.com/hatrix/password-generator',
    docsUrl: '#',
  },
  {
    name: 'Hash Generator',
    description: 'Create common digest outputs for strings, files, and quick integrity checks.',
    category: 'Crypto',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: 'https://github.com/hatrix/hash-generator',
    docsUrl: '#',
  },
  {
    name: 'Port Scanner',
    description: 'Fast TCP port discovery for controlled lab and authorized assessment workflows.',
    category: 'Network',
    version: '0.9.0',
    status: 'Beta',
    githubUrl: 'https://github.com/hatrix/port-scanner',
    docsUrl: '#',
  },
  {
    name: 'Network Scanner',
    description: 'Map hosts, services, and basic exposure across permitted network ranges.',
    category: 'Network',
    version: '0.8.2',
    status: 'Beta',
    githubUrl: 'https://github.com/hatrix/network-scanner',
    docsUrl: '#',
  },
  {
    name: 'Subdomain Finder',
    description: 'Collect and normalize subdomain intelligence from public sources.',
    category: 'OSINT',
    version: '1.1.0',
    status: 'Stable',
    githubUrl: 'https://github.com/hatrix/subdomain-finder',
    docsUrl: '#',
  },
  {
    name: 'DNS Lookup',
    description: 'Resolve DNS records with clean output for triage, recon, and reporting.',
    category: 'OSINT',
    version: '1.0.1',
    status: 'Stable',
    githubUrl: 'https://github.com/hatrix/dns-lookup',
    docsUrl: '#',
  },
  {
    name: 'WHOIS Lookup',
    description: 'Query registration metadata and summarize ownership signals.',
    category: 'OSINT',
    version: '0.7.0',
    status: 'Beta',
    githubUrl: 'https://github.com/hatrix/whois-lookup',
    docsUrl: '#',
  },
  {
    name: 'JWT Decoder',
    description: 'Decode token headers and payloads without sending sensitive data to a server.',
    category: 'Web',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: 'https://github.com/hatrix/jwt-decoder',
    docsUrl: '#',
  },
  {
    name: 'Base64 Encoder',
    description: 'Encode text and payload snippets for transport, testing, and debugging.',
    category: 'Encoding',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: 'https://github.com/hatrix/base64-encoder',
    docsUrl: '#',
  },
  {
    name: 'Base64 Decoder',
    description: 'Decode Base64 strings with immediate validation and readable output.',
    category: 'Encoding',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: 'https://github.com/hatrix/base64-decoder',
    docsUrl: '#',
  },
  {
    name: 'URL Encoder',
    description: 'Encode URLs and query parameters for web testing and payload preparation.',
    category: 'Web',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: 'https://github.com/hatrix/url-encoder',
    docsUrl: '#',
  },
  {
    name: 'URL Decoder',
    description: 'Decode URL-escaped strings for log analysis and request inspection.',
    category: 'Web',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: 'https://github.com/hatrix/url-decoder',
    docsUrl: '#',
  },
  {
    name: 'AES Encryptor',
    description: 'Encrypt local text samples with AES modes for labs and learning.',
    category: 'Crypto',
    version: '0.6.0',
    status: 'Beta',
    githubUrl: 'https://github.com/hatrix/aes-encryptor',
    docsUrl: '#',
  },
  {
    name: 'AES Decryptor',
    description: 'Decrypt AES test samples with explicit key, IV, and mode controls.',
    category: 'Crypto',
    version: '0.6.0',
    status: 'Beta',
    githubUrl: 'https://github.com/hatrix/aes-decryptor',
    docsUrl: '#',
  },
  {
    name: 'SHA256 Generator',
    description: 'Create SHA-256 digests for strings and quick verification tasks.',
    category: 'Crypto',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: 'https://github.com/hatrix/sha256-generator',
    docsUrl: '#',
  },
  {
    name: 'MD5 Generator',
    description: 'Generate MD5 digests for legacy compatibility and controlled test cases.',
    category: 'Crypto',
    version: '1.0.0',
    status: 'Stable',
    githubUrl: 'https://github.com/hatrix/md5-generator',
    docsUrl: '#',
  },
];
