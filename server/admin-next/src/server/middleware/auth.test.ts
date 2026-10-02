import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import jwt from 'jsonwebtoken';
import auditLogModel from '../../../../models/auditLog';
import { auth, authSecret } from './auth';

function request(method: string, statusCode = 200) {
  const entries: any[] = [];
  (auditLogModel as any).record = async (entry: any) => {
    entries.push(entry);
  };

  const token = jwt.sign(
    { username: 'root', platform: 'admin-next' },
    authSecret
  );
  const req: any = {
    method,
    originalUrl: '/admin-next/api/users/1?_sort=id',
    body: { nickname: 'foo' },
    headers: { authorization: `Bearer ${token}`, 'user-agent': 'node-test' },
    socket: { remoteAddress: '10.0.0.1' },
  };
  const res: any = Object.assign(new EventEmitter(), { statusCode });
  let passed = false;

  auth()(req, res, () => {
    passed = true;
  });
  res.emit('finish');

  return { entries, passed };
}

test('audits authenticated write requests with operator and result', () => {
  const { entries, passed } = request('PUT');

  assert.equal(passed, true);
  assert.deepEqual(entries, [
    {
      source: 'admin',
      action: 'PUT /admin-next/api/users/1',
      operator: 'root',
      success: true,
      detail: { nickname: 'foo' },
      ip: '10.0.0.1',
      userAgent: 'node-test',
    },
  ]);
  assert.equal(request('DELETE', 500).entries[0].success, false);
});

test('does not audit read requests', () => {
  const { entries, passed } = request('GET');

  assert.equal(passed, true);
  assert.deepEqual(entries, []);
});
