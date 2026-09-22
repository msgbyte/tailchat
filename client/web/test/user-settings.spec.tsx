import React from 'react';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { request } from 'tailchat-shared/api/request';
import { queryClient } from 'tailchat-shared/cache';
import { CacheKey } from 'tailchat-shared/cache/cache';
import { CacheProvider } from 'tailchat-shared/cache/Provider';
import { useUserSettings } from 'tailchat-shared/hooks/model/useUserSettings';
import { setStorage } from 'tailchat-shared/manager/storage';
import { setToasts } from 'tailchat-shared/manager/ui';
import { SettingsSystem } from '../src/components/modals/SettingsView/System';

jest.mock('tailchat-shared/api/request', () => ({
  request: { get: jest.fn(), post: jest.fn() },
}));
jest.mock('tailchat-shared', () => ({
  ...jest.requireActual('tailchat-shared/hooks/model/useUserSettings'),
  t: (text: string) => text,
  useColorScheme: () => ({ colorScheme: 'dark', setColorScheme: jest.fn() }),
  useAlphaMode: () => ({ isAlphaMode: false, setAlphaMode: jest.fn() }),
}));
jest.mock('@/components/FullModal/Factory', () => ({
  FullModalFactory: () => null,
}));
jest.mock('@/components/FullModal/Field', () => ({
  FullModalField: ({ title, content, tip }: any) => (
    <section>
      {title}
      {content}
      {tip}
    </section>
  ),
}));
jest.mock('@/components/LanguageSelect', () => ({
  LanguageSelect: () => null,
}));
jest.mock('@/plugin/common', () => ({
  pluginColorScheme: [],
  pluginSettings: [],
}));

beforeEach(() => {
  setStorage(() => ({
    get: async () => undefined,
    set: async () => {},
    save: async () => {},
    remove: async () => {},
  }));
  setToasts(jest.fn());
  queryClient.clear();
  jest.clearAllMocks();
});

afterEach(() => {
  queryClient.clear();
  jest.restoreAllMocks();
});

test('a failed privacy setting save restores the last saved value', async () => {
  queryClient.setQueryData([CacheKey.userSettings], {
    onlyAllowFriendInvite: false,
  });
  (request.post as jest.Mock).mockRejectedValueOnce(new Error('save failed'));
  const errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});
  const { result, unmount } = renderHook(() => useUserSettings(), {
    wrapper: CacheProvider,
  });
  await waitFor(() => expect(result.current.loading).toBe(false));

  await act(async () => {
    await result.current.setSettings({ onlyAllowFriendInvite: true });
  });

  expect(queryClient.getQueryData([CacheKey.userSettings])).toEqual({
    onlyAllowFriendInvite: false,
  });
  await waitFor(() =>
    expect(result.current.settings.onlyAllowFriendInvite).toBe(false)
  );
  unmount();
  errorLog.mockRestore();
  queryClient.clear();
});

test('the invitation preference defaults off and persists both switch values', async () => {
  queryClient.setQueryData([CacheKey.userSettings], {});
  (request.post as jest.Mock)
    .mockResolvedValueOnce({ data: { onlyAllowFriendInvite: true } })
    .mockResolvedValueOnce({ data: { onlyAllowFriendInvite: false } });
  render(
    <CacheProvider>
      <SettingsSystem />
    </CacheProvider>
  );
  const toggle = screen.getByRole('switch', { name: '仅允许好友邀请创建会话' });
  await waitFor(() => expect(toggle.hasAttribute('disabled')).toBe(false));
  expect(toggle.getAttribute('aria-checked')).toBe('false');

  fireEvent.click(toggle);
  await waitFor(() => expect(toggle.getAttribute('aria-checked')).toBe('true'));
  expect(request.post).toHaveBeenLastCalledWith('/api/user/setUserSettings', {
    settings: { onlyAllowFriendInvite: true },
  });
  await waitFor(() => expect(toggle.hasAttribute('disabled')).toBe(false));

  fireEvent.click(toggle);
  await waitFor(() =>
    expect(toggle.getAttribute('aria-checked')).toBe('false')
  );
  expect(request.post).toHaveBeenLastCalledWith('/api/user/setUserSettings', {
    settings: { onlyAllowFriendInvite: false },
  });
});
