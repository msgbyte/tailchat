import React from 'react';
import { render } from '@testing-library/react';
import { GroupCustomWebPanelRender, xss } from './GroupCustomWebPanelRender';

jest.mock('@capital/common', () => ({
  useWatch: jest.fn(),
  localTrans: (trans: Record<string, string>) => trans['en-US'],
}));
jest.mock('@capital/component', () => ({
  GroupExtraDataPanel: () => null,
  NoData: () => null,
  TextArea: () => null,
}));

describe('GroupCustomWebPanelRender', () => {
  it.each([
    '<body onload="alert(1)">',
    '<html onmouseover="alert(1)">x</html>',
    '<style onload="alert(1)"></style>',
    '<meta http-equiv="refresh" content="0;url=https://evil.example">',
  ])('strips unsafe attributes from document tags: %s', (payload) => {
    expect(xss.process(payload)).not.toMatch(/onload|onmouseover|http-equiv/);
  });

  it('renders html in a sandbox without same-origin access', () => {
    const { container } = render(
      <GroupCustomWebPanelRender html="<body><p>hi</p></body>" />
    );
    const iframe = container.querySelector('iframe')!;

    expect(iframe.getAttribute('sandbox')).not.toContain('allow-same-origin');
    expect(iframe.getAttribute('srcdoc')).toContain('<body><p>hi</p></body>');
  });
});
