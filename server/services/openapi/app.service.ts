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
  OpenAppDocument,
  OpenAppModel,
} from '../../models/openapi/app';
import { Types } from 'mongoose';
import { nanoid } from 'nanoid';

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

    this.registerAction('all', this.all);
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

    return true;
  }

  /**
   * 设置OAuth的设置信息
   */
  async setAppOAuthInfo(
    ctx: TcContext<{
      appId: string;
      fieldName: string;
      fieldValue: any;
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
  }
}

export default OpenAppService;
