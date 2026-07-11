export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type MissionAlert = {
  id: string;
  severity: Severity;
  title: string;
  timestamp: string;
  asset: string;
  status: 'New' | 'Investigating' | 'Reviewed';
  confidence: number;
};

export type EvidenceItem = {
  id: string;
  name: string;
  type: string;
  confidence: number;
  description: string;
  reveals: string[];
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  incidentId: string;
  riskScore: number;
  affectedUser: string;
  affectedHost: string;
  sourceIp: string;
  suspiciousHash: string;
  firstSeen: string;
  status: string;
  mitre: string[];
  map: {
    source: { x: number; y: number; label: string };
    target: { x: number; y: number; label: string };
  };
  alerts: MissionAlert[];
  timeline: { time: string; text: string }[];
  evidence: EvidenceItem[];
  intel: {
    ip: string[];
    user: string[];
    host: string[];
    hash: string[];
  };
};

export const missions: Mission[] = [
  {
    id: 'finance-admin',
    title: 'Compromised Finance Administrator Account',
    description:
      'Multiple failed login attempts were followed by a successful authentication from an unusual location. The account then accessed sensitive finance data.',
    severity: 'Critical',
    incidentId: 'HMX-2026-001',
    riskScore: 92,
    affectedUser: 'fin.admin',
    affectedHost: 'FIN-WKS-014',
    sourceIp: '203.0.113.42',
    suspiciousHash: '9f2a6c4b1d90e8a7f63c2b51a0d5e442',
    firstSeen: '21:04',
    status: 'Active investigation',
    mitre: ['T1110 Brute Force', 'T1078 Valid Accounts', 'T1087 Account Discovery'],
    map: { source: { x: 26, y: 35, label: 'Unusual source' }, target: { x: 59, y: 42, label: 'Finance host' } },
    alerts: [
      { id: 'a1', severity: 'Critical', title: 'Impossible Travel', timestamp: '21:06', asset: 'fin.admin', status: 'New', confidence: 94 },
      { id: 'a2', severity: 'High', title: 'Brute Force Attempt', timestamp: '21:04', asset: 'fin.admin', status: 'New', confidence: 91 },
      { id: 'a3', severity: 'High', title: 'Sensitive File Download', timestamp: '21:11', asset: 'FIN-WKS-014', status: 'New', confidence: 87 },
      { id: 'a4', severity: 'Medium', title: 'Unusual Outbound Connection', timestamp: '21:14', asset: 'FIN-WKS-014', status: 'New', confidence: 76 },
    ],
    timeline: [
      { time: '21:04', text: 'Multiple failed authentication attempts detected.' },
      { time: '21:06', text: 'Successful login from unusual location.' },
      { time: '21:08', text: 'Privilege escalation attempt observed.' },
      { time: '21:11', text: 'Sensitive finance document accessed.' },
      { time: '21:14', text: 'Outbound connection to suspicious destination.' },
    ],
    evidence: [
      { id: 'ip', name: 'Source IP', type: 'Network', confidence: 90, description: 'Login source associated with anonymized proxy infrastructure.', reveals: ['Investigate Source IP', 'Block Source IP'] },
      { id: 'auth', name: 'Authentication logs', type: 'Identity', confidence: 94, description: 'Shows repeated failures followed by valid sign-in from unusual geography.', reveals: ['Review Authentication Logs'] },
      { id: 'user', name: 'User account', type: 'Identity', confidence: 88, description: 'Privileged finance account with anomalous access pattern.', reveals: ['Inspect User Account', 'Disable User Account'] },
      { id: 'host', name: 'Device information', type: 'Endpoint', confidence: 82, description: 'Finance workstation recorded unusual process and network behavior.', reveals: ['Inspect Endpoint', 'Isolate Endpoint'] },
      { id: 'network', name: 'Outbound destination', type: 'Network', confidence: 78, description: 'Connection to suspicious external destination after document access.', reveals: ['Review Network Activity'] },
    ],
    intel: {
      ip: ['Reputation: suspicious', 'Simulated geolocation: Eastern Europe', 'ASN: AS64512 training network', 'Proxy/VPN: likely proxy', 'Confidence: 90%', 'First seen: 21:04', 'Last seen: 21:14'],
      user: ['Recent sign-ins: 1 unusual success after 18 failures', 'Locations: normal office, unusual remote source', 'Devices: FIN-WKS-014', 'Privilege: Finance administrator', 'Risk state: compromised likely'],
      host: ['Host: FIN-WKS-014', 'Suspicious process: powershell.exe child process', 'Outbound activity observed', 'Containment recommended after evidence collection'],
      hash: ['Hash type: MD5 sample', 'Malware family: simulated credential stealer', 'Reputation: malicious in training corpus', 'Detection confidence: 86%'],
    },
  },
  {
    id: 'powershell-endpoint',
    title: 'Suspicious PowerShell and Endpoint Activity',
    description: 'Endpoint telemetry indicates encoded PowerShell execution, suspicious process ancestry and outbound beacon-like traffic.',
    severity: 'High',
    incidentId: 'HMX-2026-002',
    riskScore: 84,
    affectedUser: 'ops.user',
    affectedHost: 'OPS-LT-022',
    sourceIp: '198.51.100.77',
    suspiciousHash: '4d7f9c31a2e8b6d0c11f72aa9980b61e',
    firstSeen: '10:18',
    status: 'Endpoint triage',
    mitre: ['T1059 PowerShell', 'T1105 Ingress Tool Transfer', 'T1027 Obfuscated Files'],
    map: { source: { x: 72, y: 48, label: 'Remote command host' }, target: { x: 50, y: 42, label: 'Ops endpoint' } },
    alerts: [
      { id: 'b1', severity: 'High', title: 'Suspicious PowerShell Execution', timestamp: '10:18', asset: 'OPS-LT-022', status: 'New', confidence: 93 },
      { id: 'b2', severity: 'High', title: 'Unusual Outbound Connection', timestamp: '10:20', asset: 'OPS-LT-022', status: 'New', confidence: 82 },
      { id: 'b3', severity: 'Medium', title: 'Sensitive File Download', timestamp: '10:22', asset: 'ops.user', status: 'New', confidence: 71 },
    ],
    timeline: [
      { time: '10:18', text: 'Encoded PowerShell command observed.' },
      { time: '10:19', text: 'Suspicious child process spawned from script host.' },
      { time: '10:20', text: 'Outbound connection to untrusted destination.' },
      { time: '10:22', text: 'Archive file created in user profile.' },
    ],
    evidence: [
      { id: 'host', name: 'Process tree', type: 'Endpoint', confidence: 95, description: 'PowerShell launched from script host with encoded command arguments.', reveals: ['Inspect Endpoint', 'Isolate Endpoint'] },
      { id: 'hash', name: 'Malicious file hash', type: 'File', confidence: 89, description: 'Downloaded payload hash matches simulated malicious classification.', reveals: ['Analyze File Hash'] },
      { id: 'network', name: 'Outbound destination', type: 'Network', confidence: 81, description: 'Beacon-like outbound traffic from endpoint.', reveals: ['Review Network Activity', 'Block Source IP'] },
      { id: 'user', name: 'User account', type: 'Identity', confidence: 68, description: 'User context used to execute suspicious script.', reveals: ['Inspect User Account'] },
    ],
    intel: {
      ip: ['Reputation: suspicious infrastructure', 'Simulated geolocation: North America', 'ASN: AS64496 lab provider', 'Proxy/VPN: no', 'Associated activity: beacon simulation'],
      user: ['Recent sign-ins: normal', 'Failed attempts: none', 'Privilege: standard user', 'Risk state: endpoint-led compromise suspected'],
      host: ['Host: OPS-LT-022', 'Process chain: wscript.exe -> powershell.exe', 'Command line: encoded command observed', 'Isolation recommended after process-tree review'],
      hash: ['Hash type: MD5 sample', 'Malware family: simulated downloader', 'Reputation: malicious', 'Detection confidence: 89%'],
    },
  },
  {
    id: 'phishing-credential',
    title: 'Phishing Email Leading to Credential Theft',
    description: 'A user submitted credentials to a simulated phishing page. Follow-on login activity suggests account takeover risk.',
    severity: 'High',
    incidentId: 'HMX-2026-003',
    riskScore: 81,
    affectedUser: 'payroll.user',
    affectedHost: 'PAY-WKS-008',
    sourceIp: '192.0.2.66',
    suspiciousHash: '2aa4c4e1f883bc99f12d9db41a13d6ef',
    firstSeen: '08:42',
    status: 'Identity response',
    mitre: ['T1566 Phishing', 'T1078 Valid Accounts', 'T1110 Brute Force'],
    map: { source: { x: 39, y: 56, label: 'Phishing source' }, target: { x: 56, y: 41, label: 'Payroll identity' } },
    alerts: [
      { id: 'c1', severity: 'High', title: 'Impossible Travel', timestamp: '08:47', asset: 'payroll.user', status: 'New', confidence: 86 },
      { id: 'c2', severity: 'Medium', title: 'Sensitive File Download', timestamp: '08:50', asset: 'PAY-WKS-008', status: 'New', confidence: 74 },
      { id: 'c3', severity: 'Low', title: 'Unusual Outbound Connection', timestamp: '08:51', asset: 'PAY-WKS-008', status: 'New', confidence: 61 },
    ],
    timeline: [
      { time: '08:42', text: 'User clicked suspicious email link.' },
      { time: '08:44', text: 'Credentials submitted to simulated phishing page.' },
      { time: '08:47', text: 'Successful login from unfamiliar source.' },
      { time: '08:50', text: 'Payroll document accessed.' },
    ],
    evidence: [
      { id: 'user', name: 'User account', type: 'Identity', confidence: 90, description: 'Credential theft indicators and risky sign-in pattern.', reveals: ['Inspect User Account', 'Disable User Account'] },
      { id: 'auth', name: 'Authentication logs', type: 'Identity', confidence: 87, description: 'Valid login after phishing submission.', reveals: ['Review Authentication Logs'] },
      { id: 'ip', name: 'Source IP', type: 'Network', confidence: 76, description: 'Login source has low reputation in simulation context.', reveals: ['Investigate Source IP', 'Block Source IP'] },
      { id: 'network', name: 'Downloaded file metadata', type: 'Data Access', confidence: 73, description: 'Payroll document metadata indicates suspicious access.', reveals: ['Review Network Activity'] },
    ],
    intel: {
      ip: ['Reputation: low trust', 'Simulated geolocation: South America', 'ASN: AS64530 consumer ISP', 'Proxy/VPN: unknown', 'Associated activity: phishing login'],
      user: ['Recent sign-ins: suspicious new geography', 'Failed attempts: 3', 'Locations: office and unfamiliar source', 'Privilege: payroll data access', 'Risk state: credential theft likely'],
      host: ['Host: PAY-WKS-008', 'Endpoint telemetry: no malware observed', 'Primary response path: identity containment'],
      hash: ['Hash type: MD5 sample', 'Reputation: unknown', 'Detection confidence: 38%', 'Associated behavior: no strong file signal'],
    },
  },
];
