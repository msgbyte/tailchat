/**
 * 获取校验状态
 */
export function getValidateStatus(error: string | undefined): 'error' | '' {
  if (error === undefined || error === '') {
    return '';
  } else {
    return 'error';
  }
}
