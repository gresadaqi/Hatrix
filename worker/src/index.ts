const allowedOrigins = new Set([
  'https://gresadaqi.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);
const selectedHeaders = [
  'content-security-policy', 'strict-transport-security', 'x-content-type-options',
  'x-frame-options', 'referrer-policy', 'permissions-policy',
  'cross-origin-opener-policy', 'cross-origin-resource-policy',
  'cross-origin-embedder-policy', 'cache-control', 'set-cookie',
];
const maxRedirects = 5;
const timeoutMs = 8000;

type DnsAnswer = { data: string; type: number };
type DnsResponse = { Answer?: DnsAnswer[]; Status: number };
type ScanResult = { status: number; finalUrl: string; headers: Record<string, string>; redirectCount: number; responseTime: number };

function cors(origin: string | null): HeadersInit {
  const allowed = origin && allowedOrigins.has(origin) ? origin : 'https://gresadaqi.github.io';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(origin: string | null, body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: cors(origin) });
}

function parseIpv4(value: string): number[] | null {
  const parts = value.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,3}$/.test(part) || Number(part) > 255)) return null;
  return parts.map(Number);
}

function isBlockedIpv4(value: string): boolean {
  const ip = parseIpv4(value);
  if (!ip) return false;
  const [a, b] = ip;
  return a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19));
}

function isBlockedIpv6(value: string): boolean {
  const ip = value.toLowerCase().split('%')[0];
  if (ip === '::' || ip === '::1') return true;
  if (/^f[cd][0-9a-f]{2}:/.test(ip)) return true;
  if (/^fe[89ab][0-9a-f]:/.test(ip)) return true;
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(ip);
  return mapped ? isBlockedIpv4(mapped[1]) : false;
}

function validateUrl(raw: string): URL {
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error('Enter a valid absolute URL.'); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP and HTTPS URLs are allowed.');
  if (url.username || url.password) throw new Error('URLs containing credentials are not allowed.');
  if (url.port && !['80', '443'].includes(url.port)) throw new Error('Only standard HTTP and HTTPS ports are allowed.');
  const hostname = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname.endsWith('.internal')) throw new Error('Local and internal hostnames are blocked.');
  if (isBlockedIpv4(hostname) || isBlockedIpv6(hostname)) throw new Error('Private, loopback, link-local, and reserved IP addresses are blocked.');
  return url;
}

async function resolveDns(hostname: string, type: 'A' | 'AAAA'): Promise<string[]> {
  const endpoint = new URL('https://cloudflare-dns.com/dns-query');
  endpoint.searchParams.set('name', hostname);
  endpoint.searchParams.set('type', type);
  const response = await fetch(endpoint, { headers: { Accept: 'application/dns-json' }, signal: AbortSignal.timeout(3000) });
  if (!response.ok) throw new Error('DNS validation failed.');
  const data = await response.json<DnsResponse>();
  if (data.Status !== 0 && data.Status !== 3) throw new Error('DNS validation failed.');
  const expectedType = type === 'A' ? 1 : 28;
  return (data.Answer ?? []).filter((answer) => answer.type === expectedType).map((answer) => answer.data);
}

async function assertPublicDestination(url: URL): Promise<void> {
  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  if (parseIpv4(hostname) || hostname.includes(':')) return;
  const [ipv4, ipv6] = await Promise.all([resolveDns(hostname, 'A'), resolveDns(hostname, 'AAAA')]);
  const addresses = [...ipv4, ...ipv6];
  if (!addresses.length) throw new Error('The hostname did not resolve to a public address.');
  if (addresses.some((address) => isBlockedIpv4(address) || isBlockedIpv6(address))) throw new Error('The hostname resolves to a blocked network address.');
}

function extractHeaders(headers: Headers): Record<string, string> {
  const output: Record<string, string> = {};
  selectedHeaders.forEach((name) => {
    if (name === 'set-cookie') {
      const cookies = headers.getSetCookie();
      if (cookies.length) output[name] = cookies.join('\n');
    } else {
      const value = headers.get(name);
      if (value) output[name] = value.slice(0, 8192);
    }
  });
  return output;
}

async function requestOnce(url: URL): Promise<Response> {
  const options: RequestInit = { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': 'Hatrix-Security-Header-Analyzer/1.0' } };
  let response = await fetch(url, options);
  if ([405, 501].includes(response.status)) {
    response.body?.cancel();
    response = await fetch(url, { ...options, method: 'GET', headers: { ...options.headers, Range: 'bytes=0-0' } });
  }
  return response;
}

async function scan(rawUrl: string): Promise<ScanResult> {
  const started = Date.now();
  let url = validateUrl(rawUrl);
  let redirectCount = 0;
  while (true) {
    await assertPublicDestination(url);
    const response = await requestOnce(url);
    const location = response.headers.get('location');
    if (location && [301, 302, 303, 307, 308].includes(response.status)) {
      response.body?.cancel();
      if (redirectCount >= maxRedirects) throw new Error(`Redirect limit of ${maxRedirects} exceeded.`);
      url = validateUrl(new URL(location, url).toString());
      redirectCount += 1;
      continue;
    }
    const result = { status: response.status, finalUrl: url.toString(), headers: extractHeaders(response.headers), redirectCount, responseTime: Date.now() - started };
    response.body?.cancel();
    return result;
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    const origin = request.headers.get('Origin');
    if (origin && !allowedOrigins.has(origin)) return json(origin, { error: 'Origin is not allowed.' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== 'POST') return json(origin, { error: 'Use POST with { "url": "https://example.com" }.' }, 405);
    if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) return json(origin, { error: 'Content-Type must be application/json.' }, 415);
    try {
      const body = await request.json<{ url?: unknown }>();
      if (typeof body.url !== 'string' || body.url.length > 2048) return json(origin, { error: 'A URL string of at most 2048 characters is required.' }, 400);
      return json(origin, await scan(body.url));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The scan failed.';
      return json(origin, { error: message }, /blocked|allowed|valid|HTTP|URL|hostname|port|credentials/i.test(message) ? 400 : 502);
    }
  },
} satisfies ExportedHandler;

/* Future test cases: reject localhost, 127.0.0.1, 10/8, 172.16/12, 192.168/16,
   169.254/16, ::1, fc00::/7, fe80::/10, .local and .internal; accept public HTTPS. */
