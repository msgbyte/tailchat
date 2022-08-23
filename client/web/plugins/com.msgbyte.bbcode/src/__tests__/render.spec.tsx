import { render } from '@testing-library/react';
import React from 'react';
import BBCode from '../render';

describe('render <BBCode />', () => {
  test('mention with space name', () => {
    const raw = '[at=6251986eab331ca2efbba9c6]Notify Bot[/at] 123123';
    const wrapper = render(<BBCode plainText={raw} />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
