import type { IncomingMessage } from 'http';

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
