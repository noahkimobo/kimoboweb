const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${base}${path}`;
}

export function withoutBase(path: string): string {
  const prefix = `${base}/`;
  if (path === base || path === `${base}/`) return '/';
  return path.startsWith(prefix) ? `/${path.slice(prefix.length)}` : path;
}
