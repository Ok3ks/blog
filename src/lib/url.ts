// Helpers for building and comparing URLs against the configured `base`.
// import.meta.env.BASE_URL has NO guaranteed trailing slash (e.g. "/blog"),
// so never concatenate paths onto it directly — use withBase().

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Join the site base with a path, with exactly one slash between them. */
export function withBase(path: string = '/'): string {
  const hadTrailing = path.length > 1 && path.endsWith('/');
  const rel = String(path).replace(/^\/+/, '').replace(/\/+$/, '');
  if (!rel) return `${BASE}/`;
  return `${BASE}/${rel}${hadTrailing ? '/' : ''}`;
}

/** Strip the base prefix from a pathname so it can be compared to a route. */
export function stripBase(pathname: string): string {
  let p = pathname;
  if (BASE && (p === BASE || p.startsWith(BASE + '/'))) {
    p = p.slice(BASE.length);
  }
  if (!p.startsWith('/')) p = '/' + p;
  // Normalize trailing slash (except root) for stable comparisons.
  return p !== '/' ? p.replace(/\/$/, '') : '/';
}
