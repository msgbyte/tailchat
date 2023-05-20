export default function virtualId<T extends { _id: string }>(
  arr: T[]
): Array<T & { id: string }>;
export default function virtualId<T extends { _id: string }>(
  doc: T
): T & { id: string };

/** Virtual ID (_id to id) for react-admin */
export default function virtualId<T extends { _id: string }>(el: Array<T> | T) {
  if (Array.isArray(el)) {
    return el.map((e) => {
      return {
        id: e._id,
        ...e,
        _id: undefined,
      };
    });
  }

  return { id: el._id, ...el, _id: undefined };
}
