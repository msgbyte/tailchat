import React from 'react';
import loadable, {
  DefaultComponent,
  LoadableComponent,
  OptionsWithoutResolver,
} from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingSpinner } from './LoadingSpinner';
import { isValidStr } from 'tailchat-shared';

function promiseUsage<T>(p: Promise<T>, name: string): Promise<T> {
  const start = new Date().valueOf();

  return p.then((r) => {
    const end = new Date().valueOf();

    console.debug(`[Loadable] load ${name} usage: ${end - start}ms`);

    return r;
  });
}

interface LoadableOptions<P> extends OptionsWithoutResolver<P> {
  /**
   * 组件名, 如果传入则会记录组件加载用时
   * 用于权衡组件大小
   */
  componentName?: string;
}

/**
 * 用法: Loadable(() => import('xxxxxx'))
 * @param loader 需要懒加载的组件
 */
export function Loadable<Props>(
  loadFn: (props: Props) => Promise<DefaultComponent<Props>>,
  options?: LoadableOptions<Props>
): LoadableComponent<Props> {
  return loadable(
    (props) => {
      let p = loadFn(props);

      if (isValidStr(options?.componentName)) {
        // 增加promise加载用时统计
        p = promiseUsage(p, String(options?.componentName));
      }

      return pMinDelay(p, 200, { delayRejection: false });
    },
    {
      fallback: <LoadingSpinner />,
      ...options,
    }
  );
}
