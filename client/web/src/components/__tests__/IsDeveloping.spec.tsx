import { render } from '@testing-library/react';
import React from 'react';
import { IsDeveloping } from '../IsDeveloping';

describe('IsDeveloping', () => {
  test('render', () => {
    const wrapper = render(<IsDeveloping />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
