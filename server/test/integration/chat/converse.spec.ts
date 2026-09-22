import { Types } from 'mongoose';
import { TcBroker } from 'tailchat-server-sdk';
import ConverseService from '../../../services/core/chat/converse.service';
import MessageService from '../../../services/core/chat/message.service';
import UserService from '../../../services/core/user/user.service';
import FriendService from '../../../services/core/user/friend.service';
import UserDMListService from '../../../services/core/user/dmlist.service';

describe('Private conversation membership and invitation preferences', () => {
  const broker = new TcBroker({ logger: false, cacher: 'Memory' });
  const converse = broker.createService(ConverseService) as ConverseService;
  const message = broker.createService(MessageService) as MessageService;
  const user = broker.createService(UserService) as UserService;
  const friend = broker.createService(FriendService) as FriendService;
  const dmlist = broker.createService(UserDMListService) as UserDMListService;
  const notifications: any[] = [];
  const rooms = new Map<string, Set<string>>();
  let users: string[];
  let converseIds: string[];
  let beforeJoin: (userId: string) => Promise<void>;
  let beforeLeave: (userId: string) => Promise<void>;

  broker.createService({
    name: 'gateway',
    actions: {
      notify(ctx) {
        notifications.push(ctx.params);
      },
      async joinRoom(ctx) {
        const userId = ctx.params.userId ?? ctx.meta.userId;
        await beforeJoin?.(userId);
        const joined = rooms.get(userId) ?? new Set<string>();
        ctx.params.roomIds.forEach((id: string) => joined.add(id));
        rooms.set(userId, joined);
      },
      async leaveRoom(ctx) {
        await beforeLeave?.(ctx.params.userId ?? ctx.meta.userId);
        ctx.params.roomIds.forEach((id: string) =>
          rooms.get(ctx.params.userId ?? ctx.meta.userId)?.delete(id)
        );
      },
      checkUserOnline(ctx) {
        return ctx.params.userIds.map(() => false);
      },
    },
  });
  let joinedPanelIds: string[];
  broker.createService({
    name: 'group',
    actions: {
      getGroupInfo: () => ({
        members: users.map((userId) => ({ userId })),
        panels: [],
      }),
      getJoinedGroupAndPanelIds: () => ({
        groupIds: [],
        textPanelIds: joinedPanelIds,
        subscribeFeaturePanelIds: [],
      }),
    },
  });

  const asUser = (userId: string) => ({
    meta: { userId, user: { nickname: 'Test member' } },
  });
  const invoke = <T = any>(action: string, userId: string, params = {}) =>
    broker.call<T, object>(action, params, asUser(userId));
  const create = async (memberIds = users.slice(1)) => {
    const result = await invoke('chat.converse.createDMConverse', users[0], {
      memberIds,
    });
    converseIds.push(result._id);
    return result._id as string;
  };
  const setPreference = (userId: string, enabled: boolean) =>
    invoke('user.setUserSettings', userId, {
      settings: { onlyAllowFriendInvite: enabled },
    });

  beforeAll(() => broker.start());
  beforeEach(async () => {
    converseIds = [];
    notifications.length = 0;
    rooms.clear();
    beforeJoin = undefined;
    beforeLeave = undefined;
    joinedPanelIds = [];
    users = await Promise.all(
      Array.from({ length: 4 }, async () => {
        const id = new Types.ObjectId();
        await user.adapter.model.create({
          _id: id,
          email: `${id}@conversation.test`,
          nickname: 'Test member',
          password: 'unused-test-password',
          discriminator: '0000',
        });
        return String(id);
      })
    );
  });
  afterEach(async () => {
    jest.restoreAllMocks();
    const created = await converse.adapter.model.find({
      members: { $in: users.map((id) => new Types.ObjectId(id)) },
    });
    converseIds.push(...created.map((record) => String(record._id)));
    await Promise.all([
      message.adapter.model.deleteMany({ converseId: { $in: converseIds } }),
      converse.adapter.model.deleteMany({ _id: { $in: converseIds } }),
      dmlist.adapter.model.deleteMany({ userId: { $in: users } }),
      friend.adapter.model.deleteMany({
        $or: [{ from: { $in: users } }, { to: { $in: users } }],
      }),
      user.adapter.model.deleteMany({ _id: { $in: users } }),
    ]);
  });
  afterAll(() => broker.stop());

  test.each([undefined, false])(
    'allows nonfriend invitations when preference is %s',
    async (enabled) => {
      if (enabled !== undefined) {
        await setPreference(users[1], enabled);
      }
      const id = await create(users.slice(1, 3));
      await invoke('chat.converse.appendDMConverseMembers', users[0], {
        converseId: id,
        memberIds: [users[3]],
      });
      expect(
        (await converse.adapter.model.findById(id)).members.map(String).sort()
      ).toEqual([...users].sort());
    }
  );

  test('rejects an opted-in nonfriend carried over from an existing direct message', async () => {
    await setPreference(users[1], true);
    await create([users[1]]); // One-to-one messages keep their existing policy.
    await expect(create(users.slice(1, 3))).rejects.toThrow();
    expect(
      await converse.adapter.model.countDocuments({
        type: 'Multi',
        members: new Types.ObjectId(users[0]),
      })
    ).toBe(0);
  });

  test('uses the invited user friendship direction and respects preference changes', async () => {
    await setPreference(users[1], true);
    await friend.adapter.model.create({ from: users[0], to: users[1] });
    await expect(create(users.slice(1, 3))).rejects.toThrow();
    await friend.adapter.model.create({ from: users[1], to: users[0] });
    await expect(create(users.slice(1, 3))).resolves.toEqual(
      expect.any(String)
    );
    await friend.adapter.model.deleteMany({ from: users[1], to: users[0] });
    await expect(create(users.slice(1, 3))).rejects.toThrow();
    await setPreference(users[1], false);
    await expect(create(users.slice(1, 3))).resolves.toEqual(
      expect.any(String)
    );
  });

  test('checks append invitations before mutating membership', async () => {
    const id = await create(users.slice(1, 3));
    await setPreference(users[3], true);
    await expect(
      invoke('chat.converse.appendDMConverseMembers', users[0], {
        converseId: id,
        memberIds: [users[3]],
      })
    ).rejects.toThrow();
    expect(
      (await converse.adapter.model.findById(id)).members.map(String)
    ).not.toContain(users[3]);
    await friend.adapter.model.create({ from: users[3], to: users[0] });
    await invoke('chat.converse.appendDMConverseMembers', users[0], {
      converseId: id,
      memberIds: [users[3], users[3]],
    });
    expect(
      (await converse.adapter.model.findById(id)).members
        .map(String)
        .filter((id) => id === users[3])
    ).toHaveLength(1);
  });

  test('append retries a failed socket join after membership was already added', async () => {
    const id = await create(users.slice(1, 3));
    const append = () =>
      invoke('chat.converse.appendDMConverseMembers', users[0], {
        converseId: id,
        memberIds: [users[3]],
      });
    beforeJoin = async () => {
      throw new Error('Gateway unavailable');
    };
    await expect(append()).rejects.toThrow('Gateway unavailable');
    expect(
      (await converse.adapter.model.findById(id)).members.map(String)
    ).toContain(users[3]);
    expect(rooms.get(users[3])?.has(id)).not.toBe(true);

    beforeJoin = undefined;
    await setPreference(users[3], true);
    const previousMessageCount = await message.adapter.model.countDocuments({
      converseId: id,
    });
    await append();
    expect(rooms.get(users[3])?.has(id)).toBe(true);
    expect(
      (await invoke('user.dmlist.getAllConverse', users[3])).map(String)
    ).toContain(id);
    expect(await message.adapter.model.countDocuments({ converseId: id })).toBe(
      previousMessageCount
    );
  });

  test('leaves membership, sockets and lists and cannot restore access by reconnecting or sending messages', async () => {
    const id = await create(users.slice(1, 3));
    await invoke('chat.converse.leaveDMConverse', users[1], { converseId: id });
    const stored = await converse.adapter.model.findById(id);
    expect(stored.type).toBe('Multi');
    expect(stored.members.map(String)).toEqual([users[0], users[2]]);
    expect(rooms.get(users[1])?.has(id)).toBe(false);
    expect(notifications).toContainEqual({
      type: 'unicast',
      target: users[1],
      eventName: 'notify:chat.converse.removeDMConverse',
      eventData: { converseId: id },
    });
    await expect(
      invoke('chat.converse.findConverseInfo', users[1], { converseId: id })
    ).rejects.toThrow();
    await expect(
      invoke('chat.message.fetchConverseMessage', users[1], { converseId: id })
    ).rejects.toThrow();
    await expect(
      invoke('chat.message.searchMessage', users[1], {
        converseId: id,
        text: 'member',
      })
    ).rejects.toThrow();
    const previous = await message.adapter.model.findOne({ converseId: id });
    for (const action of ['addReaction', 'removeReaction']) {
      await expect(
        invoke(`chat.message.${action}`, users[1], {
          messageId: String(previous._id),
          emoji: ':smile:',
        })
      ).rejects.toThrow();
    }
    await expect(
      invoke('chat.message.sendMessage', users[1], {
        converseId: id,
        content: 'Not a member',
      })
    ).rejects.toThrow();
    await expect(
      invoke('user.dmlist.addConverse', users[1], { converseId: id })
    ).rejects.toThrow();
    await invoke('chat.message.sendMessage', users[0], {
      converseId: id,
      content: 'Still a member',
    });
    expect(
      (await invoke('user.dmlist.getAllConverse', users[1])).map(String)
    ).not.toContain(id);
    expect(
      (await invoke('chat.converse.findAndJoinRoom', users[1])).dmConverseIds
    ).not.toContain(id);
    expect(rooms.get(users[1])?.has(id)).toBe(false);
    await expect(
      invoke('chat.message.fetchConverseMessage', users[0], { converseId: id })
    ).resolves.toHaveLength(2);
  });

  test('rejects nearby private history even when a departed member supplies an unrelated joined group', async () => {
    const id = await create(users.slice(1, 3));
    const previous = await message.adapter.model.findOne({ converseId: id });
    await invoke('chat.converse.leaveDMConverse', users[1], { converseId: id });
    await expect(
      invoke('chat.message.fetchNearbyMessage', users[1], {
        converseId: id,
        messageId: String(previous._id),
        groupId: String(new Types.ObjectId()),
      })
    ).rejects.toThrow();
  });

  test('checks joined group panels for panel ids without a private converse document', async () => {
    const panelId = new Types.ObjectId();
    converseIds.push(String(panelId));
    const stored = await message.adapter.model.create({
      converseId: panelId,
      groupId: new Types.ObjectId(),
      author: new Types.ObjectId(users[0]),
      content: 'Group history',
    });
    await expect(
      invoke('chat.message.fetchConverseMessage', users[0], {
        converseId: String(panelId),
      })
    ).rejects.toThrow();
    joinedPanelIds = [String(panelId)];
    const result = await invoke('chat.message.fetchConverseMessage', users[0], {
      converseId: String(panelId),
    });
    expect(result.map((item) => String(item._id))).toEqual([
      String(stored._id),
    ]);
  });

  test('leave retries cleanup and does not affect another member', async () => {
    const id = await create(users.slice(1, 3));
    const leave = () =>
      invoke('chat.converse.leaveDMConverse', users[1], { converseId: id });
    await leave();
    await leave();
    expect(
      (await converse.adapter.model.findById(id)).members.map(String)
    ).toEqual([users[0], users[2]]);
    expect(
      (await invoke('user.dmlist.getAllConverse', users[1])).map(String)
    ).not.toContain(id);
  });

  test('leave by a nonmember changes nothing and does not notify the room', async () => {
    const id = await create(users.slice(1, 3));
    notifications.length = 0;
    await invoke('chat.converse.leaveDMConverse', users[3], { converseId: id });
    expect(
      (await converse.adapter.model.findById(id)).members.map(String)
    ).toEqual(users.slice(0, 3));
    expect(notifications.filter((event) => event.type === 'roomcast')).toEqual(
      []
    );
  });

  test('does not mutate direct messages or groups through append or leave', async () => {
    const direct = await create([users[1]]);
    const group = await converse.adapter.model.create({
      type: 'Group',
      members: users.slice(0, 2),
    });
    converseIds.push(String(group._id));
    for (const id of [direct, String(group._id)]) {
      await expect(
        invoke('chat.converse.leaveDMConverse', users[0], { converseId: id })
      ).rejects.toThrow();
      await expect(
        invoke('chat.converse.appendDMConverseMembers', users[0], {
          converseId: id,
          memberIds: [users[2]],
        })
      ).rejects.toThrow();
      expect(
        (await converse.adapter.model.findById(id)).members.map(String)
      ).toEqual(users.slice(0, 2));
    }
  });

  test('does not reuse a multi conversation reduced to two members as a direct message', async () => {
    const id = await create(users.slice(1, 3));
    await invoke('chat.converse.leaveDMConverse', users[2], { converseId: id });
    const direct = await create([users[1]]);
    expect(direct).not.toBe(id);
    expect((await converse.adapter.model.findById(direct)).type).toBe('DM');
  });

  test('concurrent appends and leaves preserve unrelated membership updates', async () => {
    const id = await create(users.slice(1, 3));
    await Promise.all([
      invoke('chat.converse.appendDMConverseMembers', users[0], {
        converseId: id,
        memberIds: [users[3]],
      }),
      invoke('chat.converse.leaveDMConverse', users[1], { converseId: id }),
    ]);
    expect(
      (await converse.adapter.model.findById(id)).members.map(String).sort()
    ).toEqual([users[0], users[2], users[3]].sort());
  });
  test('removes a delayed list insertion that races with leaving', async () => {
    const id = await create(users.slice(1, 3));
    await invoke('user.dmlist.removeConverse', users[1], { converseId: id });
    const record = await dmlist.adapter.model.findOne({ userId: users[1] });
    let resume: () => void;
    let started: () => void;
    const paused = new Promise<void>((resolve) => {
      resume = resolve;
    });
    const inserting = new Promise<void>((resolve) => {
      started = resolve;
    });
    const original = dmlist.adapter.model.findByIdAndUpdate.bind(
      dmlist.adapter.model
    );
    jest.spyOn(dmlist.adapter.model, 'findByIdAndUpdate').mockImplementation(((
      recordId,
      ...args
    ) => {
      if (String(recordId) === String(record._id)) {
        return paused.then(() => original(recordId, ...args));
      }
      return original(recordId, ...args);
    }) as any);
    const originalFind = dmlist.adapter.model.findOrCreate.bind(
      dmlist.adapter.model
    );
    jest.spyOn(dmlist.adapter.model, 'findOrCreate').mockImplementation((async (
      ...args
    ) => {
      const result = await originalFind(...args);
      started();
      return result;
    }) as any);
    const pending = invoke('user.dmlist.addConverse', users[1], {
      converseId: id,
    });
    const rejected = expect(pending).rejects.toThrow();
    await inserting;
    await invoke('chat.converse.leaveDMConverse', users[1], { converseId: id });
    resume();
    await rejected;
    expect(
      (await dmlist.adapter.model.findById(record._id)).converseIds.map(String)
    ).not.toContain(id);
  });

  test('a delayed list compensation cannot remove a successful re-invitation', async () => {
    const id = await create(users.slice(1, 3));
    const record = await dmlist.adapter.model.findOne({ userId: users[1] });
    let resumeInsert: () => void;
    let inserted: () => void;
    const insertPaused = new Promise<void>((resolve) => {
      resumeInsert = resolve;
    });
    const insertion = new Promise<void>((resolve) => {
      inserted = resolve;
    });
    const originalAdd = dmlist.adapter.model.findByIdAndUpdate.bind(
      dmlist.adapter.model
    );
    let pauseInsert = true;
    jest.spyOn(dmlist.adapter.model, 'findByIdAndUpdate').mockImplementation(((
      recordId,
      ...args
    ) => {
      if (pauseInsert && String(recordId) === String(record._id)) {
        pauseInsert = false;
        return (async () => {
          const result = await originalAdd(recordId, ...args);
          inserted();
          await insertPaused;
          return result;
        })();
      }
      return originalAdd(recordId, ...args);
    }) as any);
    const pending = invoke('user.dmlist.addConverse', users[1], {
      converseId: id,
    });
    const rejected = expect(pending).rejects.toThrow();
    await insertion;
    await invoke('chat.converse.leaveDMConverse', users[1], { converseId: id });

    let resumeRemove: () => void;
    let removing: () => void;
    const removePaused = new Promise<void>((resolve) => {
      resumeRemove = resolve;
    });
    const removal = new Promise<void>((resolve) => {
      removing = resolve;
    });
    const originalRemove = dmlist.adapter.model.updateOne.bind(
      dmlist.adapter.model
    );
    let pauseRemove = true;
    jest.spyOn(dmlist.adapter.model, 'updateOne').mockImplementation(((
      filter,
      ...args
    ) => {
      if (pauseRemove && String(filter.userId) === users[1]) {
        pauseRemove = false;
        return {
          exec: async () => {
            removing();
            await removePaused;
            return originalRemove(filter, ...args).exec();
          },
        };
      }
      return originalRemove(filter, ...args);
    }) as any);
    resumeInsert();
    await removal;
    await invoke('chat.converse.appendDMConverseMembers', users[0], {
      converseId: id,
      memberIds: [users[1]],
    });
    resumeRemove();
    await rejected;
    expect(
      (await invoke('user.dmlist.getAllConverse', users[1])).map(String)
    ).toContain(id);
    expect(rooms.get(users[1]).has(id)).toBe(true);
  });

  test('removes a delayed reconnect join after the member leaves', async () => {
    const id = await create(users.slice(1, 3));
    let resume: () => void;
    let started: () => void;
    const paused = new Promise<void>((resolve) => {
      resume = resolve;
    });
    const joining = new Promise<void>((resolve) => {
      started = resolve;
    });
    beforeJoin = async (userId) => {
      if (userId === users[1]) {
        started();
        await paused;
      }
    };
    const reconnect = invoke('chat.converse.findAndJoinRoom', users[1]);
    await joining;
    await invoke('chat.converse.leaveDMConverse', users[1], { converseId: id });
    resume();
    expect((await reconnect).dmConverseIds).not.toContain(id);
    expect(rooms.get(users[1]).has(id)).toBe(false);
  });

  test('cleans a delayed invitation join when the invited member leaves', async () => {
    const id = await create(users.slice(1, 3));
    let resume: () => void;
    let started: () => void;
    const paused = new Promise<void>((resolve) => {
      resume = resolve;
    });
    const joining = new Promise<void>((resolve) => {
      started = resolve;
    });
    beforeJoin = async (userId) => {
      if (userId === users[3]) {
        started();
        await paused;
      }
    };
    const append = invoke('chat.converse.appendDMConverseMembers', users[0], {
      converseId: id,
      memberIds: [users[3]],
    });
    await joining;
    await invoke('chat.converse.leaveDMConverse', users[3], { converseId: id });
    resume();
    await append;
    expect(
      (await converse.adapter.model.findById(id)).members.map(String)
    ).not.toContain(users[3]);
    expect(rooms.get(users[3]).has(id)).toBe(false);
    expect(
      (await invoke('user.dmlist.getAllConverse', users[3])).map(String)
    ).not.toContain(id);
  });

  test('rejects an append if its actor leaves during preference validation', async () => {
    const id = await create(users.slice(1, 3));
    let resume: () => void;
    let started: () => void;
    const paused = new Promise<void>((resolve) => {
      resume = resolve;
    });
    const checking = new Promise<void>((resolve) => {
      started = resolve;
    });
    const original = user.adapter.model.findOne.bind(user.adapter.model);
    jest.spyOn(user.adapter.model, 'findOne').mockImplementation(((
      filter,
      ...args
    ) => {
      if (String(filter?._id) === users[3]) {
        started();
        return paused.then(() => original(filter, ...args));
      }
      return original(filter, ...args);
    }) as any);
    const append = invoke('chat.converse.appendDMConverseMembers', users[0], {
      converseId: id,
      memberIds: [users[3]],
    });
    const rejected = expect(append).rejects.toThrow();
    await checking;
    await invoke('chat.converse.leaveDMConverse', users[0], { converseId: id });
    resume();
    await rejected;
    expect(
      (await converse.adapter.model.findById(id)).members.map(String)
    ).toEqual(users.slice(1, 3));
  });

  test('restores current membership when a re-invite finishes before delayed leave cleanup', async () => {
    const id = await create(users.slice(1, 3));
    let resume: () => void;
    let started: () => void;
    const paused = new Promise<void>((resolve) => {
      resume = resolve;
    });
    const leaving = new Promise<void>((resolve) => {
      started = resolve;
    });
    beforeLeave = async (userId) => {
      if (userId === users[1]) {
        started();
        await paused;
      }
    };
    const leave = invoke('chat.converse.leaveDMConverse', users[1], {
      converseId: id,
    });
    await leaving;
    await invoke('chat.converse.appendDMConverseMembers', users[0], {
      converseId: id,
      memberIds: [users[1]],
    });
    resume();
    await leave;
    expect(
      (await converse.adapter.model.findById(id)).members.map(String)
    ).toContain(users[1]);
    expect(rooms.get(users[1]).has(id)).toBe(true);
    expect(
      (await invoke('user.dmlist.getAllConverse', users[1])).map(String)
    ).toContain(id);
    expect(
      notifications.filter((event) => event.target === users[1]).slice(-1)[0]
        .eventName
    ).toBe('notify:chat.converse.updateDMConverse');
  });

  test('leave can retry a socket cleanup failure without restoring membership', async () => {
    const id = await create(users.slice(1, 3));
    beforeLeave = async () => {
      throw new Error('Gateway unavailable');
    };
    await expect(
      invoke('chat.converse.leaveDMConverse', users[1], { converseId: id })
    ).rejects.toThrow('Gateway unavailable');
    expect(
      (await converse.adapter.model.findById(id)).members.map(String)
    ).not.toContain(users[1]);
    beforeLeave = undefined;
    await invoke('chat.converse.leaveDMConverse', users[1], { converseId: id });
    expect(rooms.get(users[1]).has(id)).toBe(false);
    expect(
      (await invoke('user.dmlist.getAllConverse', users[1])).map(String)
    ).not.toContain(id);
  });

  test('fails closed when the invitation preference cannot be loaded', async () => {
    const original = user.adapter.model.findOne.bind(user.adapter.model);
    jest.spyOn(user.adapter.model, 'findOne').mockImplementation(((
      filter,
      ...args
    ) => {
      if (String(filter?._id) === users[1]) {
        throw new Error('Settings unavailable');
      }
      return original(filter, ...args);
    }) as any);
    await expect(create(users.slice(1, 3))).rejects.toThrow(
      'Settings unavailable'
    );
    expect(
      await converse.adapter.model.countDocuments({
        type: 'Multi',
        members: new Types.ObjectId(users[0]),
      })
    ).toBe(0);
  });
});
