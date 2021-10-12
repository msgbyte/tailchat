/**
 * 返回tailchat逻辑根节点
 * 如果找不到根节点则返回body
 */
export function getPopupContainer() {
  const appRoot = document.querySelector<HTMLElement>('#tailchat-app');
  if (appRoot) {
    return appRoot;
  }

  return document.body;
}

/**
 * 一个快捷方案用于直接在组件中执行 stopPropagation
 */
export function stopPropagation(e: React.BaseSyntheticEvent) {
  e.stopPropagation();
}
