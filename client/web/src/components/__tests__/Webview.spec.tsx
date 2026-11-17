import { render } from '@testing-library/react';
import React from 'react';
import { Webview } from '../Webview';

describe('Webview', () => {
  test('does not load javascript: url', () => {
    const { container } = render(<Webview url="javascript:alert(1)" />);
    expect(container.querySelector('iframe')?.getAttribute('src')).toBe(
      'about:blank'
    );
  });

  test('loads https url', () => {
    const { container } = render(<Webview url="https://example.com/" />);
    expect(container.querySelector('iframe')?.getAttribute('src')).toBe(
      'https://example.com/'
    );
  });
});
