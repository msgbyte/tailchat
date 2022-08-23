import { render } from '@testing-library/react';
import React from 'react';
import { PillTabs, PillTabPane } from '../PillTabs';

describe('PillTabs', () => {
  test('render', () => {
    const wrapper = render(
      <PillTabs>
        <PillTabPane tab="t1" key="1">
          1
        </PillTabPane>
        <PillTabPane tab="t2" key="2">
          2
        </PillTabPane>
      </PillTabs>
    );
    expect(wrapper.container).toMatchSnapshot();
  });
});
