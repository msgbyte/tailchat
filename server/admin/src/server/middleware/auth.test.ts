import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import auditLogModel from '../../../../models/auditLog';
import {
  auth,
  getAdminAuth,
  getAuthSecret,
  verifyAdminCredentials,
} from './auth';

interface AuditEntry {
  source: string;
  action: string;
  operator: string;
  success: boolean;
  detail: unknown;
  ip: string;
  userAgent?: string;
}

function withAdminEnv(
  env: { ADMIN_USER?: string; ADMIN_PASS?: string; SECRET?: string },
  fn: () => void
) {
  const prev = {
    ADMIN_USER: process.env.ADMIN_USER,
    ADMIN_PASS: process.env.ADMIN_PASS,
    SECRET: process.env.SECRET,
  };

  for (const key of ['ADMIN_USER', 'ADMIN_PASS', 'SECRET'] as const) {
    if (env[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = env[key];
    }
  }

  try {
    fn();
  } finally {
    for (const key of ['ADMIN_USER', 'ADMIN_PASS', 'SECRET'] as const) {
      if (prev[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = prev[key];
      }
    }
  }
}

function runAuthMiddleware(options: {
  method?: string;
  authorization?: string;
  statusCode?: number;
}) {
  const entries: AuditEntry[] = [];
  const originalRecord = auditLogModel.record;
  auditLogModel.record = (async (entry: AuditEntry) => {
    entries.push(entry);
  }) as typeof auditLogModel.record;

  const req = {
    method: options.method ?? 'GET',
    originalUrl: '/admin/api/user/count/summary',
    body: { nickname: 'foo' },
    headers: {
      ...(options.authorization !== undefined
        ? { authorization: options.authorization }
        : {}),
      'user-agent': 'node-test',
    },
    socket: { remoteAddress: '10.0.0.1' },
  } as unknown as Request;

  let responseStatus = options.statusCode ?? 200;
  let responseBody = '';
  const resEmitter = Object.assign(new EventEmitter(), {
    get statusCode() {
      return responseStatus;
    },
    set statusCode(code: number) {
      responseStatus = code;
    },
    status(code: number) {
      responseStatus = code;
      return this;
    },
    end(body?: string) {
      if (body !== undefined) {
        responseBody = body;
      }
      return this;
    },
  });
  const res = resEmitter as unknown as Response;

  let passed = false;
  try {
    auth()(req, res, () => {
      passed = true;
    });
    resEmitter.emit('finish');
  } finally {
    auditLogModel.record = originalRecord;
  }

  return { entries, passed, statusCode: responseStatus, body: responseBody };
}

test('rejects forged JWT when ADMIN_PASS is empty with default docker-compose env', () => {
  withAdminEnv({ ADMIN_USER: 'tailchat', ADMIN_PASS: '', SECRET: '' }, () => {
    assert.equal(getAdminAuth(), null);
    assert.equal(getAuthSecret(), null);
    assert.equal(verifyAdminCredentials('tailchat', ''), false);

    const forgedSecret =
      'tailchat' + md5(JSON.stringify({ username: 'tailchat', password: '' }));
    const forgedWithoutUser = jwt.sign({ platform: 'admin' }, forgedSecret);
    const forgedWithUser = jwt.sign(
      { username: 'tailchat', platform: 'admin' },
      forgedSecret
    );

    for (const token of [forgedWithoutUser, forgedWithUser]) {
      const result = runAuthMiddleware({
        method: 'GET',
        authorization: `Bearer ${token}`,
      });
      assert.equal(result.passed, false);
      assert.equal(result.statusCode, 401);
      assert.equal(result.body, 'Server not set env: ADMIN_USER, ADMIN_PASS');
      assert.deepEqual(result.entries, []);
    }
  });
});

test('rejects requests when credentials are unset or whitespace-only even if SECRET is set', () => {
  const cases = [
    { ADMIN_USER: undefined, ADMIN_PASS: undefined, SECRET: undefined },
    { ADMIN_USER: 'tailchat', ADMIN_PASS: '   ', SECRET: 'custom-secret' },
    {
      ADMIN_USER: '   ',
      ADMIN_PASS: 'configured-value',
      SECRET: 'custom-secret',
    },
  ];

  for (const env of cases) {
    withAdminEnv(env, () => {
      assert.equal(getAdminAuth(), null);
      assert.equal(getAuthSecret(), null);

      const forgedSecret =
        (env.SECRET || 'tailchat') +
        md5(
          JSON.stringify({
            username: env.ADMIN_USER,
            password: env.ADMIN_PASS,
          })
        );
      const token = jwt.sign(
        { username: env.ADMIN_USER || 'tailchat', platform: 'admin' },
        forgedSecret
      );
      const result = runAuthMiddleware({
        method: 'GET',
        authorization: `Bearer ${token}`,
      });
      assert.equal(result.passed, false);
      assert.equal(result.statusCode, 401);
    });
  }
});

test('allows valid admin JWT (case-insensitive Bearer) and audits write requests', () => {
  withAdminEnv(
    { ADMIN_USER: 'root', ADMIN_PASS: 'configured-pass', SECRET: 'test-key' },
    () => {
      const secret = getAuthSecret();
      assert.ok(secret);
      const token = jwt.sign({ username: 'root', platform: 'admin' }, secret);

      const getResult = runAuthMiddleware({
        method: 'GET',
        authorization: `bearer ${token}`,
      });
      assert.equal(getResult.passed, true);
      assert.deepEqual(getResult.entries, []);

      const postResult = runAuthMiddleware({
        method: 'POST',
        authorization: `Bearer ${token}`,
      });
      assert.equal(postResult.passed, true);
      assert.deepEqual(postResult.entries, [
        {
          source: 'admin',
          action: 'POST /admin/api/user/count/summary',
          operator: 'root',
          success: true,
          detail: { nickname: 'foo' },
          ip: '10.0.0.1',
          userAgent: 'node-test',
        },
      ]);

      const deleteResult = runAuthMiddleware({
        method: 'DELETE',
        authorization: `Bearer ${token}`,
        statusCode: 500,
      });
      assert.equal(deleteResult.passed, true);
      assert.equal(deleteResult.entries[0].success, false);
    }
  );
});

test('rejects invalid authorization headers, forged keys, wrong platform, wrong username, and unsigned tokens', () => {
  withAdminEnv(
    { ADMIN_USER: 'root', ADMIN_PASS: 'configured-pass', SECRET: 'test-key' },
    () => {
      const secret = getAuthSecret();
      assert.ok(secret);

      assert.equal(verifyAdminCredentials('root', 'configured-pass'), true);
      assert.equal(verifyAdminCredentials('root', 'wrong-pass'), false);
      assert.equal(verifyAdminCredentials('other', 'configured-pass'), false);
      assert.equal(verifyAdminCredentials(null, 'configured-pass'), false);

      const missingHeader = runAuthMiddleware({ method: 'GET' });
      assert.equal(missingHeader.passed, false);
      assert.equal(missingHeader.statusCode, 401);

      const validToken = jwt.sign(
        { username: 'root', platform: 'admin' },
        secret
      );
      const nonBearer = runAuthMiddleware({
        authorization: `Basic ${validToken}`,
      });
      assert.equal(nonBearer.passed, false);
      assert.equal(nonBearer.statusCode, 401);

      const defaultEmptyKey =
        'tailchat' +
        md5(JSON.stringify({ username: 'tailchat', password: '' }));
      const forgedWithDefaultKey = jwt.sign(
        { username: 'root', platform: 'admin' },
        defaultEmptyKey
      );
      const wrongPlatform = jwt.sign(
        { username: 'root', platform: 'admin-next' },
        secret
      );
      const wrongUsername = jwt.sign(
        { username: 'other', platform: 'admin' },
        secret
      );
      const missingUsername = jwt.sign({ platform: 'admin' }, secret);
      const noneAlgToken = `${Buffer.from(
        JSON.stringify({ alg: 'none', typ: 'JWT' })
      ).toString('base64url')}.${Buffer.from(
        JSON.stringify({ username: 'root', platform: 'admin' })
      ).toString('base64url')}.`;

      for (const token of [
        forgedWithDefaultKey,
        wrongPlatform,
        wrongUsername,
        missingUsername,
        noneAlgToken,
      ]) {
        const result = runAuthMiddleware({
          authorization: `Bearer ${token}`,
        });
        assert.equal(result.passed, false);
        assert.equal(result.statusCode, 401);
      }
    }
  );
});
