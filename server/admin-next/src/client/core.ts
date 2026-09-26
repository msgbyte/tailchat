export const ROUTES = [
  'dashboard',
  'analytics',
  'users',
  'login-logs',
  'messages',
  'groups',
  'files',
  'mail',
  'discover',
  'network',
  'socketio',
  'cache',
  'system-notify',
  'system',
] as const;

export type RouteId = (typeof ROUTES)[number];

export interface AuthSession {
  token: string;
  username: string;
  expiredAt: number;
}

export function normalizeRoute(pathname: string): RouteId {
  const route = pathname.replace(/^\/admin-next\/?/, '').replace(/\/$/, '');
  return ROUTES.includes(route as RouteId) ? (route as RouteId) : 'dashboard';
}

export function parseUrlStr(originUrl: string): string {
  const backend =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:11000'
      : window.location.origin;
  return originUrl
    .replace('{BACKEND}', backend)
    .replace('%7BBACKEND%7D', backend);
}

export function readAuth(
  raw: string | null,
  now = Date.now()
): AuthSession | null {
  try {
    const value = JSON.parse(raw || '') as AuthSession;
    return value?.token && value?.username && value.expiredAt > now
      ? value
      : null;
  } catch {
    return null;
  }
}

export interface ResourceQuery {
  page: number;
  perPage: number;
  sort: string;
  order: 'ASC' | 'DESC';
  search?: string;
  filters?: Record<string, string | number | boolean | undefined>;
}

export function buildResourceQuery(options: ResourceQuery): string {
  const start = (options.page - 1) * options.perPage;
  const query = new URLSearchParams({
    _sort: options.sort,
    _order: options.order,
    _start: String(start),
    _end: String(start + options.perPage),
  });
  if (options.search) query.set('q', options.search);
  Object.entries(options.filters || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value));
  });
  return query.toString();
}

export function getValue(record: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value === null || value === undefined) return undefined;
    return (value as Record<string, unknown>)[key];
  }, record);
}

function printable(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function csvField(value: unknown): string {
  const text = printable(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCSV(
  rows: Record<string, unknown>[],
  columns: { key: string; label: string }[]
): string {
  return [
    columns.map((column) => csvField(column.label)).join(','),
    ...rows.map((row) =>
      columns.map((column) => csvField(getValue(row, column.key))).join(',')
    ),
  ].join('\r\n');
}

export function requestHeaders(
  token: string,
  json: boolean
): Record<string, string> {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(json ? { 'Content-Type': 'application/json' } : {}),
  };
}

export function validateNotification(
  scope: 'all' | 'specified',
  users: string[],
  title: string,
  content: string
): 'title' | 'content' | 'users' | null {
  if (!title.trim()) return 'title';
  if (!content.trim()) return 'content';
  if (scope === 'specified' && users.length === 0) return 'users';
  return null;
}

export function downloadCSV(filename: string, csv: string): void {
  const url = URL.createObjectURL(
    new Blob([`\ufeff${csv}`], { type: 'text/csv' })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
