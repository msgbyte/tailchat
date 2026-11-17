import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BBCode from '../render';

describe('render <BBCode />', () => {
  test('mention with space name', () => {
    const raw = '[at=6251986eab331ca2efbba9c6]Notify Bot[/at] 123123';
    const wrapper = render(<BBCode plainText={raw} />);
    expect(wrapper.container).toMatchSnapshot();
  });

  test('url with javascript scheme is not rendered as a link', () => {
    const { container } = render(
      <BBCode plainText="[url=javascript:alert(1)]click[/url]" />
    );
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toContain('click');
  });

  test('origin prefix cannot smuggle a javascript url into an internal link', () => {
    const { container } = render(
      <BBCode
        plainText={`[url=${window.location.origin}javascript:alert(1)]click[/url]`}
      />
    );
    for (const a of Array.from(container.querySelectorAll('a'))) {
      expect(a.getAttribute('href')).not.toMatch(/^\s*javascript:/i);
    }
  });

  test.each(['//evil.example/login', '/\\evil.example/login'])(
    'protocol-relative url %s opens as an external link',
    (url) => {
      const { container } = render(
        <BBCode plainText={`[url=${url}]x[/url]`} />
      );
      expect(container.querySelector('a')?.getAttribute('target')).toBe(
        '_blank'
      );
    }
  );

  test('internal path is rendered as a router link', () => {
    const { container } = render(
      <MemoryRouter>
        <BBCode plainText="[url=/main/personal/friends]friends[/url]" />
      </MemoryRouter>
    );
    const a = container.querySelector('a');
    expect(a?.getAttribute('href')).toBe('/main/personal/friends');
    expect(a?.getAttribute('target')).toBeNull();
  });

  test('url with https scheme is rendered as a link', () => {
    const { container } = render(
      <BBCode plainText="[url=https://example.com/a]site[/url]" />
    );
    expect(container.querySelector('a')?.getAttribute('href')).toBe(
      'https://example.com/a'
    );
  });
});
