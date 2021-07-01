import { buildCachedRegFn, buildRegFn } from '../buildRegFn';

describe('buildRegFn should be ok', () => {
  test('normal', () => {
    const [get, set] = buildRegFn('test');
    const fn = jest.fn();
    set(fn);

    get();
    get(1);
    get(2);

    const fn2 = jest.fn();
    set(fn2);

    get(3);

    expect(fn.mock.calls.length).toBe(3);
    expect(fn.mock.calls[0]).toEqual([]);
    expect(fn.mock.calls[1]).toEqual([1]);
    expect(fn.mock.calls[2]).toEqual([2]);

    expect(fn2.mock.calls[0]).toEqual([3]);
  });

  test('with default', () => {
    const fn = jest.fn();
    const [get, set] = buildRegFn('test', fn);
    get();
    get(1);
    get(2);

    const fn2 = jest.fn();
    set(fn2);
    get(3);

    expect(fn.mock.calls.length).toBe(3);
    expect(fn.mock.calls[0]).toEqual([]);
    expect(fn.mock.calls[1]).toEqual([1]);
    expect(fn.mock.calls[2]).toEqual([2]);

    expect(fn2.mock.calls[0]).toEqual([3]);
  });
});

describe('buildCachedRegFn should be ok', () => {
  test('normal', () => {
    const [get, set] = buildCachedRegFn('test');
    const fn = jest.fn();
    set(fn);
    get(1);

    const fn2 = jest.fn();
    set(fn2);
    get(2);

    expect(fn.mock.calls[0]).toEqual([1]);
    expect(fn2.mock.calls[0]).toEqual([2]);
  });

  test('should be cache value', () => {
    const [get, set] = buildCachedRegFn('test');
    const fn = jest.fn((v) => v);
    set(fn);
    const res1 = get(1);
    const res2 = get(1);

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0]).toEqual([1]);
    expect(res1).toBe(res2);
  });

  test('should be refresh if re-set', () => {
    const [get, set] = buildCachedRegFn('test');
    const fn = jest.fn((v) => v);
    set(fn);
    get(1);
    get(1);

    const fn2 = jest.fn((v) => v);
    set(fn2);
    get(1);
    get(1);

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0]).toEqual([1]);

    expect(fn2.mock.calls.length).toBe(1);
    expect(fn2.mock.calls[0]).toEqual([1]);
  });

  test('should call forever if return null', () => {
    const [get, set] = buildCachedRegFn('test');
    const fn = jest.fn(() => null);
    set(fn);

    get();
    get();
    get();
    expect(fn.mock.calls.length).toBe(3);
  });

  test('should call forever if return undefined', () => {
    const [get, set] = buildCachedRegFn('test');
    const fn = jest.fn(() => undefined);
    set(fn);

    get();
    get();
    get();
    expect(fn.mock.calls.length).toBe(3);
  });
});
