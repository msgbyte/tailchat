/**
 * This is bar
 */
export function bar() {
  console.log('Anything else');
}

interface E {
  f: symbol;
}

interface Options {
  a: number;
  b: string;
  c: {
    d: string;
    e: E;
  };
}

/**
 * This is bar with complex input
 */
export function complexBar(input: Options) {
  console.log('Anything else', input);
}
