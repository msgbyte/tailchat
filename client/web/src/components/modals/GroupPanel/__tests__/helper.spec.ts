import { buildDataFromValues } from '../helper';

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
