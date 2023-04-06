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

/**
 * 一个快捷方案用于直接在组件中执行 preventDefault
 */
export function preventDefault(e: React.BaseSyntheticEvent) {
  e.preventDefault();
}

/**
 * 获取元素所有的DOM父节点列表
 */
export function getDOMParentPath(el: HTMLElement): HTMLElement[] {
  const path: HTMLElement[] = [];
  let parent = el.parentElement;
  while (parent) {
    path.unshift(parent);
    parent = parent.parentElement;
  }

  return path;
}

/**
 * 创建一个RAF循环
 * @param loopFn 循环函数，在关闭前之前会执行最后一次
 * @returns
 */
export function createRAFLoop<T extends unknown[]>(
  loopFn: (...args: T) => void
) {
  let flag = false;

  const loop = (...args: T) => {
    if (flag === false) {
      return;
    }

    loopFn(...args);

    requestAnimationFrame(() => {
      loop(...args);
    });
  };

  return {
    start: (...args: T) => {
      flag = true;
      loop(...args);
    },
    end: () => {
      requestAnimationFrame(() => {
        flag = false;
      });
    },
  };
}
