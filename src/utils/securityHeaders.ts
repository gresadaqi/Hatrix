import type { Grade, HeaderFinding, SecurityAnalysis, WorkerScanResponse } from '../types/securityHeaders';

type Definition = {
  key: string;
  name: string;
  weight: number;
  why: string;
  recommendation: string;
};

const definitions: Definition[] = [
  { key: 'content-security-policy', name: 'Content-Security-Policy', weight: 25, why: 'Restricts the sources from which active content may load, reducing XSS and injection impact.', recommendation: "Use a nonce- or hash-based policy with default-src 'self'; object-src 'none'; base-uri 'self'; and frame-ancestors 'none'." },
  { key: 'strict-transport-security', name: 'Strict-Transport-Security', weight: 20, why: 'Forces supported browsers to use HTTPS and helps prevent protocol downgrade attacks.', recommendation: 'Use max-age=31536000; includeSubDomains; preload after confirming every subdomain supports HTTPS.' },
  { key: 'x-content-type-options', name: 'X-Content-Type-Options', weight: 10, why: 'Prevents browsers from MIME-sniffing content into an executable type.', recommendation: 'Set X-Content-Type-Options: nosniff.' },
  { key: 'x-frame-options', name: 'X-Frame-Options / CSP frame-ancestors', weight: 10, why: 'Controls framing to reduce clickjacking risk.', recommendation: "Prefer CSP frame-ancestors 'none' or trusted origins; retain X-Frame-Options: DENY for legacy clients when appropriate." },
  { key: 'referrer-policy', name: 'Referrer-Policy', weight: 10, why: 'Limits sensitive path and query information disclosed in outbound Referer headers.', recommendation: 'Use strict-origin-when-cross-origin or no-referrer.' },
  { key: 'permissions-policy', name: 'Permissions-Policy', weight: 10, why: 'Restricts powerful browser features such as camera, microphone, and geolocation.', recommendation: 'Explicitly disable unused features, for example camera=(), microphone=(), geolocation=().' },
  { key: 'cross-origin', name: 'Cross-Origin Isolation Headers', weight: 10, why: 'Separates browsing contexts and resources to reduce cross-origin data exposure.', recommendation: 'Assess and deploy COOP: same-origin, CORP: same-origin, and COEP: require-corp where application compatibility permits.' },
  { key: 'set-cookie', name: 'Set-Cookie Security Attributes', weight: 5, why: 'Cookie flags reduce session theft, cross-site leakage, and CSRF exposure.', recommendation: 'Use Secure; HttpOnly; SameSite=Lax or Strict for session cookies. SameSite=None always requires Secure.' },
];

const valueOf = (headers: Record<string, string>, key: string) => headers[key] ?? '';
const hasDirective = (value: string, directive: string) => new RegExp(`(?:^|;)\\s*${directive}(?:\\s|;|$)`, 'i').test(value);

function finding(definition: Definition, value: string, weaknesses: string[], positive: string[], score: number): HeaderFinding {
  const status = value ? 'Present' : 'Missing';
  return {
    name: definition.name,
    status,
    value: value || 'Not present',
    risk: !value || score <= definition.weight * 0.35 ? 'High' : score < definition.weight ? 'Medium' : 'Low',
    why: definition.why,
    recommendation: definition.recommendation,
    weaknesses,
    positive,
    score: Math.max(0, Math.round(score)),
    maxScore: definition.weight,
  };
}

