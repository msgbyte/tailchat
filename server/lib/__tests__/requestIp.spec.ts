import type { IncomingMessage } from 'http';
import { getRequestIp, getRegistrationIp } from '../requestIp';

const request = (
  peer: string | undefined,
  forwarded?: string | string[],
  real?: string | string[]
) =>
  ({
    socket: { remoteAddress: peer },
    headers: { 'x-forwarded-for': forwarded, 'x-real-ip': real },
  } as unknown as IncomingMessage);

test('uses the first forwarded address before real IP and connection IP', () => {
  expect(
    getRequestIp(request('10.0.0.1', ' 203.0.113.1, 10.0.0.2 ', '198.51.100.1'))
  ).toBe('203.0.113.1');
  expect(
    getRequestIp(request('10.0.0.1', ['203.0.113.1, 10.0.0.2', '198.51.100.1']))
  ).toBe('203.0.113.1');
});

test('falls back to real IP and then connection IP when headers are empty', () => {
  expect(getRequestIp(request('10.0.0.1', undefined, ' 203.0.113.1 '))).toBe(
    '203.0.113.1'
  );
  expect(
    getRequestIp(request('10.0.0.1', ' ', ['203.0.113.1', '198.51.100.1']))
  ).toBe('203.0.113.1');
  expect(getRequestIp(request('::ffff:127.0.0.1', ' ', ' '))).toBe(
    '::ffff:127.0.0.1'
  );
  expect(getRequestIp(request(undefined))).toBeUndefined();
});

test('normalizes mapped IPv4 and groups IPv6 addresses by /64', () => {
  expect(getRegistrationIp('::ffff:203.0.113.1')).toBe('203.0.113.1');
  expect(getRegistrationIp('::ffff:cb00:7101')).toBe('203.0.113.1');
  expect(getRegistrationIp('2001:0DB8:0001:0002::1')).toBe(
    getRegistrationIp('2001:db8:1:2::ffff')
  );
  expect(getRegistrationIp('2001:db8:1:3::1')).not.toBe(
    getRegistrationIp('2001:db8:1:2::1')
  );
  expect(getRegistrationIp('invalid')).toBeUndefined();
});
