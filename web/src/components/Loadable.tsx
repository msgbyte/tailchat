import React from 'react';
import loadable, {
  DefaultComponent,
  LoadableComponent,
} from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * 用法: Loadable(() => import('xxxxxx'))
 * @param loader 需要懒加载的组件
 */
export function Loadable<Props>(
  loadFn: (props: Props) => Promise<DefaultComponent<Props>>
): LoadableComponent<Props> {
  return loadable((props) => pMinDelay(loadFn(props), 200), {
    fallback: <LoadingSpinner />,
  });
}
