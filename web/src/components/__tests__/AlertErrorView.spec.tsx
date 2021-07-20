import { render } from '@testing-library/react';
import React from 'react';
import { AlertErrorView } from '../AlertErrorView';

describe('AlertErrorView', () => {
  test('render', () => {
    const wrapper = render(<AlertErrorView error={new Error('Dummy Error')} />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
