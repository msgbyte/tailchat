import { generateRandomStr, getEmailAddress } from '../../../lib/utils';
import UserService from '../../../services/core/user/user.service';
import { createTestServiceBroker } from '../../utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { UserDocument } from '../../../models/user/user';
import userLoginLogModel from '../../../models/user/userLoginLog';
import { config, SYSTEM_USERID } from 'tailchat-server-sdk';

/**
 * 创建测试用户
 */
function createTestUser(email = `${generateRandomStr()}@example.com`) {
  return {
    email,
    nickname: getEmailAddress(email),
    password: bcrypt.hashSync('123456'),
    avatar: null,
    discriminator: '0000',
  };
}

/**
 * 创建正常用户
 */
function createTestTemporaryUser() {
  return {
    email: `${generateRandomStr()}.temporary@msgbyte.com`,
    nickname: generateRandomStr(),
    password: bcrypt.hashSync('123456'),
    avatar: null,
    discriminator: '0000',
    temporary: true,
  };
}

describe('Test "user" service', () => {
  const { broker, service, insertTestData } =
    createTestServiceBroker<UserService>(UserService, {
      brokerOptions: {
        cacher: {
          type: 'Redis',
          options: {
            prefix: `user-test-${generateRandomStr()}`,
            redis: process.env.REDIS_URL,
          },
        },
      },
    });

  test('Test "user.register"', async () => {
    const params = {
      email: 'test@example.com',
      password: '123456',
    };
    const user: any = await broker.call('user.register', params, {
      meta: { ip: '203.0.113.1' },
    });

    try {
      expect(user.email).toBe(params.email);
      expect(user.avatar).toBeUndefined();
      expect(user.nickname).toBe(getEmailAddress(params.email));
    } finally {
      await service.adapter.removeById(user._id);
      await userLoginLogModel.deleteMany({ userId: user._id });
    }
  });

  test('Test "user.register" ignores mass-assigned sensitive fields', async () => {
    const email = `${generateRandomStr()}@example.com`;
    const user: any = await broker.call(
      'user.register',
      {
        _id: SYSTEM_USERID,
        email,
        password: '123456',
        type: 'pluginBot',
        temporary: true,
        banned: true,
        emailVerified: true,
      },
      {
        meta: { ip: '203.0.113.2' },
      }
    );

    try {
      expect(String(user._id)).not.toBe(SYSTEM_USERID);
      expect(user.type).toBe('normalUser');
      expect(user.temporary).toBe(false);
      expect(user.banned).toBe(false);
      expect(user.emailVerified).toBe(false);

      const persisted = await service.adapter.model.findById(user._id);
      expect(persisted).not.toBeNull();
      expect(persisted?.type).toBe('normalUser');
      expect(persisted?.temporary).toBe(false);
      expect(persisted?.banned).toBe(false);
      expect(persisted?.emailVerified).toBe(false);
    } finally {
      await service.adapter.removeById(user._id);
      await userLoginLogModel.deleteMany({ userId: user._id });
    }
  });

  test('Test "user.resolveToken" rejects SYSTEM_USERID token', async () => {
    const token = jwt.sign(
      {
        _id: SYSTEM_USERID,
        nickname: 'system',
        email: 'system@example.com',
        avatar: null,
      },
      config.secret
    );

    await expect(broker.call('user.resolveToken', { token })).rejects.toThrow();
  });

  test('Test "user.createTemporaryUser"', async () => {
    const nickname = generateRandomStr();
    const params = {
      nickname,
    };
    const user: any = await broker.call('user.createTemporaryUser', params, {
      meta: { ip: '203.0.113.1' },
    });

    try {
      expect(user).toHaveProperty('nickname', nickname);
      expect(user).toHaveProperty('discriminator');
      expect(user).toHaveProperty('token');
      expect(user).toHaveProperty('temporary', true);
      expect(String(user.email).endsWith('.temporary@msgbyte.com'));
    } finally {
      await service.adapter.removeById(user._id);
      await userLoginLogModel.deleteMany({ userId: user._id });
    }
  });

  test('Test "user.claimTemporaryUser"', async () => {
    const testDoc = await insertTestData(createTestTemporaryUser());
    const email = `${generateRandomStr()}@msgbyte.com`;
    const password = '654321';

    const newUser: any = await broker.call(
      'user.claimTemporaryUser',
      {
        userId: String(testDoc._id),
        email,
        password,
      },
      { meta: { userId: String(testDoc._id) } }
    );

    expect(newUser).toHaveProperty('nickname', testDoc.nickname); // 昵称不变
    expect(newUser).toHaveProperty('email', email);
    expect(newUser).toHaveProperty('password');
    expect(bcrypt.compareSync(password, newUser.password)).toBe(true); // 校验密码修改是否正确
    expect(newUser).toHaveProperty('token');
    expect(newUser).toHaveProperty('temporary', false);
  });

  test('Test "user.claimTemporaryUser" rejects claiming other temporary user', async () => {
    const victim = await insertTestData(createTestTemporaryUser());
    const attacker = await insertTestData(createTestTemporaryUser());

    await expect(
      broker.call(
        'user.claimTemporaryUser',
        {
          userId: String(victim._id),
          email: `${generateRandomStr()}@msgbyte.com`,
          password: '654321',
        },
        { meta: { userId: String(attacker._id) } }
      )
    ).rejects.toThrow();

    const doc = await service.adapter.model.findById(victim._id);
    expect(doc.temporary).toBe(true);
    expect(doc.email).toBe(victim.email);
  });

  test('Test "user.searchUserWithUniqueName"', async () => {
    const testDoc = await insertTestData(createTestUser());

    const res: UserDocument = await broker.call(
      'user.searchUserWithUniqueName',
      {
        uniqueName: testDoc.nickname + '#' + testDoc.discriminator,
      }
    );

    expect(res).not.toBe(null);
    expect(res.nickname).toBe(testDoc.nickname);
    expect(res).not.toHaveProperty('password');
  });

  test('Test "user.login" records login ip', async () => {
    const testDoc = await insertTestData(createTestUser());
    const ip = '203.0.113.10';
    const userAgent = 'tailchat-test-agent';

    try {
      await broker.call(
        'user.login',
        {
          email: testDoc.email,
          password: '123456',
        },
        {
          meta: {
            ip,
            userAgent,
          },
        }
      );

      const updatedUser = await service.adapter.model.findById(testDoc._id);

      expect(updatedUser?.lastLoginIp).toBe(ip);
      expect(updatedUser?.lastLoginUserAgent).toBe(userAgent);
      expect(updatedUser?.lastLoginAt).toBeInstanceOf(Date);

      const loginLog = await userLoginLogModel.findOne({
        userId: testDoc._id,
        ip,
      });

      expect(loginLog?.userAgent).toBe(userAgent);
      expect(loginLog?.createdAt).toBeInstanceOf(Date);
    } finally {
      await userLoginLogModel.deleteMany({ userId: testDoc._id });
    }
  });

  test('Test "user.updateUserExtra"', async () => {
    const testUser = await insertTestData(createTestUser());

    const res = await broker.call(
      'user.updateUserExtra',
      {
        fieldName: 'foo',
        fieldValue: 'bar',
      },
      {
        meta: {
          userId: String(testUser._id),
        },
      }
    );

    expect(res).toMatchObject({
      extra: {
        foo: 'bar',
      },
    });

    const res2 = await broker.call(
      'user.updateUserExtra',
      {
        fieldName: 'foo',
        fieldValue: 'baz',
      },
      {
        meta: {
          userId: String(testUser._id),
        },
      }
    );

    expect(res2).toMatchObject({
      extra: {
        foo: 'baz',
      },
    });
  });

  test('Test "user.setUserSettings"', async () => {
    const testUser = await insertTestData(createTestUser());

    const res = await broker.call(
      'user.setUserSettings',
      {
        settings: {
          foo: 'aaa',
          bar: 233,
        },
      },
      {
        meta: {
          userId: String(testUser._id),
        },
      }
    );

    expect(res).toEqual({
      foo: 'aaa',
      bar: 233,
    });

    // and can be merge

    const res2 = await broker.call(
      'user.setUserSettings',
      {
        settings: {
          foo: 'bbb',
          baz: 963,
        },
      },
      {
        meta: {
          userId: String(testUser._id),
        },
      }
    );

    expect(res2).toEqual({
      foo: 'bbb',
      bar: 233,
      baz: 963,
    });
  });
});
