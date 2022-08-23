import { render } from '@testing-library/react';
import React, { Suspense } from 'react';
import { sleep } from 'tailchat-shared';

/**
 * 在普通的组件上面加一个 Suspense
 */
export function renderWithSuspense(ui: React.ReactElement) {
  return render(ui, {
    wrapper: (props) => (
      <Suspense fallback="JestLoading">{props.children}</Suspense>
    ),
  });
}

/**
 * 渲染一个懒加载组件
 */
export async function renderLazy(ui: React.ReactElement, ms = 400) {
  const wrapper = renderWithSuspense(ui);
  await sleep(ms);

  return wrapper;
}
