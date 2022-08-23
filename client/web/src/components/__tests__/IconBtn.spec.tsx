import { render } from '@testing-library/react';
import React from 'react';
import { IconBtn } from '../IconBtn';

describe('IconBtn', () => {
  test('render', () => {
    const wrapper = render(<IconBtn icon="mdi:close" />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
