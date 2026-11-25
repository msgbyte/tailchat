import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import auditLogModel from '../../../../models/auditLog';
import { getRequestIp } from '../../../../lib/requestIp';

export interface AdminAuthConfig {
  username: string;
  password: string;
}

export function getAdminAuth(): AdminAuthConfig | null {
  const username = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASS;

  if (!username?.trim() || !password?.trim()) {
    return null;
  }

  return {
    username,
    password,
  };
}

export function getAuthSecret(
  adminAuth: AdminAuthConfig | null = getAdminAuth()
): string | null {
  if (!adminAuth) {
    return null;
  }

  // 增加一个md5的盐值确保SECRET没有设置的情况下只修改了用户名密码也不会被人伪造token秘钥
  return (process.env.SECRET || 'tailchat') + md5(JSON.stringify(adminAuth));
}

function timingSafeEqualStr(a: string, b: string): boolean {
  return crypto.timingSafeEqual(
    crypto.createHash('sha256').update(a).digest(),
    crypto.createHash('sha256').update(b).digest()
  );
}

export function verifyAdminCredentials(
  username: unknown,
  password: unknown,
  adminAuth: AdminAuthConfig | null = getAdminAuth()
): boolean {
  if (
    !adminAuth ||
    typeof username !== 'string' ||
    typeof password !== 'string'
  ) {
    return false;
  }

  const usernameMatched = timingSafeEqualStr(username, adminAuth.username);
  const passwordMatched = timingSafeEqualStr(password, adminAuth.password);

  return usernameMatched && passwordMatched;
}

/**
 * 记录管理后台操作的审计日志
 */
export function recordAdminAudit(
  req: Request,
  operator: unknown,
  success: boolean
) {
  return auditLogModel.record({
    source: 'admin',
    action: `${req.method} ${req.originalUrl.split('?')[0]}`,
    operator:
      typeof operator === 'string' && operator
        ? operator.slice(0, 64)
        : 'unknown',
    success,
    detail: req.body,
    ip: getRequestIp(req),
    userAgent: req.headers['user-agent'],
  });
}

export function auth() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminAuth = getAdminAuth();
      const authSecret = getAuthSecret(adminAuth);
      if (!adminAuth || !authSecret) {
        res.status(401).end('Server not set env: ADMIN_USER, ADMIN_PASS');
        return;
      }

      const authorization = req.headers.authorization;
      if (!authorization) {
        res.status(401).end('not found authorization in headers');
        return;
      }

      if (!/^Bearer /i.test(authorization)) {
        res.status(401).end('Invalid authorization header');
        return;
      }

      const token = authorization.slice('Bearer '.length);

      const payload = jwt.verify(token, authSecret, {
        algorithms: ['HS256'],
      });
      if (typeof payload === 'string') {
        res.status(401).end('payload type error');
        return;
      }
      if (
        payload.platform !== 'admin' ||
        payload.username !== adminAuth.username
      ) {
        res.status(401).end('Payload invalid');
        return;
      }

      if (req.method !== 'GET') {
        // 所有通过鉴权的写操作在响应结束后记录审计日志
        res.once('finish', () => {
          recordAdminAudit(req, payload.username, res.statusCode < 400);
        });
      }

      next();
    } catch (err) {
      res.status(401).end(String(err));
    }
  };
}
