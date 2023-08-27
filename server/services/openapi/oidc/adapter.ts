import type { Adapter, AdapterPayload } from 'oidc-provider';
import { config } from 'tailchat-server-sdk';
import RedisClient from 'ioredis';
import _ from 'lodash';
import { OpenApp } from './model';

const client = new RedisClient(config.redisUrl, {
  keyPrefix: 'tailchat:oidc:',
});

const grantable = new Set([
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
  'BackchannelAuthenticationRequest',
]);

const consumable = new Set([
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
  'BackchannelAuthenticationRequest',
]);

function grantKeyFor(id) {
  return `grant:${id}`;
}

function userCodeKeyFor(userCode) {
  return `userCode:${userCode}`;
}

function uidKeyFor(uid) {
  return `uid:${uid}`;
}

function parseImageUrl(input: string | undefined) {
  if (typeof input === 'string') {
    return input.replace('{BACKEND}', config.apiUrl); // 因为/open接口是在服务端的，所以该标识直接移除即可
  }

  return input;
}

/**
 * Reference: https://github.com/panva/node-oidc-provider/blob/main/example/my_adapter.js
 */
export class TcOIDCAdapter implements Adapter {
  constructor(public name: string) {}

  async upsert(
    id: string,
    payload: AdapterPayload,
    expiresIn: number
  ): Promise<undefined | void> {
    const key = this.key(id);

    const multi = client.multi();
    if (consumable.has(this.name)) {
      multi['hmset'](key, { payload: JSON.stringify(payload) });
    } else {
      multi['set'](key, JSON.stringify(payload));
    }

    if (expiresIn) {
      multi.expire(key, expiresIn);
    }

    if (grantable.has(this.name) && payload.grantId) {
      const grantKey = grantKeyFor(payload.grantId);
      multi.rpush(grantKey, key);
      // if you're seeing grant key lists growing out of acceptable proportions consider using LTRIM
      // here to trim the list to an appropriate length
      const ttl = await client.ttl(grantKey);
      if (expiresIn > ttl) {
        multi.expire(grantKey, expiresIn);
      }
    }

    if (payload.userCode) {
      const userCodeKey = userCodeKeyFor(payload.userCode);
      multi.set(userCodeKey, id);
      multi.expire(userCodeKey, expiresIn);
    }

    if (payload.uid) {
      const uidKey = uidKeyFor(payload.uid);
      multi.set(uidKey, id);
      multi.expire(uidKey, expiresIn);
    }

    await multi.exec();
  }

  async find(id: string): Promise<AdapterPayload | undefined | void> {
    if (this.name === 'Client') {
      return this.findClient(id);
    }

    const data = consumable.has(this.name)
      ? await client.hgetall(this.key(id))
      : await client.get(this.key(id));

    if (_.isEmpty(data)) {
      return undefined;
    }

    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    const { payload, ...rest } = data;
    return {
      ...rest,
      ...JSON.parse(payload),
    };
  }

  async findByUid(uid: string): Promise<AdapterPayload | undefined | void> {
    const id = await client.get(uidKeyFor(uid));
    return this.find(id);
  }

  async findByUserCode(
    userCode: string
  ): Promise<AdapterPayload | undefined | void> {
    const id = await client.get(userCodeKeyFor(userCode));
    return this.find(id);
  }

  async destroy(id: string): Promise<undefined | void> {
    const key = this.key(id);
    await client.del(key);
  }

  async revokeByGrantId(grantId: string): Promise<undefined | void> {
    // eslint-disable-line class-methods-use-this
    const multi = client.multi();
    const tokens = await client.lrange(grantKeyFor(grantId), 0, -1);
    tokens.forEach((token) => multi.del(token));
    multi.del(grantKeyFor(grantId));
    await multi.exec();
  }

  async consume(id: string) {
    await client.hset(this.key(id), 'consumed', Math.floor(Date.now() / 1000));
  }

  /**
   * 查询客户端
   */
  private async findClient(clientId: string): Promise<AdapterPayload | void> {
    const app = await OpenApp.findOne({
      appId: clientId,
    }).exec();
    if (!app) {
      return;
    }

    if (!app.capability.includes('oauth')) {
      return;
    }

    const clientPayload: AdapterPayload = {
      client_id: app.appId,
      client_secret: app.appSecret,
      client_name: app.appName,
      application_type: 'web',
      grant_types: ['refresh_token', 'authorization_code'],
      redirect_uris: [...(app.oauth?.redirectUrls ?? [])],
    };

    if (app.appIcon) {
      clientPayload.logo_uri = parseImageUrl(app.appIcon);
    }

    return clientPayload;
  }

  key(id: string) {
    return `${this.name}:${id}`;
  }
}
