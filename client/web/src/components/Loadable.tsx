import React from 'react';
import loadable, {
  DefaultComponent,
  LoadableComponent,
  OptionsWithoutResolver,
} from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingSpinner } from './LoadingSpinner';
import { isValidStr, t } from 'tailchat-shared';
import { message } from 'antd';
import _uniqueId from 'lodash/uniqueId';

function promiseUsage<T>(p: Promise<T>, name: string): Promise<T> {
  const start = new Date().valueOf();

  return p.then((r) => {
    const end = new Date().valueOf();

    console.debug(`[Loadable] load ${name} usage: ${end - start}ms`);

    return r;
  });
}

function promiseLoading<T>(p: Promise<T>): Promise<T> {
  const key = _uniqueId('Loadable');
  message.loading({
    content: t('加载中...'),
    key,
    duration: 0,
  });

  return p.then((r) => {
    message.destroy(key);

    return r;
  });
}

interface LoadableOptions<P> extends OptionsWithoutResolver<P> {
  /**
   * 组件名, 如果传入则会记录组件加载用时
   * 用于权衡组件大小
   */
  componentName?: string;

  /**
   * 加载过程中显示 loading
   * 一般用于 modal
   */
  showLoading?: boolean;
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

      if (options?.showLoading === true) {
        p = promiseLoading(p);
      }

      return pMinDelay(p, 200, { delayRejection: false });
    },
    {
      fallback: <LoadingSpinner />,
      ...options,
    }
  );
}
