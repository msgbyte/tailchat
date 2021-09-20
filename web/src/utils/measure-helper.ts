import { useLayoutEffect } from 'react';

const records: Record<string, number> = {};

/**
 * 记录测量点
 * @param name 测量点唯一名
 */
export function recordMeasure(name: string) {
  if (!records[name]) {
    records[name] = performance.now();
  }
}

/**
 * 记录测量点(hook)
 * @param name 测量点唯一名
 */
export function useRecordMeasure(name: string) {
  useLayoutEffect(() => {
    recordMeasure(name);
  }, []);
}

export const measure = {
  getRecord: () => ({ ...records }),
  getTimeUsage() {
    let t = performance.timing;

    const usage = {
      // DNS查询耗时
      dnsUsage: t.domainLookupEnd - t.domainLookupStart,

      // TCP链接耗时
      tcpUsage: t.connectEnd - t.connectStart,

      // request请求耗时
      requestUsage: t.responseEnd - t.responseStart,

      // 解析dom树耗时
      parseDOMUsage: t.domComplete - t.domInteractive,

      // 白屏时间
      firstPaintTime: t.responseStart - t.navigationStart,

      // domready时间
      domReadyTime: t.domContentLoadedEventEnd - t.navigationStart,

      // onload 时间
      onloadTime: t.loadEventEnd - t.navigationStart,
    };

    if ((t = performance.memory)) {
      // js内存使用占比
      usage['jsHeapRatio'] = t.usedJSHeapSize / t.totalJSHeapSize;
    }

    return usage;
  },
};
