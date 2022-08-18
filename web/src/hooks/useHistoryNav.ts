import { urlSearchParse } from '@/utils/url-helper';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import minimatch from 'minimatch';
import { useUpdateRef } from 'tailchat-shared';

/**
 * 匹配地址导航
 *
 * 用于根据 ?nav=xxx 来自动打开代码中的某一个部件
 */
export function useHistoryNav(
  pattern: string,
  callback: (nav: string) => void
) {
  const location = useLocation();
  const prevNavRef = useRef(''); // 缓存上一波防止重复调用

  const callbackRef = useUpdateRef(callback);
  useEffect(() => {
    const { nav: navRaw } = urlSearchParse(location.search, {
      ignoreQueryPrefix: true,
    });
    const nav = String(navRaw);
    if (nav) {
      if (nav !== prevNavRef.current && minimatch(nav, pattern)) {
        callbackRef.current(nav);
      }

      prevNavRef.current = nav;
    }
  }, [location.search]);
}
