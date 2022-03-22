import * as mkdirp from 'mkdirp';

/**
 * This is foo
 */
export function foo() {
  console.log('Anything');
  mkdirp('./foo/foo/foo/foo/foo/foo/foo');
}
