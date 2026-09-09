# Deploying with GitHub Pages + Cloudflare

This site deploys via **GitHub Pages** (build + origin) and is fronted by
**Cloudflare** (DNS + CDN + TLS) on the custom domain `hi-emmanuel.com`.

## Architecture

```
your push → GitHub Actions builds Astro → GitHub Pages (origin)
                                              ↑
                              Cloudflare (DNS + CDN/proxy)
                                              ↑
                                        hi-emmanuel.com
```

GitHub Pages serves the site; Cloudflare sits in front as DNS + CDN + TLS.

## One-time setup

### 1. Add the domain to Cloudflare
Add `hi-emmanuel.com` as a zone in the Cloudflare dashboard and point your
registrar's nameservers at the two Cloudflare NS records it gives you.

### 2. Add DNS records pointing at GitHub Pages
Because `hi-emmanuel.com` is an apex/root domain, add GitHub's IPs:

- Four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- Four `AAAA` records → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
- (Optional) a `CNAME` for `www` → `ok3ks.github.io`

Set the proxy status to **DNS-only (grey cloud)** initially — see the HTTPS
gotcha below — then flip it to **Proxied (orange cloud)** once the GitHub cert
is issued.

### 3. Tell GitHub Pages about the custom domain
Repo → **Settings → Pages → Custom domain** → enter `hi-emmanuel.com` → Save.
Tick **Enforce HTTPS** once the cert provisions.

### 4. `public/CNAME`
Because we deploy via the artifact action (not a `gh-pages` branch), the domain
lives in `public/CNAME` so Astro copies it into `dist/` on every build:

```
hi-emmanuel.com
```

### 5. Astro config
The site lives at the domain root, so `base` is `/` and `site` is the full URL:

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://hi-emmanuel.com',
  base: '/',
  integrations: [mdx(), sitemap()],
});
```

### 6. Cloudflare SSL mode
SSL/TLS → Overview → set encryption mode to **Full** (never Flexible — Flexible
causes redirect loops with Pages' HTTPS). GitHub serves valid TLS, so Full works.

## Day-to-day workflow

Just push to `main`:

```
git push origin main
```

`.github/workflows/deploy.yml` runs `withastro/action@v3` to build and deploy to
GitHub Pages, then Cloudflare proxies and caches it. You can also trigger a manual
run from the **Actions** tab (`workflow_dispatch`).

## Gotchas

- **Don't use Flexible SSL** — it causes a redirect loop. Use **Full**.
- **HTTPS cert timing:** GitHub must resolve the domain to itself before it can
  issue the cert. With the Cloudflare proxy on, GitHub may not see its own domain
  to validate. Fix: set the Cloudflare records to **DNS-only (grey cloud)** until
  GitHub provisions the cert, then flip the proxy back on.
- **Stale content:** after a deploy Cloudflare may serve cached HTML. Purge the
  cache (or add a page rule) if you see old content.

## Alternative: Cloudflare Pages only

Since this is a static Astro site, Cloudflare Pages can build and host it
directly — connect the repo, build command `npm run build`, output dir `dist` —
which drops the GitHub Actions step and keeps everything on Cloudflare.
