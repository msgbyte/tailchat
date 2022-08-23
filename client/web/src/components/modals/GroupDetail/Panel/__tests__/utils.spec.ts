import { GroupPanel, GroupPanelType } from 'tailchat-shared';
import { rebuildGroupPanelOrder } from '../utils';

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

describe('rebuildGroupPanelOrder', () => {
  test('ref is changed', () => {
    expect(rebuildGroupPanelOrder(testGroupPanels)).not.toBe(testGroupPanels);
    expect(rebuildGroupPanelOrder(testGroupPanels)[0]).not.toBe(
      testGroupPanels[0]
    );
  });

  test('keep order if right', () => {
    expect(rebuildGroupPanelOrder(testGroupPanels)).toEqual(testGroupPanels);
  });

  test('child should after parent', () => {
    expect(
      rebuildGroupPanelOrder([testGroupPanels[1], testGroupPanels[0]])
    ).toEqual([testGroupPanels[0], testGroupPanels[1]]);
  });

  test('switch position should keep origin order', () => {
    expect(
      rebuildGroupPanelOrder([
        testGroupPanels[1],
        testGroupPanels[2],
        testGroupPanels[0],
      ])
    ).toEqual([testGroupPanels[0], testGroupPanels[1], testGroupPanels[2]]);
  });

  test('switch position should keep origin order(group)', () => {
    expect(
      rebuildGroupPanelOrder([
        testGroupPanels[1],
        testGroupPanels[2],
        testGroupPanels[0],
        testGroupPanels[3],
      ])
    ).toEqual([
      testGroupPanels[0],
      testGroupPanels[1],
      testGroupPanels[2],
      testGroupPanels[3],
    ]);
  });
});
