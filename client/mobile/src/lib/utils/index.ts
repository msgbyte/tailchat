import urlRegex from 'url-regex';
import _flatten from 'lodash/flatten';

/**
 * 判断是否是一个可用的url
 */
export function isValidUrl(str: unknown): str is string {
  return typeof str === 'string' && urlRegex({ exact: true }).test(str);
}

export function normalize(path: string) {
  const components: string[] = [];
  for (const component of `${path}`.split(/\/+/g)) {
    if (component === '.') {
    } else if (component === '..') {
      components.pop();
    } else {
      components.push(component);
    }
  }
  let normalized = (
    (path.startsWith('/') ? '/' : '') + components.join('/')
  ).replace(/\/\/+/g, '/');
  return normalized || '.';
}

export function urlResolve(...str: string[]) {
  const flatten = _flatten(str).reduce((previous, current) => {
    if (/^\//.test(current)) {
      return current;
    }
    return `${previous}/${current}`;
  });
  return normalize(flatten);
}
