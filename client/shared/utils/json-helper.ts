/**
 * 判断是否是一个合法的json字符串
 * @param jsonStr json字符串
 */
export function isValidJson(jsonStr: string): boolean {
  if (typeof jsonStr !== 'string') {
    return false;
  }

  try {
    JSON.parse(jsonStr);
    return true;
  } catch (e) {
    return false;
  }
}
