import * as mkdirp from 'mkdirp';

/**
 * This is foo
 */
export function foo(input: string) {
  console.log('Anything', input);
  mkdirp('./foo/foo/foo/foo/foo/foo/foo');

  return input + 1;
}

export const fooVar = 'fooVar' as string;
