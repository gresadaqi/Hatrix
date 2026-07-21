# Hatrix

Hatrix is a React, TypeScript, and Vite cybersecurity interface deployed as a static GitHub Pages site. Browser tools run locally where possible; network-dependent tools use narrowly scoped serverless APIs.

## Local frontend development

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set the deployed Worker endpoint in `.env.local`:

```text
VITE_SECURITY_HEADER_API_URL=https://your-worker.workers.dev
```

Vite embeds this value at build time. Restart the development server after changing it. If it is absent, the Security Header Analyzer displays a configuration notice and its clearly labeled demo remains usable.

## Security Header Analyzer Worker

The Cloudflare Worker lives in [`worker/`](worker/). It validates public HTTP/HTTPS targets, blocks internal network destinations, limits redirects and time, and returns only selected response headers.

```bash
cd worker
npm install
npx wrangler login
npm run deploy
```

Copy the deployed Workers URL. For GitHub Pages, create a repository Actions variable named `SECURITY_HEADER_API_URL` containing that URL. The Pages workflow passes it to Vite as `VITE_SECURITY_HEADER_API_URL` during the production build. Alternatively, set `VITE_SECURITY_HEADER_API_URL` directly in any other build environment.

See [`worker/README.md`](worker/README.md) for security controls, local Worker development, and rate-limiting guidance.

Only scan websites you own or are authorized to assess.

## Verification

```bash
npm run lint
npm run build
cd worker
npm run typecheck
```
