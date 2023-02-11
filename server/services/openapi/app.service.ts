import {
  TcService,
  config,
  TcDbService,
  TcContext,
  EntityError,
} from 'tailchat-server-sdk';
import _ from 'lodash';
import {
  filterAvailableAppCapability,
  OpenAppBot,
  OpenAppDocument,
  OpenAppModel,
  OpenAppOAuth,
} from '../../models/openapi/app';
import { Types } from 'mongoose';
import { nanoid } from 'nanoid';
import crypto from 'crypto';

interface OpenAppService
  extends TcService,
    TcDbService<OpenAppDocument, OpenAppModel> {}
class OpenAppService extends TcService {
  get serviceName(): string {
    return 'openapi.app';
  }

  onInit(): void {
    if (!config.enableOpenapi) {
      return;
    }

    this.registerLocalDb(require('../../models/openapi/app').default);

    this.registerAction('authToken', this.authToken, {
      params: {
        appId: 'string',
        token: 'string',
        capability: { type: 'array', items: 'string', optional: true },
      },
      cache: {
        keys: ['appId', 'token'],
        ttl: 60 * 60, // 1 hour
      },
    });
    this.registerAction('all', this.all);
    this.registerAction('get', this.get, {
      params: {
        appId: 'string',
      },
      cache: {
        keys: ['appId'],
        ttl: 60 * 60, // 1 hour
      },
    });
    this.registerAction('create', this.create, {
      params: {
        appName: 'string',
        appDesc: 'string',
        appIcon: 'string',
      },
    });
    this.registerAction('setAppCapability', this.setAppCapability, {
      params: {
        appId: 'string',
        capability: { type: 'array', items: 'string' },
      },
    });
    this.registerAction('setAppOAuthInfo', this.setAppOAuthInfo, {
      params: {
        appId: 'string',
        fieldName: 'string',
        fieldValue: 'any',
      },
    });
    this.registerAction('setAppBotInfo', this.setAppBotInfo, {
      params: {
        appId: 'string',
        fieldName: 'string',
        fieldValue: 'any',
      },
    });
  }

  /**
   * 校验Token 返回true/false
   *
   * Token 生成方式: appId + appSecret 取md5
   */
  async authToken(
    ctx: TcContext<{
      appId: string;
      token: string;
      capability?: OpenAppDocument['capability'];
    }>
  ): Promise<boolean> {
    const { appId, token, capability } = ctx.params;
    const app = await this.adapter.model.findOne({
      appId,
    });

    if (!app) {
      // 没有找到应用
      throw new Error('Not found open app:' + appId);
    }

    if (Array.isArray(capability)) {
      for (const item of capability) {
        if (!app.capability.includes(item)) {
          throw new Error('Open app not enabled capability:' + item);
        }
      }
    }

    const appSecret = app.appSecret;

    if (
      token ===
      crypto
        .createHash('md5')
        .update(appId + appSecret)
        .digest('hex')
    ) {
      return true;
    }

    return false;
  }

  /**
   * 获取用户参与的所有应用
   */
  async all(ctx: TcContext<{}>) {
    const apps = await this.adapter.model.find({
      owner: ctx.meta.userId,
    });

    return await this.transformDocuments(ctx, {}, apps);
  }

  /**
   * 获取应用信息
   */
  async get(ctx: TcContext<{ appId: string }>) {
    const appId = ctx.params.appId;

    const app = await this.adapter.model.findOne(
      {
        appId,
      },
      {
        appSecret: false,
      }
    );

    return await this.transformDocuments(ctx, {}, app);
  }

  /**
   * 创建一个第三方应用
   */
  async create(
    ctx: TcContext<{
      appName: string;
      appDesc: string;
      appIcon: string;
    }>
  ) {
    const { appName, appDesc, appIcon } = ctx.params;
    const userId = ctx.meta.userId;

    if (!appName) {
      throw new EntityError();
    }

    const doc = await this.adapter.model.create({
      owner: String(userId),
      appId: `tc_${new Types.ObjectId().toString()}`,
      appSecret: nanoid(32),
      appName,
      appDesc,
      appIcon,
    });

    return await this.transformDocuments(ctx, {}, doc);
  }

  /**
   * 设置应用开放的能力
   */
  async setAppCapability(
    ctx: TcContext<{
      appId: string;
      capability: string[];
    }>
  ) {
    const { appId, capability } = ctx.params;
    const { userId } = ctx.meta;

    const openapp = await this.adapter.model.findAppByIdAndOwner(appId, userId);
    if (!openapp) {
      throw new Error('Not found openapp');
    }

    await openapp
      .updateOne({
        capability: filterAvailableAppCapability(_.uniq(capability)),
      })
      .exec();

    await this.cleanAppInfoCache(appId);

    return true;
  }

  /**
   * 设置OAuth的设置信息
   */
  async setAppOAuthInfo<T extends keyof OpenAppOAuth>(
    ctx: TcContext<{
      appId: string;
      fieldName: T;
      fieldValue: OpenAppOAuth[T];
    }>
  ) {
    const { appId, fieldName, fieldValue } = ctx.params;
    const { userId } = ctx.meta;

    if (!['redirectUrls'].includes(fieldName)) {
      throw new Error('Not allowed fields');
    }

    if (fieldName === 'redirectUrls') {
      if (!Array.isArray(fieldValue)) {
        throw new Error('`redirectUrls` should be an array');
      }
    }

    await this.adapter.model.findOneAndUpdate(
      {
        appId,
        owner: userId,
      },
      {
        $set: {
          [`oauth.${fieldName}`]: fieldValue,
        },
      }
    );

    await this.cleanAppInfoCache(appId);
  }

  /**
   * 设置Bot的设置信息
   */
  async setAppBotInfo<T extends keyof OpenAppBot>(
    ctx: TcContext<{
      appId: string;
      fieldName: T;
      fieldValue: OpenAppBot[T];
    }>
  ) {
    const { appId, fieldName, fieldValue } = ctx.params;
    const { userId } = ctx.meta;

    if (!['callbackUrl'].includes(fieldName)) {
      throw new Error('Not allowed fields');
    }

    if (fieldName === 'callbackUrl') {
      if (typeof fieldValue !== 'string') {
        throw new Error('`callbackUrl` should be a string');
      }
    }

    await this.adapter.model.findOneAndUpdate(
      {
        appId,
        owner: userId,
      },
      {
        $set: {
          [`bot.${fieldName}`]: fieldValue,
        },
      }
    );

    await this.cleanAppInfoCache(appId);
  }

  /**
   * 清理获取开放平台应用的缓存
   */
  private async cleanAppInfoCache(appId: string) {
    await this.cleanActionCache('get', [String(appId)]);
  }
}

export default OpenAppService;
