// Extract the 11-character video ID from a YouTube URL or bare ID.
export function youtubeId(input: string): string | null {
  const value = input.trim();
  if (/^[\w-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^(www\.|m\.)/, '');
    if (host === 'youtu.be') return url.pathname.slice(1, 12) || null;
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const v = url.searchParams.get('v');
      if (v) return v;
      const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/);
      if (match) return match[1];
    }
  } catch {
    // Not a URL; fall through.
  }
  return null;
}

// Convert "1:37:00", "4:05", "90", or 90 to seconds.
export function toSeconds(value: string | number | undefined): number {
  if (value === undefined) return 0;
  if (typeof value === 'number') return Math.max(0, Math.floor(value));
  const parts = value.trim().split(':').map(Number);
  if (parts.some((n) => !Number.isFinite(n))) return 0;
  return parts.reduce((total, n) => total * 60 + n, 0);
}
