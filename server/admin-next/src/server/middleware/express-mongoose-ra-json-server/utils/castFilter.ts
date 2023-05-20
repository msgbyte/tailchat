import { ADPBaseModel } from './baseModel.interface';

/**
 * Turns all the params into their proper types, string into regexes.
 * Only works with shallow objects.
 * Mutates original object and returns mutated object.
 */
export default function castFilter<T extends ADPBaseModel>(
  obj: Record<string, any>,
  model: T,
  allowedRegexes: string[] = []
) {
  const { path } = model.schema;
  Object.keys(obj).forEach((key) => {
    try {
      obj[key] = path(key).cast(obj[key], null, null);
    } catch (e) {}

    if (allowedRegexes.includes(key) && typeof obj[key] === 'string') {
      obj[key] = new RegExp(escapeStringRegexp(obj[key]));
    }
  });

  return obj;
}

function escapeStringRegexp(string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  }

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}
