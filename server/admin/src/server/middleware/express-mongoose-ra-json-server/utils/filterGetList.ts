export const filterGetListParams = [
  '_sort',
  '_order',
  '_start',
  '_end',
] as const;

/** Removes _sort, _order, _start, _end from a query. */
export default function filterGetList<T extends Record<string, unknown>>(
  obj: T
) {
  const filtered: any = {};
  Object.entries(obj).forEach(([index, value]) => {
    if (!filterGetListParams.includes(index as any)) filtered[index] = value;
  });
  return filtered as Omit<T, (typeof filterGetListParams)[number]>;
}
