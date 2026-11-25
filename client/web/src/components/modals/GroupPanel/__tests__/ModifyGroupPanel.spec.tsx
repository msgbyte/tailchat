import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ALL_PERMISSION, GroupPanel, GroupPanelType } from 'tailchat-shared';
import { ModalModifyGroupPanel } from '../ModifyGroupPanel';

const mockModifyGroupPanel = jest.fn();
const mockShowToasts = jest.fn();
let mockPanelInfo: GroupPanel | null = null;

jest.mock('tailchat-shared', () => {
  const actual = jest.requireActual('tailchat-shared');
  return {
    ...actual,
    t: (text: string) => text,
    modifyGroupPanel: (...args: unknown[]) => mockModifyGroupPanel(...args),
    showToasts: (...args: unknown[]) => mockShowToasts(...args),
    useGroupPanelInfo: () => mockPanelInfo,
  };
});

jest.mock('@/plugin/common', () => ({
  pluginGroupPanel: [],
}));

jest.mock('../../../Modal', () => ({
  ModalWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('@/components/CollapseView', () => ({
  CollapseView: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('../AdvanceGroupPanelPermission', () => ({
  AdvanceGroupPanelPermission: ({
    onChange,
  }: {
    onChange: (permissionMap: Record<string, string[]> | undefined) => void;
  }) => (
    <button
      type="button"
      onClick={() =>
        onChange({
          [ALL_PERMISSION]: ['core.viewPanel'],
          role1: ['core.viewPanel', 'core.message'],
        })
      }
    >
      Grant View Permission
    </button>
  ),
}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

beforeEach(() => {
  mockModifyGroupPanel.mockReset().mockResolvedValue(undefined);
  mockShowToasts.mockReset();
  mockPanelInfo = {
    id: 'panel-1',
    name: '中文公告',
    type: GroupPanelType.TEXT,
  };
});

describe('ModalModifyGroupPanel', () => {
  test('omits slowMode when updating panel viewing permissions with slow mode disabled', async () => {
    const onSuccess = jest.fn();

    render(
      <ModalModifyGroupPanel
        groupId="group-1"
        groupPanelId="panel-1"
        onSuccess={onSuccess}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Grant View Permission' })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockModifyGroupPanel).toHaveBeenCalledTimes(1);
    });

    expect(mockModifyGroupPanel).toHaveBeenCalledWith('group-1', 'panel-1', {
      name: '中文公告',
      type: GroupPanelType.TEXT,
      provider: undefined,
      pluginPanelName: undefined,
      meta: {},
      permissionMap: {
        role1: ['core.viewPanel', 'core.message'],
      },
      fallbackPermissions: ['core.viewPanel'],
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  test('preserves updated permissions when editing other form fields afterwards', async () => {
    mockPanelInfo = {
      id: 'panel-1',
      name: '中文公告',
      type: GroupPanelType.TEXT,
      fallbackPermissions: [],
      permissionMap: {},
    };

    render(<ModalModifyGroupPanel groupId="group-1" groupPanelId="panel-1" />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Grant View Permission' })
    );

    const slowModeSwitch = screen.getByRole('switch', {
      name: '开启慢速模式',
    });
    fireEvent.click(slowModeSwitch);
    fireEvent.click(slowModeSwitch);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockModifyGroupPanel).toHaveBeenCalledTimes(1);
    });

    expect(mockModifyGroupPanel).toHaveBeenCalledWith('group-1', 'panel-1', {
      name: '中文公告',
      type: GroupPanelType.TEXT,
      provider: undefined,
      pluginPanelName: undefined,
      meta: {},
      permissionMap: {
        role1: ['core.viewPanel', 'core.message'],
      },
      fallbackPermissions: ['core.viewPanel'],
    });
  });

  test('preserves existing valid slowMode when updating panel permissions', async () => {
    mockPanelInfo = {
      id: 'panel-1',
      name: '中文公告',
      type: GroupPanelType.TEXT,
      meta: {
        slowMode: { intervalSeconds: 300, maxMessages: 3 },
      },
    };

    render(<ModalModifyGroupPanel groupId="group-1" groupPanelId="panel-1" />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Grant View Permission' })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockModifyGroupPanel).toHaveBeenCalledTimes(1);
    });

    expect(mockModifyGroupPanel).toHaveBeenCalledWith('group-1', 'panel-1', {
      name: '中文公告',
      type: GroupPanelType.TEXT,
      provider: undefined,
      pluginPanelName: undefined,
      meta: {
        slowMode: { intervalSeconds: 300, maxMessages: 3 },
      },
      permissionMap: {
        role1: ['core.viewPanel', 'core.message'],
      },
      fallbackPermissions: ['core.viewPanel'],
    });
  });

  test('retains existing permissions when groupPanelInfo loads asynchronously', async () => {
    mockPanelInfo = null;

    const { rerender } = render(
      <ModalModifyGroupPanel groupId="group-1" groupPanelId="panel-1" />
    );

    mockPanelInfo = {
      id: 'panel-1',
      name: '中文公告',
      type: GroupPanelType.TEXT,
      permissionMap: {
        role1: ['core.viewPanel', 'core.message'],
      },
      fallbackPermissions: ['core.viewPanel'],
    };

    rerender(
      <ModalModifyGroupPanel
        groupId="group-1"
        groupPanelId="panel-1"
        onSuccess={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockModifyGroupPanel).toHaveBeenCalledTimes(1);
    });

    expect(mockModifyGroupPanel).toHaveBeenCalledWith('group-1', 'panel-1', {
      name: '中文公告',
      type: GroupPanelType.TEXT,
      provider: undefined,
      pluginPanelName: undefined,
      meta: {},
      permissionMap: {
        role1: ['core.viewPanel', 'core.message'],
      },
      fallbackPermissions: ['core.viewPanel'],
    });
  });
});
