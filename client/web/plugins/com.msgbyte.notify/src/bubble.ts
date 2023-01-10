import tinycon from 'tinycon';

/**
 * 设置小红点
 * @param num 小红点数
 */
let bubbleNum = 0;
export function setBubble(num: number) {
  bubbleNum = num;
  if (num < 0) {
    num = 0;
  }
  tinycon.setBubble(num >= 100 ? 99 : num);
}

/**
 * 增加小红点数量
 */
export function incBubble() {
  setBubble(bubbleNum + 1);
}

const hiddenProperty =
  'hidden' in document
    ? 'hidden'
    : 'webkitHidden' in document
    ? 'webkitHidden'
    : 'mozHidden' in document
    ? 'mozHidden'
    : null;
const visibilityChangeEvent = hiddenProperty?.replace(
  /hidden/i,
  'visibilitychange'
);
const onVisibilityChange = function () {
  if (!document[hiddenProperty ?? '']) {
    // 显示标签页时清空
    tinycon.setBubble(0);
  } else {
    // 隐藏标签页
  }
};
if (typeof visibilityChangeEvent === 'string') {
  document.addEventListener(visibilityChangeEvent, onVisibilityChange);
}
