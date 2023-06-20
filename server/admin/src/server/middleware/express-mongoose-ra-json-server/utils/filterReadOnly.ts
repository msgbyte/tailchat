/** Makes sure that it does not modify crucial and sacred parts mutates the original object. */
export function filterReadOnly<T extends {}>(
  obj: T,
  readOnlyFields?: string[]
) {
  if (!readOnlyFields) return obj as T;

  readOnlyFields.forEach((v) => {
    delete obj[v];
  });

  return obj as Partial<T>;
}
