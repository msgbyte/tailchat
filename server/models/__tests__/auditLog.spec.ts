import auditLogModel, { sanitizeAuditDetail } from '../auditLog';

test('redacts sensitive fields at any depth', () => {
  expect(
    sanitizeAuditDetail({
      username: 'admin',
      password: '123456',
      params: { accessToken: 'abc', list: [{ appSecret: 'xyz', id: 1 }] },
    })
  ).toEqual({
    username: 'admin',
    password: '[REDACTED]',
    params: {
      accessToken: '[REDACTED]',
      list: [{ appSecret: '[REDACTED]', id: 1 }],
    },
  });
});

test('escapes keys that mongo can not store', () => {
  expect(sanitizeAuditDetail({ $set: { 'config.name': 1 } })).toEqual({
    _set: { config_name: 1 },
  });
});

test('bounds strings, arrays, depth and total size', () => {
  const detail = sanitizeAuditDetail({
    content: 'a'.repeat(1000),
    list: Array.from({ length: 100 }, (_, i) => i),
    deep: { a: { b: { c: { d: { e: 1 } } } } },
  }) as any;

  expect(detail.content).toHaveLength(513);
  expect(detail.list).toHaveLength(50);
  expect(detail.deep.a.b.c.d).toBe('[Truncated]');

  const huge = sanitizeAuditDetail(
    Array.from({ length: 50 }, () => 'a'.repeat(500))
  ) as any;
  expect(huge.truncated).toHaveLength(8192);
});

test('keeps primitive and empty details', () => {
  expect(sanitizeAuditDetail(undefined)).toBeUndefined();
  expect(sanitizeAuditDetail({})).toEqual({});
  expect(sanitizeAuditDetail({ muteMs: -1, active: false })).toEqual({
    muteMs: -1,
    active: false,
  });
});

test('gives up immediately instead of throwing when mongo is not connected', async () => {
  const error = jest.spyOn(console, 'error').mockImplementation();

  await expect(
    auditLogModel.record({ source: 'group', action: 'test', operator: 'user' })
  ).resolves.toBeUndefined();
  expect(error).toHaveBeenCalled();

  error.mockRestore();
});
