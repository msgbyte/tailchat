import { render } from '@testing-library/react';
import React from 'react';
import { GroupPanel, GroupPanelType } from 'tailchat-shared';
import { GroupPanelTree } from '../GroupPanelTree';

const testGroupPanels: GroupPanel[] = [
  {
    id: '00',
    name: 'section-1',
    type: GroupPanelType.GROUP,
  },
  {
    id: '01',
    name: 'panel-01',
    type: GroupPanelType.TEXT,
    parentId: '00',
  },
  {
    id: '02',
    name: 'panel-02',
    type: GroupPanelType.TEXT,
    parentId: '00',
  },
  {
    id: '10',
    name: 'section-2',
    type: GroupPanelType.GROUP,
  },
  {
    id: '11',
    name: 'panel-11',
    type: GroupPanelType.TEXT,
    parentId: '10',
  },
  {
    id: '12',
    name: 'panel-12',
    type: GroupPanelType.TEXT,
    parentId: '10',
  },
];

describe('GroupPanelTree', () => {
  test('simple render snapshot', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <GroupPanelTree
        groupId={'fakeGroupId'}
        groupPanels={testGroupPanels}
        onChange={onChange}
      />
    );

    expect(wrapper.container).toMatchSnapshot();
  });
});
