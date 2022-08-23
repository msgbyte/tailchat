import { t } from '../i18n';
import { buildRegFn } from './buildRegFn';

/**
 * 通用UI api设置
 */

type ToastsType = 'info' | 'success' | 'error' | 'warning';
export const [showToasts, setToasts] =
  buildRegFn<(message: string, type?: ToastsType) => void>('toasts');

/**
 * 一个封装方法, 用于直接抛出错误
 * @param error 错误信息
 */
export function showErrorToasts(error: unknown) {
  let msg = '';
  if (error instanceof Error) {
    msg = error.message;
  } else {
    msg = String(error);
  }

  showToasts(msg, 'error');
}

/**
 * 展示成功消息
 */
export function showSuccessToasts(msg = t('操作成功')) {
  showToasts(msg, 'success');
}

interface AlertOptions {
  message: React.ReactNode;
  onConfirm?: () => void | Promise<void>;
}
export const [showAlert, setAlert] =
  buildRegFn<(options: AlertOptions) => void>('alert');

/**
 * 全局Loading提示
 * 返回移除函数
 */
export const [showGlobalLoading, setGlobalLoading] = buildRegFn<
  (text: string) => () => void
>('global-loading', () => {
  return () => {};
});
