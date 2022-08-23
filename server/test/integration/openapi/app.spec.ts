import { createTestServiceBroker } from '../../utils';
import OpenAppService from '../../../services/openapi/app.service';
import { Types } from 'mongoose';
import _ from 'lodash';
import { generateRandomStr } from '../../../lib/utils';
import type { OpenApp } from '../../../models/openapi/app';
import { nanoid } from 'nanoid';

/**
 * 创建测试应用
 */

function createTestOpenApp(
  userId: Types.ObjectId = new Types.ObjectId()
): Partial<OpenApp> {
  return {
    owner: userId,
    appId: `tc_${new Types.ObjectId().toString()}`,
    appSecret: nanoid(32),
    appName: generateRandomStr(),
    appDesc: generateRandomStr(),
    appIcon: null,
  };
}

describe('Test "openapi.app" service', () => {
  const { broker, service, insertTestData } =
    createTestServiceBroker<OpenAppService>(OpenAppService);

  test('Test "openapi.app.create"', async () => {
    const userId = String(new Types.ObjectId());
    const name = generateRandomStr();

    const res: OpenApp = await broker.call(
      'openapi.app.create',
      {
        appName: name,
        appDesc: '',
        appIcon: '',
      },
      {
        meta: {
          userId,
        },
      }
    );

    try {
      expect(res).toHaveProperty('owner');
      expect(res.appId).toHaveLength(27);
      expect(res.appSecret).toHaveLength(32);
      expect(res.appName).toBe(name);
    } finally {
      await service.adapter.model.findByIdAndRemove(res._id);
    }
  });

  test('Test "openapi.app.setAppOAuthInfo"', async () => {
    const { _id, appId, owner } = await insertTestData(createTestOpenApp());
    await broker.call(
      'openapi.app.setAppOAuthInfo',
      {
        appId,
        fieldName: 'redirectUrls',
        fieldValue: ['http://example.com'],
      },
      {
        meta: {
          userId: String(owner),
        },
      }
    );

    const openapp = await service.adapter.findById(_id);
    expect(openapp.oauth.redirectUrls).toEqual(['http://example.com']);
  });
});
