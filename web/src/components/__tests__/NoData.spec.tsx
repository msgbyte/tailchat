import { render } from '@testing-library/react';
import React from 'react';
import { NoData } from '../NoData';

describe('NoData', () => {
  test('render', () => {
    const wrapper = render(<NoData />);
    expect(wrapper.container).toMatchSnapshot();
  });

  test('render with text', () => {
    const wrapper = render(<NoData message="无数据" />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
