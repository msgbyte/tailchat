import type { IncomingMessage } from 'http';
import { isIP } from 'net';

function normalizeIp(value: string | undefined): string | undefined {
  if (!value || !isIP(value) || value.includes('%')) return undefined;
  if (isIP(value) === 4) return value;

  const ip = new URL(`http://[${value}]/`).hostname.slice(1, -1);
  const mapped = /^::ffff:([a-f\d]{1,4}):([a-f\d]{1,4})$/.exec(ip);
  if (mapped) {
    const parts = mapped.slice(1).map((part) => parseInt(part, 16));
    return [parts[0] >> 8, parts[0] & 255, parts[1] >> 8, parts[1] & 255].join(
      '.'
    );
  }
  return ip;
}

/** IPv6 privacy addresses in the same /64 share registration quota. */
export function getRegistrationIp(
  value: string | undefined
): string | undefined {
  const ip = normalizeIp(value);
  if (!ip || isIP(ip) === 4) return ip;
  const [left, right = ''] = ip.split('::');
  const head = left ? left.split(':') : [];
  const tail = right ? right.split(':') : [];
  const parts = [
    ...head,
    ...Array(8 - head.length - tail.length).fill('0'),
    ...tail,
  ];
  return `${parts.slice(0, 4).join(':')}::/64`;
}

function getHeaderValue(
  header: string | string[] | undefined
): string | undefined {
  return Array.isArray(header) ? header[0] : header;
}

/** Forwarded headers must be sanitized by the deployment's reverse proxy. */
export function getRequestIp(req: IncomingMessage): string | undefined {
  const forwardedFor = getHeaderValue(req.headers['x-forwarded-for'])
    ?.split(',')[0]
    ?.trim();
  const realIp = getHeaderValue(req.headers['x-real-ip'])?.trim();

  return forwardedFor || realIp || req.socket.remoteAddress;
}
