import { render } from '@testing-library/react';
import React from 'react';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  test('render', () => {
    const wrapper = render(<Spinner />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
