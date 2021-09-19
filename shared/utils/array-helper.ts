import _flatten from 'lodash/flatten';

/**
 * 类似于join，但是返回一个数组
 * join会将元素强制转化为字符串
 */
export function joinArray<T, K>(arr: T[], separator: K): (T | K)[] {
  return _flatten(
    arr.map((item, i) => {
      if (i === 0) {
        return [item];
      } else {
        return [separator, item];
      }
    })
  );
}
