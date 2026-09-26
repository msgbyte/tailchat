import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildResourceQuery,
  getValue,
  normalizeRoute,
  parseUrlStr,
  readAuth,
  requestHeaders,
  toCSV,
  validateNotification,
} from './core';
import { translations } from './i18n';

test('normalizes admin-next routes', () => {
  assert.equal(normalizeRoute('/admin-next/users/'), 'users');
  assert.equal(normalizeRoute('/admin-next/not-real'), 'dashboard');
});

test('resolves backend image URLs for production and development', () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const previousEnv = process.env.NODE_ENV;
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { location: { origin: 'https://chat.example.com' } },
  });
  try {
    for (const [mode, backend] of [
      ['production', 'https://chat.example.com'],
      ['development', 'http://localhost:11000'],
    ]) {
      process.env.NODE_ENV = mode;
      for (const placeholder of ['{BACKEND}', '%7BBACKEND%7D']) {
        assert.equal(
          parseUrlStr(`${placeholder}/static/files/avatar.jpg`),
          `${backend}/static/files/avatar.jpg`
        );
      }
      for (const url of [
        '',
        '/images/avatar.jpg',
        'https://cdn.example.com/a.jpg',
      ]) {
        assert.equal(parseUrlStr(url), url);
      }
    }
  } finally {
    if (previousWindow)
      Object.defineProperty(globalThis, 'window', previousWindow);
    else delete globalThis.window;
    if (previousEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnv;
  }
});

test('accepts only unexpired auth sessions', () => {
  const value = JSON.stringify({ token: 't', username: 'a', expiredAt: 100 });
  assert.equal(readAuth(value, 99)?.token, 't');
  assert.equal(readAuth(value, 100), null);
  assert.equal(readAuth('bad json', 0), null);
});

test('builds the legacy resource query', () => {
  assert.equal(
    buildResourceQuery({
      page: 2,
      perPage: 20,
      sort: 'createdAt',
      order: 'DESC',
      search: 'moon',
    }),
    '_sort=createdAt&_order=DESC&_start=20&_end=40&q=moon'
  );
});

test('reads nested values and exports deterministic CSV', () => {
  assert.equal(
    getValue(
      { members: ['a'], metaData: { 'content-type': 'x' } },
      'members.length'
    ),
    1
  );
  assert.equal(
    getValue({ metaData: { 'content-type': 'x' } }, 'metaData.content-type'),
    'x'
  );
  assert.equal(
    toCSV(
      [
        {
          name: 'a,b',
          note: 'say "hi"',
          enabled: true,
          tags: ['a', 'b'],
          meta: { a: 1 },
          empty: null,
        },
      ],
      [
        { key: 'name', label: 'Name' },
        { key: 'note', label: 'Note' },
        { key: 'enabled', label: 'Enabled' },
        { key: 'tags', label: 'Tags' },
        { key: 'meta', label: 'Meta' },
        { key: 'empty', label: 'Empty' },
      ]
    ),
    'Name,Note,Enabled,Tags,Meta,Empty\r\n"a,b","say ""hi""",true,"[""a"",""b""]","{""a"":1}",'
  );
});

test('creates authenticated headers without breaking multipart forms', () => {
  assert.deepEqual(requestHeaders('token', false), {
    Authorization: 'Bearer token',
  });
  assert.deepEqual(requestHeaders('token', true), {
    Authorization: 'Bearer token',
    'Content-Type': 'application/json',
  });
});

test('validates notification boundaries', () => {
  assert.ok(validateNotification('all', [], '', 'body'));
  assert.ok(validateNotification('all', [], 'title', ''));
  assert.ok(validateNotification('specified', [], 'title', 'body'));
  assert.equal(validateNotification('all', [], 'title', 'body'), null);
  assert.equal(
    validateNotification('specified', ['user'], 'title', 'body'),
    null
  );
});

test('keeps every route bilingual', () => {
  for (const route of [
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
  ]) {
    assert.ok(translations.zh[`route.${route}`]);
    assert.ok(translations.en[`route.${route}`]);
  }
});
