/**
 * JavaScript 中的 sleep 函数
 * 参考 https://github.com/sqren/await-sleep/blob/master/index.js
 * @param milliseconds 阻塞毫秒
 */
export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
