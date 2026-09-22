import test from 'node:test';
import assert from 'node:assert/strict';
import parseQuery from './parseQuery';

const model: any = { schema: { path: () => ({ cast: (v: any) => v }) } };
const uniqueName = (q: string) => {
  const [nickname, discriminator] = q.split('#');
  return discriminator ? { nickname, discriminator } : undefined;
};

test('adds nickname#discriminator match to $or', () => {
  const result = parseQuery(
    { q: 'admin#6485' },
    model,
    ['nickname'],
    ['nickname', 'email'],
    uniqueName
  );
  assert.equal(result.q, undefined);
  assert.deepEqual(result.$or.at(-1), {
    nickname: 'admin',
    discriminator: '6485',
  });
});

test('keeps plain search unchanged without #', () => {
  const result = parseQuery(
    { q: 'admin' },
    model,
    ['nickname'],
    ['nickname', 'email'],
    uniqueName
  );
  assert.equal(result.$or.length, 2);
  assert.deepEqual(result.$or[1], { email: 'admin' });
});
