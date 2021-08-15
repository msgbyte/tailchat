import { fireEvent, render, act } from '@testing-library/react';
import React from 'react';
import { sleep } from 'tailchat-shared';
import { DelayTip } from '../DelayTip';

describe('DelayTip', () => {
  test('render', async () => {
    const wrapper = render(
      <DelayTip title="any tip">
        <div data-testid="inner" />
      </DelayTip>
    );
    expect(wrapper.container).toMatchSnapshot('default');

    act(() => {
      fireEvent.mouseEnter(wrapper.getByTestId('inner'));
    });

    await sleep(500);
    expect(wrapper.container).toMatchSnapshot('not open');

    await sleep(1500);
    expect(wrapper.container).toMatchSnapshot('open');
  });
});
