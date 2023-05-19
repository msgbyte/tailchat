const noConflictKey = '__';

/**
 * 因为微服务的名称中经常会有 `.` , 而 `.` 在一些场景(如lodash.set) 有特殊含义，因此增加一个工具用于解决这个问题
 */
export function encodeNoConflictServiceNameKey(key: string): string {
  return key.replaceAll('.', noConflictKey);
}

export function decodeNoConflictServiceNameKey(key: string): string {
  if (typeof key !== 'string') {
    return '';
  }

  return key.replaceAll(noConflictKey, '.');
}
