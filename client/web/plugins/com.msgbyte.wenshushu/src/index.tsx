import { regChatInputAction } from '@capital/common';

regChatInputAction({
  label: '文叔叔',
  onClick: () => {
    const width = 1230; // 不支持手机UA
    const height = 736;
    const top = (window.screen.height - height) / 2;
    const left = (window.screen.width - width) / 2;

    window.open(
      'https://www.wenshushu.cn/',
      '文叔叔',
      buildWindowFeatures({
        top,
        left,
        width,
        height,
        menubar: false,
        toolbar: false,
        location: false,
        status: false,
        resizable: true,
      })
    );
  },
});

function buildWindowFeatures(
  options: Record<string, string | number | boolean>
): string {
  return Object.entries(options)
    .map(([key, val]) => `${key}=${val}`)
    .join(',');
}
