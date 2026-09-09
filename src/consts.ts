// Site-wide constants. Edit these to make the blog your own.
export const SITE_TITLE = 'Emmanuel Okedele';
export const SITE_DESCRIPTION =
  'Full-stack software engineer working on AI/ML research and applications.';
export const AUTHOR = 'Emmanuel Okedele';

// Navigation links shown in the header.
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

// Optional social links shown in the footer. Leave empty to hide.
export const SOCIAL_LINKS = [
  { href: 'https://github.com/Ok3ks', label: 'GitHub' },
];

// External blogs to republish from, via their RSS feeds. Each post is fetched
// at build time and rendered in full on this site, with a canonical link back
// to the original. Leave empty to disable. Examples:
//   { source: 'Medium', url: 'https://medium.com/feed/@your-username' },
//   { source: 'Substack', url: 'https://your-name.substack.com/feed' },
export const EXTERNAL_FEEDS: { source: string; url: string }[] = [];
