interface QueueItem<T, R> {
  params: T;
  resolve: (r: R) => void;
  reject: (reason: any) => void;
}

/**
 * 创建一个自动合并请求的函数
 * 在一定窗口期内的所有请求都会被合并提交合并发送
 * @param fn 合并后的请求函数
 * @param windowMs 窗口期
 */
export function createAutoMergedRequest<T, R>(
  fn: (mergedParams: T[]) => Promise<R[]>,
  windowMs = 200
): (params: T) => Promise<R> {
  let queue: QueueItem<T, R>[] = [];
  let timer: number;

  async function submitQueue() {
    const _queue = [...queue];
    queue = []; // 清空队列
    const ret = fn(_queue.map((q) => q.params));

    try {
      const list = await ret;
      _queue.forEach((q_1, i) => {
        q_1.resolve(list[i]);
      });
    } catch (err) {
      _queue.forEach((q_2) => {
        q_2.reject(err);
      });
    }
  }

  return (params: T): Promise<R> => {
    if (!timer) {
      // 如果没有开始窗口期，则创建
      timer = window.setTimeout(() => {
        submitQueue();
      }, windowMs);
    }

    return new Promise<R>((resolve, reject) => {
      queue.push({
        params,
        resolve,
        reject,
      });
    });
  };
}
