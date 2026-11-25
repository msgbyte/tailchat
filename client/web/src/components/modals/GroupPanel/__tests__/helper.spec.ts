import { buildDataFromValues, pickValuesFromGroupPanelInfo } from '../helper';
import { GroupPanelType } from 'tailchat-shared';
import type { GroupPanelSlowMode } from 'tailchat-shared';

jest.mock('@/plugin/common', () => ({
  pluginGroupPanel: [
    {
      name: 'fooPluginPanel',
      label: 'fooPluginPanelLabel',
      provider: 'foo',
    },
  ],
}));

describe('buildDataFromValues', () => {
  test.each([
    [
      { name: 'name', type: 0 },
      {
        name: 'name',
        type: 0,
        pluginPanelName: undefined,
        provider: undefined,
        meta: {},
      },
    ],
    [
      { name: 'name', type: 1 },
      {
        name: 'name',
        type: 1,
        pluginPanelName: undefined,
        provider: undefined,
        meta: {},
      },
    ],
    [
      {
        name: 'name',
        type: 0,
        slowMode: '' as unknown as GroupPanelSlowMode,
        permissionMap: { role1: ['core.viewPanel', 'core.message'] },
        fallbackPermissions: ['core.viewPanel'],
      },
      {
        name: 'name',
        type: 0,
        pluginPanelName: undefined,
        provider: undefined,
        meta: {},
        permissionMap: { role1: ['core.viewPanel', 'core.message'] },
        fallbackPermissions: ['core.viewPanel'],
      },
    ],
    [
      {
        name: 'name',
        type: 0,
        slowMode: undefined,
        extra: 'keep',
      },
      {
        name: 'name',
        type: 0,
        pluginPanelName: undefined,
        provider: undefined,
        meta: { extra: 'keep' },
      },
    ],
    [
      {
        name: 'name',
        type: 0,
        slowMode: null as unknown as GroupPanelSlowMode,
      },
      {
        name: 'name',
        type: 0,
        pluginPanelName: undefined,
        provider: undefined,
        meta: {},
      },
    ],
    [
      {
        name: 'name',
        type: 0,
        slowMode: { intervalSeconds: 60, maxMessages: 5 },
      },
      {
        name: 'name',
        type: 0,
        pluginPanelName: undefined,
        provider: undefined,
        meta: { slowMode: { intervalSeconds: 60, maxMessages: 5 } },
      },
    ],
    [
      {
        name: 'name',
        type: 1,
        slowMode: { intervalSeconds: 60, maxMessages: 5 },
      },
      {
        name: 'name',
        type: 1,
        pluginPanelName: undefined,
        provider: undefined,
        meta: {},
      },
    ],
    [
      { name: 'name', type: 'fooPluginPanel' },
      {
        name: 'name',
        type: 2,
        pluginPanelName: 'fooPluginPanel',
        provider: 'foo',
        meta: {},
      },
    ],
  ])('%o', (input, output) => {
    expect(buildDataFromValues(input)).toEqual(output);
  });
});

describe('pickValuesFromGroupPanelInfo', () => {
  test('explicitly sets slowMode to undefined when panel meta has no slowMode', () => {
    const values = pickValuesFromGroupPanelInfo({
      id: 'panel-1',
      name: '中文公告',
      type: GroupPanelType.TEXT,
    });

    expect(Object.prototype.hasOwnProperty.call(values, 'slowMode')).toBe(true);
    expect(values.slowMode).toBeUndefined();
  });

  test('normalizes invalid slowMode in meta to undefined', () => {
    const values = pickValuesFromGroupPanelInfo({
      id: 'panel-1',
      name: '中文公告',
      type: GroupPanelType.TEXT,
      meta: {
        slowMode: '' as unknown as GroupPanelSlowMode,
      },
    });

    expect(values.slowMode).toBeUndefined();
  });

  test('preserves valid slowMode in meta', () => {
    const values = pickValuesFromGroupPanelInfo({
      id: 'panel-1',
      name: '中文公告',
      type: GroupPanelType.TEXT,
      meta: {
        slowMode: { intervalSeconds: 300, maxMessages: 3 },
      },
    });

    expect(values.slowMode).toEqual({ intervalSeconds: 300, maxMessages: 3 });
  });
});
