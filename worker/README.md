# Hatrix Security Header API

A small Cloudflare Worker used by the static Hatrix GitHub Pages frontend. It fetches only one target response (HEAD first, then a one-byte GET fallback), follows at most five redirects, returns selected headers, and never returns a response body.

## Security controls

- Only `http://` and `https://` URLs on standard ports are accepted.
- Credentials, localhost/internal names, private, loopback, link-local, reserved, and metadata addresses are rejected.
- A and AAAA records are resolved through Cloudflare DNS and checked before every redirect hop.
- Redirects are manual and limited to five; requests time out after eight seconds.
- Response bodies are cancelled and never exposed.
- CORS is limited to the Hatrix GitHub Pages origin and the two documented Vite development origins.

DNS validation reduces DNS-based SSRF risk, but production operators should also use Cloudflare account controls, logs, and abuse monitoring. For rate limiting, create a Cloudflare Rate Limiting rule for this Worker route (for example, 20 requests per minute per IP) or add a Durable Object-based limiter if stronger per-client guarantees are required.

## Development

```bash
npm install
npm run typecheck
npm run dev
```

The local Worker URL printed by Wrangler can be placed in the frontend `.env.local` as `VITE_SECURITY_HEADER_API_URL`.

## Deploy

```bash
npx wrangler login
npm run deploy
```

After deployment, copy the resulting `https://...workers.dev` URL into the frontend environment variable and rebuild the GitHub Pages site. No secrets are required by this Worker.
