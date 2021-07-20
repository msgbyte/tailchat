import { render } from '@testing-library/react';
import React from 'react';
import { Highlight } from '../Highlight';

describe('Highlight', () => {
  test('render', () => {
    const wrapper = render(<Highlight>Any Text</Highlight>);
    expect(wrapper.container).toMatchSnapshot();
  });
});