function analyzeCsp(headers: Record<string, string>): HeaderFinding {
  const def = definitions[0];
  const value = valueOf(headers, def.key);
  if (!value) return finding(def, value, ['Header is missing.'], [], 0);
  const weak: string[] = [];
  if (/['"]unsafe-inline['"]/i.test(value)) weak.push("Allows 'unsafe-inline', weakening script/style injection protection.");
  if (/['"]unsafe-eval['"]/i.test(value)) weak.push("Allows 'unsafe-eval', enabling risky dynamic code evaluation.");
  if (/(^|[;\s])\*(?:[;\s]|$)/.test(value)) weak.push('Contains a wildcard source.');
  if (/default-src\s+(?:\*|https?:)/i.test(value)) weak.push('default-src is overly broad.');
  if (!hasDirective(value, 'object-src')) weak.push('object-src is missing.');
  if (!hasDirective(value, 'frame-ancestors')) weak.push('frame-ancestors is missing.');
  const score = def.weight - weak.length * 4;
  return finding(def, value, weak, weak.length ? [] : ['CSP includes strong baseline controls.'], score);
}

function analyzeHsts(headers: Record<string, string>, https: boolean): HeaderFinding {
  const def = definitions[1];
  const value = valueOf(headers, def.key);
  if (!https) return finding(def, value, ['The final URL does not use HTTPS.'], [], 0);
  if (!value) return finding(def, value, ['Header is missing on an HTTPS response.'], [], 0);
  const weak: string[] = [];
  const maxAge = Number(/max-age\s*=\s*(\d+)/i.exec(value)?.[1] ?? 0);
  if (maxAge < 31536000) weak.push('max-age is below the recommended one year.');
  if (!/includeSubDomains/i.test(value)) weak.push('includeSubDomains is missing.');
  if (!/preload/i.test(value)) weak.push('preload is missing (optional until preload requirements are verified).');
  return finding(def, value, weak, weak.length ? [] : ['HTTPS is enforced with a strong HSTS policy.'], def.weight - weak.length * 4);
}

function analyzeSimple(headers: Record<string, string>, index: number, valid: (value: string) => boolean, weakness: string): HeaderFinding {
  const def = definitions[index];
  const value = valueOf(headers, def.key);
  if (!value) return finding(def, value, ['Header is missing.'], [], 0);
  return valid(value) ? finding(def, value, [], ['Header uses a recognized secure value.'], def.weight) : finding(def, value, [weakness], [], def.weight * 0.25);
}

function analyzeFraming(headers: Record<string, string>): HeaderFinding {
  const def = definitions[3];
  const xfo = valueOf(headers, 'x-frame-options');
  const csp = valueOf(headers, 'content-security-policy');
  const frameAncestors = /frame-ancestors\s+([^;]+)/i.exec(csp)?.[1];
  if (frameAncestors) return finding(def, `CSP frame-ancestors ${frameAncestors}`, [], ['Framing is controlled by modern CSP frame-ancestors.'], def.weight);
  if (!xfo) return finding(def, '', ['Neither X-Frame-Options nor CSP frame-ancestors is present.'], [], 0);
  if (!/^(DENY|SAMEORIGIN)$/i.test(xfo.trim())) return finding(def, xfo, ['X-Frame-Options has an invalid or obsolete value.'], [], 2);
  return finding(def, xfo, [], ['A valid legacy anti-framing policy is present.'], def.weight);
}

function analyzePermissions(headers: Record<string, string>): HeaderFinding {
  const def = definitions[5];
  const value = valueOf(headers, def.key);
  if (!value) return finding(def, value, ['Header is missing.'], [], 0);
  const broad = /\*=\*|\([^)]*\*[^)]*\)/.test(value);
  return broad ? finding(def, value, ['One or more capabilities are granted broadly with a wildcard.'], [], 4) : finding(def, value, [], ['Browser capabilities are explicitly scoped.'], def.weight);
}

function analyzeCrossOrigin(headers: Record<string, string>): HeaderFinding {
  const def = definitions[6];
  const keys = ['cross-origin-opener-policy', 'cross-origin-resource-policy', 'cross-origin-embedder-policy'];
  const present = keys.filter((key) => valueOf(headers, key));
  const value = keys.map((key) => `${key}: ${valueOf(headers, key) || 'missing'}`).join('\n');
  const weak = keys.filter((key) => !present.includes(key)).map((key) => `${key} is missing; deploy only after compatibility review.`);
  return finding(def, value, weak, present.length === 3 ? ['All three cross-origin isolation headers are present.'] : [], (present.length / 3) * def.weight);
}

function analyzeCookies(headers: Record<string, string>): HeaderFinding {
  const def = definitions[7];
  const value = valueOf(headers, def.key);
  if (!value) return finding(def, value, [], ['No Set-Cookie header was visible; cookie controls may not apply to this response.'], def.weight);
  const cookies = value.split(/\n|,(?=\s*[^;,=]+=[^;,]+)/);
  const weak = new Set<string>();
  cookies.forEach((cookie) => {
    if (!/;\s*secure(?:;|$)/i.test(cookie)) weak.add('At least one cookie is missing Secure.');
    if (!/;\s*httponly(?:;|$)/i.test(cookie)) weak.add('At least one cookie is missing HttpOnly.');
    if (!/;\s*samesite\s*=/i.test(cookie)) weak.add('At least one cookie is missing SameSite.');
    if (/;\s*samesite\s*=\s*none/i.test(cookie) && !/;\s*secure(?:;|$)/i.test(cookie)) weak.add('SameSite=None is used without Secure.');
  });
  return finding(def, value, [...weak], weak.size ? [] : ['Visible cookies include Secure, HttpOnly, and SameSite.'], def.weight - weak.size * 1.5);
}

function analyzeCacheControl(headers: Record<string, string>): HeaderFinding {
  const value = valueOf(headers, 'cache-control');
  const weaknesses = !value ? ['Cache-Control is missing; confirm whether this response may contain sensitive data.'] : /public/i.test(value) && !/no-store|private/i.test(value) ? ['The response is explicitly public; verify that it never contains user-specific or sensitive data.'] : [];
  return {
    name: 'Cache-Control', status: value ? 'Present' : 'Missing', value: value || 'Not present',
    risk: weaknesses.length ? 'Medium' : 'Low',
    why: 'Controls whether browsers and intermediary caches retain potentially sensitive response data.',
    recommendation: 'For sensitive responses use Cache-Control: no-store; otherwise define an explicit policy appropriate to the content.',
    weaknesses, positive: value && !weaknesses.length ? ['An explicit cache policy is present.'] : [], score: 0, maxScore: 0,
  };
}
export function gradeFor(score: number): Grade {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export function analyzeSecurityHeaders(targetUrl: string, scan: WorkerScanResponse, demo = false): SecurityAnalysis {
  const headers = Object.fromEntries(Object.entries(scan.headers).map(([key, value]) => [key.toLowerCase(), value]));
  const https = scan.finalUrl.startsWith('https://');
  const findings = [
    analyzeCsp(headers), analyzeHsts(headers, https),
    analyzeSimple(headers, 2, (value) => value.trim().toLowerCase() === 'nosniff', 'Value must be nosniff.'),
    analyzeFraming(headers),
    analyzeSimple(headers, 4, (value) => !/^(unsafe-url|no-referrer-when-downgrade)$/i.test(value.trim()), 'Policy leaks excessive referrer information.'),
    analyzePermissions(headers), analyzeCrossOrigin(headers), analyzeCacheControl(headers), analyzeCookies(headers),
  ];
  const score = Math.max(0, Math.min(100, findings.reduce((sum, item) => sum + item.score, 0)));
  const missingHeaders = findings.filter((item) => item.status === 'Missing' && item.weaknesses.length).map((item) => item.name);
  const weakHeaders = findings.filter((item) => item.status === 'Present' && item.weaknesses.length).map((item) => item.name);
  const positiveFindings = findings.flatMap((item) => item.positive);
  return {
    targetUrl, timestamp: new Date().toISOString(), finalUrl: scan.finalUrl, httpStatus: scan.status, https,
    redirectCount: scan.redirectCount, responseTime: scan.responseTime, score, grade: gradeFor(score), findings,
    missingHeaders, weakHeaders, positiveFindings,
    summary: score >= 80 ? 'The response has a strong security-header baseline with targeted improvements remaining.' : score >= 60 ? 'The response has partial protections, but several meaningful hardening opportunities remain.' : 'The response is missing or weakening important browser-side security controls.',
    scoreExplanation: findings.filter((item) => item.maxScore > 0).map((item) => `${item.name}: ${item.score}/${item.maxScore}`), demo,
  };
}

export function createTextReport(analysis: SecurityAnalysis): string {
  const list = (items: string[]) => items.length ? items.map((item) => `- ${item}`).join('\n') : '- None detected';
  return `HATRIX SECURITY HEADER ASSESSMENT\n\nTarget URL: ${analysis.targetUrl}\nScan timestamp: ${analysis.timestamp}\nFinal URL: ${analysis.finalUrl}\nHTTP status: ${analysis.httpStatus}\nHTTPS: ${analysis.https ? 'Yes' : 'No'}\nRedirects: ${analysis.redirectCount}\nResponse time: ${analysis.responseTime} ms\nOverall score: ${analysis.score}/100 (${analysis.grade})\n\nEXECUTIVE SUMMARY\n${analysis.summary}\n\nSCORE CALCULATION\n${list(analysis.scoreExplanation)}\n\nMISSING HEADERS\n${list(analysis.missingHeaders)}\n\nWEAK HEADERS\n${list(analysis.weakHeaders)}\n\nPOSITIVE FINDINGS\n${list(analysis.positiveFindings)}\n\nDETAILED REMEDIATION\n${analysis.findings.filter((item) => item.weaknesses.length).map((item) => `${item.name}\nIssues: ${item.weaknesses.join(' ')}\nRecommendation: ${item.recommendation}`).join('\n\n') || 'No priority remediation identified.'}\n\nDISCLAIMER\nThis assessment reviews selected HTTP response headers only. It is not a complete security audit. Only scan websites you own or are authorized to assess.`;
}

export const demoScan: WorkerScanResponse = {
  status: 200, finalUrl: 'https://demo.example/', redirectCount: 1, responseTime: 184,
  headers: {
    'content-security-policy': "default-src 'self'; object-src 'none'; frame-ancestors 'none'",
    'strict-transport-security': 'max-age=31536000; includeSubDomains',
    'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
    'cross-origin-opener-policy': 'same-origin', 'cross-origin-resource-policy': 'same-origin',
    'cache-control': 'no-store', 'set-cookie': 'session=sample; Secure; HttpOnly; SameSite=Lax',
  },
};

/* Example cases for a future test runner:
   gradeFor(90) === 'A'; gradeFor(59) === 'F'.
   CSP with unsafe-inline loses points; short HSTS loses points.
   A cookie without Secure/HttpOnly/SameSite produces three weaknesses. */
