import { render } from '@testing-library/react';
import React from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  test('render', () => {
    const wrapper = render(<LoadingSpinner />);
    expect(wrapper.container).toMatchSnapshot();
  });

  test('render with text', () => {
    const wrapper = render(<LoadingSpinner tip="加载中..." />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
