import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import md5 from 'md5';

export const adminAuth = {
  username: process.env.ADMIN_USER,
  password: process.env.ADMIN_PASS,
};

export const authSecret =
  (process.env.SECRET || 'tailchat') + md5(JSON.stringify(adminAuth)); // 增加一个md5的盐值确保SECRET没有设置的情况下只修改了用户名密码也不会被人伪造token秘钥

export function auth() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        res.status(401).end('not found authorization in headers');
        return;
      }

      const token = authorization.slice('Bearer '.length);

      const payload = jwt.verify(token, authSecret);
      if (typeof payload === 'string') {
        res.status(401).end('payload type error');
        return;
      }
      if (payload.platform !== 'admin') {
        res.status(401).end('Payload invalid');
        return;
      }

      next();
    } catch (err) {
      res.status(500).end(String(err));
    }
  };
}
