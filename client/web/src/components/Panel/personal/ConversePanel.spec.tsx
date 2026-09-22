import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { showAlert } from 'tailchat-shared';
import { request } from 'tailchat-shared/api/request';
import { ChatConverseType } from 'tailchat-shared/model/converse';
import { appReducer, chatActions } from 'tailchat-shared/redux/slices';
import { getReduxStore, ReduxProvider } from 'tailchat-shared/redux/store';
import { ConversePanel } from './ConversePanel';
import { queryClient } from 'tailchat-shared/cache';
import { refreshDMConverse } from 'tailchat-shared/helper/converse-helper';

jest.mock('tailchat-shared/api/request', () => ({
  request: { get: jest.fn(), post: jest.fn() },
}));
jest.mock('tailchat-shared', () => ({
  ...jest.requireActual('tailchat-shared/redux/hooks/useAppSelector'),
  model: { converse: jest.requireActual('tailchat-shared/model/converse') },
  t: (text: string) => text,
  useUserId: () => 'me',
  useUserInfoList: () => [],
  useDMConverseName: () => 'Conversation',
  showAlert: jest.fn(),
}));
jest.mock('@/components/ChatBox', () => ({
  ChatBox: () => <div>Messages</div>,
}));
jest.mock('@/components/ChatBox/ChatInputBox/context', () => ({
  ChatInputMentionsContextProvider: ({ children }: any) => children,
}));
jest.mock('@/components/IconBtn', () => ({
  IconBtn: ({ title, onClick }: any) => (
    <button onClick={onClick}>{title}</button>
  ),
}));
jest.mock('@/components/UserListItem', () => ({ UserListItem: () => null }));
jest.mock('@/components/Modal', () => ({ openModal: jest.fn() }));
jest.mock('@/components/modals/AppendDMConverseMembers', () => ({
  AppendDMConverseMembers: () => null,
}));
jest.mock('@/components/modals/CreateDMConverse', () => ({
  CreateDMConverse: () => null,
}));
jest.mock('@/components/OpenedPanelTip', () => ({
  OpenedPanelTip: () => null,
}));
jest.mock('@/hooks/usePanelWindow', () => ({
  usePanelWindow: () => ({ hasOpenedPanel: false }),
}));
jest.mock('@/plugin/common', () => ({ pluginPanelActions: [] }));
jest.mock('../common/MessageSearch', () => ({
  MessageSearchPanel: () => null,
}));
jest.mock('../common/Wrapper', () => ({
  CommonPanelWrapper: ({ children, actions }: any) => (
    <div>
      {actions({ setRightPanel: jest.fn() })}
      {children}
    </div>
  ),
}));

function Location() {
  return <output>{useLocation().pathname}</output>;
}

describe('leaving a private conversation', () => {
  const store = getReduxStore();

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    store.replaceReducer((state, action) =>
      appReducer(action.type === 'test/reset' ? undefined : state, action)
    );
    store.dispatch({ type: 'test/reset' });
    (request.post as jest.Mock).mockResolvedValue({ data: {} });
    (request.get as jest.Mock).mockRejectedValue({ code: 403 });
  });

  afterEach(() => queryClient.clear());

  function open(type = ChatConverseType.Multi) {
    store.dispatch(
      chatActions.setConverseInfo({
        _id: 'conversation',
        name: '',
        type,
        members: ['me', 'other'],
      })
    );
    return render(
      <ReduxProvider store={store}>
        <MemoryRouter initialEntries={['/main/personal/converse/conversation']}>
          <Routes>
            <Route
              path="/main/personal/converse/:id"
              element={<ConversePanel converseId="conversation" />}
            />
            <Route path="/main/personal/friends" element={<div>Friends</div>} />
          </Routes>
          <Location />
        </MemoryRouter>
      </ReduxProvider>
    );
  }

  test('a two-member Multi keeps invite, member list and leave actions', () => {
    open();
    expect(screen.getByRole('button', { name: '邀请成员' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '成员列表' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '退出会话' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '创建会话' })).toBeNull();
  });

  test('a direct message does not offer leaving', () => {
    open(ChatConverseType.DM);
    expect(screen.queryByRole('button', { name: '退出会话' })).toBeNull();
    expect(screen.getByRole('button', { name: '创建会话' })).toBeTruthy();
  });

  test('leaving waits for confirmation and server success before removing or navigating', async () => {
    open();
    fireEvent.click(screen.getByRole('button', { name: '退出会话' }));
    expect(request.post).not.toHaveBeenCalled();
    expect(store.getState().chat.converses.conversation).toBeDefined();

    const { onConfirm } = (showAlert as jest.Mock).mock.calls[0][0];
    (request.post as jest.Mock).mockRejectedValueOnce(new Error('failed'));
    await act(async () => {
      await expect(onConfirm()).rejects.toThrow('failed');
    });
    expect(store.getState().chat.converses.conversation).toBeDefined();
    expect(screen.getByRole('status').textContent).toBe(
      '/main/personal/converse/conversation'
    );

    await act(async () => {
      await onConfirm();
    });
    expect(request.post).toHaveBeenLastCalledWith(
      '/api/chat/converse/leaveDMConverse',
      { converseId: 'conversation' }
    );
    expect(store.getState().chat.converses.conversation).toBeUndefined();
    expect(screen.getByRole('status').textContent).toBe(
      '/main/personal/friends'
    );
    expect(screen.queryByText('Messages')).toBeNull();
  });

  test('a leave notification on another session closes the active conversation', async () => {
    open();
    await act(async () => {
      store.dispatch(
        chatActions.removeDMConverse({ converseId: 'conversation' })
      );
    });
    expect(screen.getByRole('status').textContent).toBe(
      '/main/personal/friends'
    );
    expect(screen.queryByText('Messages')).toBeNull();
  });

  test('a delayed leave response preserves a newer verified invitation', async () => {
    let finishLeave!: (value: unknown) => void;
    (request.post as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        finishLeave = resolve;
      })
    );
    open();
    fireEvent.click(screen.getByRole('button', { name: '退出会话' }));
    const leaving = (showAlert as jest.Mock).mock.calls[0][0].onConfirm();
    (request.get as jest.Mock).mockResolvedValue({
      data: {
        _id: 'conversation',
        name: '',
        type: ChatConverseType.Multi,
        members: ['me', 'other'],
      },
    });
    await act(async () => {
      await refreshDMConverse('conversation', 'me');
    });
    await act(async () => {
      finishLeave({ data: true });
      await leaving;
    });

    expect(store.getState().chat.converses.conversation).toBeDefined();
    expect(screen.getByRole('status').textContent).toBe(
      '/main/personal/converse/conversation'
    );
  });
});
