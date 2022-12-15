import { generateRandomStr, getEmailAddress } from '../../../lib/utils';
import UserService from '../../../services/core/user/user.service';
import { createTestServiceBroker } from '../../utils';
import bcrypt from 'bcryptjs';
import type { UserDocument } from '../../../models/user/user';

/**
 * 创建测试用户
 */
function createTestUser(email = 'foo@bar.com') {
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
    createTestServiceBroker<UserService>(UserService);

  test('Test "user.register"', async () => {
    const params = {
      email: 'test@example.com',
      password: '123456',
    };
    const user: any = await broker.call('user.register', params);

    try {
      expect(user.email).toBe(params.email);
      expect(user.avatar).toBe(null);
      expect(user.nickname).toBe(getEmailAddress(params.email));
    } finally {
      await service.adapter.removeById(user._id);
    }
  });

  test('Test "user.createTemporaryUser"', async () => {
    const nickname = generateRandomStr();
    const params = {
      nickname,
    };
    const user: any = await broker.call('user.createTemporaryUser', params);

    try {
      expect(user).toHaveProperty('nickname', nickname);
      expect(user).toHaveProperty('discriminator');
      expect(user).toHaveProperty('token');
      expect(user).toHaveProperty('temporary', true);
      expect(String(user.email).endsWith('.temporary@msgbyte.com'));
    } finally {
      await service.adapter.removeById(user._id);
    }
  });

  test('Test "user.claimTemporaryUser"', async () => {
    const testDoc = await insertTestData(createTestTemporaryUser());
    const email = `${generateRandomStr()}@msgbyte.com`;
    const password = '654321';

    const newUser: any = await broker.call('user.claimTemporaryUser', {
      userId: String(testDoc._id),
      email,
      password,
    });

    expect(newUser).toHaveProperty('nickname', testDoc.nickname); // 昵称不变
    expect(newUser).toHaveProperty('email', email);
    expect(newUser).toHaveProperty('password');
    expect(bcrypt.compareSync(password, newUser.password)).toBe(true); // 校验密码修改是否正确
    expect(newUser).toHaveProperty('token');
    expect(newUser).toHaveProperty('temporary', false);
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
