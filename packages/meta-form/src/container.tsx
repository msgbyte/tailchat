import type { ComponentType } from 'react';

/**
 * 容器配置
 */
export interface MetaFormContainerProps {
  loading: boolean;
  submitLabel?: string;

  layout?: 'horizontal' | 'vertical';

  /**
   * 是否允许提交
   */
  canSubmit?: boolean;
  handleSubmit: () => void;
}
export type MetaFormContainerComponent =
  React.ComponentType<MetaFormContainerProps>;
let MetaFormContainer: MetaFormContainerComponent;
export function regFormContainer(component: MetaFormContainerComponent) {
  MetaFormContainer = component;
}

export function getFormContainer():
  | ComponentType<MetaFormContainerProps>
  | undefined {
  return MetaFormContainer;
}
