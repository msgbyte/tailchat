/**
 * 构建一组注册Mapping的方式
 * 用于从其他地方统一获取数据
 */
export function buildRegMap<T>(): [
  Record<string, T>,
  (name: string, item: T) => void
] {
  const mapping: Record<string, T> = {};

  const reg = (name: string, item: T) => {
    if (mapping[name]) {
      console.warn('[buildRegMap] 重复注册:', name);
    }

    mapping[name] = item;
  };

  return [mapping, reg];
}
