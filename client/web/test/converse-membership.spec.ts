import { request } from 'tailchat-shared/api/request';
import type { AppSocket } from 'tailchat-shared/api/socket';
import { queryClient } from 'tailchat-shared/cache';
import { CacheKey } from 'tailchat-shared/cache/cache';
import { sharedEvent } from 'tailchat-shared/event';
import {
  ensureDMConverse,
  refreshDMConverse,
} from 'tailchat-shared/helper/converse-helper';
import { ChatConverseType } from 'tailchat-shared/model/converse';
import { setupRedux } from 'tailchat-shared/redux/setup';
import {
  appReducer,
  chatActions,
  userActions,
} from 'tailchat-shared/redux/slices';
import * as storeModule from 'tailchat-shared/redux/store';

jest.mock('tailchat-shared/api/request', () => ({
  request: { get: jest.fn(), post: jest.fn() },
}));

const converse = {
  _id: 'conversation',
  type: ChatConverseType.Multi,
  name: '',
  members: ['me', 'other'],
};
const message = {
  _id: 'message',
  converseId: converse._id,
  author: 'other',
  content: 'hello',
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

describe('private conversation membership synchronization', () => {
  let store: storeModule.AppStore;
  let listeners: Record<string, (data: any) => unknown>;
  let receiveMessage: jest.Mock;
  let socketRequest: jest.Mock;
  let reconnect: () => void;

  beforeEach(async () => {
    queryClient.clear();
    jest.clearAllMocks();
    store = storeModule.getReduxStore();
    store.replaceReducer((state, action) =>
      appReducer(action.type === 'test/reset' ? undefined : state, action)
    );
    store.dispatch({ type: 'test/reset' });
    store.dispatch(userActions.setUserInfo({ _id: 'me' } as any));
    listeners = {};
    receiveMessage = jest.fn();
    sharedEvent.on('receiveMessage', receiveMessage);
    (request.get as jest.Mock).mockResolvedValue({ data: converse });
    (request.post as jest.Mock).mockResolvedValue({ data: {} });
    socketRequest = jest.fn().mockResolvedValue([]);
    setupRedux(
      {
        request: socketRequest,
        listen: (name: string, listener: (data: any) => unknown) => {
          listeners[name] = listener;
        },
        onReconnect: (callback: () => void) => {
          reconnect = callback;
        },
      } as unknown as AppSocket,
      store
    );
    await Promise.resolve();
  });

  afterEach(() => {
    sharedEvent.off('receiveMessage', receiveMessage);
    queryClient.clear();
    jest.restoreAllMocks();
  });

  async function flush() {
    // Drain query and socket continuations without advancing query retry timers.
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  test('leaving clears the conversation, unread state and cache, and suppresses late messages', async () => {
    store.dispatch(chatActions.setConverseInfo(converse));
    store.dispatch(chatActions.updateCurrentConverseId(converse._id));
    store.dispatch(
      chatActions.setConverseAck({
        converseId: converse._id,
        lastMessageId: 'old',
      })
    );
    store.dispatch(
      chatActions.setLastMessageMap([
        { converseId: converse._id, lastMessageId: 'new' },
      ])
    );
    queryClient.setQueryData([CacheKey.converse, converse._id], converse);

    listeners['chat.converse.removeDMConverse']({ converseId: converse._id });
    listeners['chat.message.add'](message);
    await flush();

    expect(store.getState().chat.converses[converse._id]).toBeUndefined();
    expect(store.getState().chat.currentConverseId).toBeNull();
    expect(store.getState().chat.ack[converse._id]).toBeUndefined();
    expect(store.getState().chat.lastMessageMap[converse._id]).toBeUndefined();
    expect(
      queryClient.getQueryData([CacheKey.converse, converse._id])
    ).toBeUndefined();
    expect(request.post).not.toHaveBeenCalled();
    expect(receiveMessage).not.toHaveBeenCalled();
  });

  test('an in-flight message lookup cannot restore membership after leaving', async () => {
    const response = deferred<{ data: typeof converse }>();
    (request.get as jest.Mock).mockReturnValue(response.promise);
    listeners['chat.message.add'](message);
    listeners['chat.converse.removeDMConverse']({ converseId: converse._id });
    response.resolve({ data: converse });
    await flush();

    expect(store.getState().chat.converses[converse._id]).toBeUndefined();
    expect(request.post).not.toHaveBeenCalled();
    expect(receiveMessage).not.toHaveBeenCalled();
  });

  test('reopening a cached conversation checks current membership before adding it to the list', async () => {
    queryClient.setQueryData([CacheKey.converse, converse._id], converse);
    (request.get as jest.Mock).mockResolvedValue({
      data: { ...converse, members: ['other'] },
    });

    await expect(ensureDMConverse(converse._id, 'me')).rejects.toThrow();

    expect(request.get).toHaveBeenCalled();
    expect(request.post).not.toHaveBeenCalled();
    expect(store.getState().chat.converses[converse._id]).toBeUndefined();
  });

  test('a stale update cannot restore membership but a verified new invitation can', async () => {
    listeners['chat.converse.removeDMConverse']({ converseId: converse._id });
    (request.get as jest.Mock).mockResolvedValue({
      data: { ...converse, members: ['other'] },
    });
    listeners['chat.converse.updateDMConverse'](converse);
    await flush();
    expect(store.getState().chat.converses[converse._id]).toBeUndefined();

    (request.get as jest.Mock).mockResolvedValue({ data: converse });
    listeners['chat.converse.updateDMConverse'](converse);
    await flush();
    expect(store.getState().chat.converses[converse._id]?.members).toEqual([
      'me',
      'other',
    ]);
  });

  test('leaving while an invitation refresh is pending wins over the old response', async () => {
    const response = deferred<{ data: typeof converse }>();
    (request.get as jest.Mock).mockReturnValue(response.promise);
    listeners['chat.converse.updateDMConverse'](converse);
    listeners['chat.converse.removeDMConverse']({ converseId: converse._id });
    response.resolve({ data: converse });
    await flush();
    expect(store.getState().chat.converses[converse._id]).toBeUndefined();
  });

  test('closing only hides the conversation and a later message can reopen it', async () => {
    store.dispatch(chatActions.setConverseInfo(converse));
    store.dispatch(chatActions.removeConverse({ converseId: converse._id }));
    listeners['chat.message.add'](message);
    await flush();
    expect(store.getState().chat.converses[converse._id]?.messages).toEqual([
      message,
    ]);
    expect(receiveMessage).toHaveBeenCalledWith(message);
  });

  test('a list membership lookup started before leaving cannot restore the conversation', async () => {
    const response = deferred<{ data: typeof converse }>();
    (request.get as jest.Mock).mockReturnValue(response.promise);
    socketRequest.mockImplementation(async (name) =>
      name === 'user.dmlist.getAllConverse' ? [converse._id] : []
    );
    reconnect();
    await flush();
    expect(request.get).toHaveBeenCalled();
    listeners['chat.converse.removeDMConverse']({ converseId: converse._id });
    response.resolve({ data: converse });
    await flush();
    expect(store.getState().chat.converses[converse._id]).toBeUndefined();
  });

  test('reconnect restores an invitation received while offline', async () => {
    listeners['chat.converse.removeDMConverse']({ converseId: converse._id });
    socketRequest.mockImplementation(async (name) =>
      name === 'user.dmlist.getAllConverse' ? [converse._id] : []
    );
    reconnect();
    await flush();
    expect(store.getState().chat.converses[converse._id]?.members).toEqual(
      converse.members
    );
    expect(store.getState().chat.converseMembership[converse._id].removed).toBe(
      false
    );
  });

  test('a pending list-add response cannot restore or notify after leaving', async () => {
    const response = deferred<{ data: unknown }>();
    (request.post as jest.Mock).mockReturnValue(response.promise);
    listeners['chat.message.add'](message);
    await flush();
    expect(request.post).toHaveBeenCalled();
    listeners['chat.converse.removeDMConverse']({ converseId: converse._id });
    response.resolve({ data: {} });
    await flush();
    expect(store.getState().chat.converses[converse._id]).toBeUndefined();
    expect(receiveMessage).not.toHaveBeenCalled();
  });

  test('opening a conversation and a concurrent invitation refresh both complete', async () => {
    const response = deferred<{ data: typeof converse }>();
    (request.get as jest.Mock)
      .mockReturnValueOnce(response.promise)
      .mockResolvedValue({ data: converse });
    const opening = ensureDMConverse(converse._id, 'me');
    const updated = refreshDMConverse(converse._id, 'me');
    response.resolve({ data: converse });
    await expect(updated).resolves.toEqual(converse);
    await expect(opening).resolves.toEqual(converse);
  });

  test('an older denied membership response cannot erase a newer invitation', async () => {
    const response = deferred<{ data: typeof converse }>();
    (request.get as jest.Mock)
      .mockReturnValueOnce(response.promise)
      .mockResolvedValue({ data: converse });
    const oldRefresh = refreshDMConverse(converse._id, 'me');
    await refreshDMConverse(converse._id, 'me');
    response.reject({ code: 403 });
    await oldRefresh;
    expect(store.getState().chat.converses[converse._id]?.members).toEqual(
      converse.members
    );
  });
});
