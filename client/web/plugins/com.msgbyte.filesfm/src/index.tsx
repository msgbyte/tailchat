import { regChatInputAction } from '@capital/common';

regChatInputAction({
  label: 'files.fm',
  onClick: () => {
    const width = 414;
    const height = 736;
    const top = (window.screen.height - height) / 2;
    const left = (window.screen.width - width) / 2;

    window.open(
      'https://files.fm/',
      'files.fm',
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
