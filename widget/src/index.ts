interface TailchatWidgetOptions {
  /**
   * @default https://nightly.paw.msgbyte.com/
   */
  host?: string;
  groupId: string;
  channelId: string;
  style: Partial<CSSStyleDeclaration>;
}

const defaultTailchatWidgetOptions: Partial<TailchatWidgetOptions> = {
  host: 'https://nightly.paw.msgbyte.com/',
};

const containerSize = 48;
const defaultTailchatWidgetStyle: Partial<CSSStyleDeclaration> = {
  position: 'absolute',
  right: '20px',
  bottom: '20px',
  width: `${containerSize}px`,
  height: `${containerSize}px`,
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const iconSize = 32;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="${iconSize}" height="${iconSize}" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 3C6.5 3 2 6.58 2 11a7.218 7.218 0 0 0 2.75 5.5c0 .6-.42 2.17-2.75 4.5c2.37-.11 4.64-1 6.47-2.5c1.14.33 2.34.5 3.53.5c5.5 0 10-3.58 10-8s-4.5-8-10-8m0 14c-4.42 0-8-2.69-8-6s3.58-6 8-6s8 2.69 8 6s-3.58 6-8 6m5-5v-2h-2v2h2m-4 0v-2h-2v2h2m-4 0v-2H7v2h2z" fill="currentColor"/></svg>`;

/**
 * 创建聊天小部件
 */
export function createTailchatWidget(_options: TailchatWidgetOptions) {
  const options = { ...defaultTailchatWidgetOptions, ..._options };

  const url = `${options.host}${options.groupId}/${options.channelId}`;

  const container = document.createElement('div');

  // 设置容器样式
  const style = { ...defaultTailchatWidgetStyle, ..._options.style };
  for (const key in style) {
    const val = style[key];
    if (typeof val === 'string') {
      container.style[key] = val;
    }
  }
  container.innerHTML = iconSvg;

  document.body.appendChild(container);
}
