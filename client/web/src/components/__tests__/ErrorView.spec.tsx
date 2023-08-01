import { render } from '@testing-library/react';
import React from 'react';
import { ErrorView } from '../ErrorView';

describe('ErrorView', () => {
  test('render', () => {
    const wrapper = render(<ErrorView error={new Error('Dummy Error')} />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
