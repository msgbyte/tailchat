/** Turns id into _id for search queries */
export default function convertId<T extends Record<string, unknown>>(obj: T) {
  if (obj.id) {
    const newObject = {
      _id: obj.id,
      ...obj,
    };

    delete newObject.id;
    return newObject;
  } else {
    return obj;
  }
}
