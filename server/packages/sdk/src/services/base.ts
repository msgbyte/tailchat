import {
  ActionSchema,
  CallingOptions,
  Context,
  LoggerInstance,
  Service,
  ServiceBroker,
  ServiceDependency,
  ServiceEvent,
  ServiceHooks,
  ServiceSchema,
  WaitForServicesResult,
} from 'moleculer';
import { once } from 'lodash';
import { TcDbService } from './mixins/db.mixin';
import type { PanelFeature, PureContext, TcPureContext } from './types';
import type { TFunction } from 'i18next';
import { t } from './lib/i18n';
import type { ValidationRuleObject } from 'fastest-validator';
import type { BuiltinEventMap } from '../structs/events';
import { CONFIG_GATEWAY_AFTER_HOOK } from '../const';
import _ from 'lodash';

type ServiceActionHandler<T = any> = (
  ctx: TcPureContext<any>
) => Promise<T> | T;

type ShortValidationRule =
  | 'any'
  | 'array'
  | 'boolean'
  | 'custom'
  | 'date'
  | 'email'
  | 'enum'
  | 'forbidden'
  | 'function'
  | 'number'
  | 'object'
  | 'string'
  | 'url'
  | 'uuid';

type ServiceActionSchema = Pick<
  ActionSchema,
  | 'name'
  | 'rest'
  | 'visibility'
  | 'service'
  | 'cache'
  | 'tracing'
  | 'bulkhead'
  | 'circuitBreaker'
  | 'retryPolicy'
  | 'fallback'
  | 'hooks'
> & {
  params?: Record<
    string,
    ValidationRuleObject | ValidationRuleObject[] | ShortValidationRule
  >;
  disableSocket?: boolean;
};

/**
 * 生成AfterHook唯一键
 */
function generateAfterHookKey(actionName: string, serviceName = '') {
  if (serviceName) {
    return `${CONFIG_GATEWAY_AFTER_HOOK}.${serviceName}.${actionName}`.replaceAll(
      '.',
      '-'
    );
  } else {
    return `${CONFIG_GATEWAY_AFTER_HOOK}.${actionName}`.replaceAll('.', '-');
  }
}

interface TcServiceBroker extends ServiceBroker {
  // 事件类型重写
  emit<K extends string>(
    eventName: K,
    data: K extends keyof BuiltinEventMap ? BuiltinEventMap[K] : unknown,
    groups?: string | string[]
  ): Promise<void>;
  emit(eventName: string): Promise<void>;
  broadcast<K extends string>(
    eventName: K,
    data: K extends keyof BuiltinEventMap ? BuiltinEventMap[K] : unknown,
    groups?: string | string[]
  ): Promise<void>;
  broadcast(eventName: string): Promise<void>;
}

/**
 * TcService 微服务抽象基类
 */
export interface TcService extends Service {
  broker: TcServiceBroker;
}
export abstract class TcService extends Service {
  /**
   * 服务名, 全局唯一
   */
  abstract get serviceName(): string;
  private _mixins: ServiceSchema['mixins'] = [];
  private _actions: ServiceSchema['actions'] = {};
  private _methods: ServiceSchema['methods'] = {};
  private _settings: ServiceSchema['settings'] = {};
  private _events: ServiceSchema['events'] = {};

  /**
   * 全局的配置中心
   */
  public globalConfig: Record<string, any> = {};

  private _generateAndParseSchema() {
    this.parseServiceSchema({
      name: this.serviceName,
      mixins: this._mixins,
      settings: this._settings,
      actions: this._actions,
      events: this._events,
      started: this.onStart,
      stopped: this.onStop,
      hooks: this.buildHooks(),
    });
  }

  constructor(broker: ServiceBroker) {
    super(broker); // Skip 父级的 parseServiceSchema 方法

    this.onInit(); // 初始化服务

    this.initBuiltin(); // 初始化内部服务

    this._generateAndParseSchema();

    this.logger = this.buildLoggerWithPrefix(this.logger);

    this.onInited(); // 初始化完毕
  }

  protected abstract onInit(): void;

  protected onInited() {}

  protected async onStart() {}

  protected async onStop() {}

  protected initBuiltin() {
    this.registerEventListener('config.updated', (payload) => {
      this.logger.info('Update global config with:', payload.config);
      if (payload.config) {
        this.globalConfig = {
          ...payload.config,
        };
      }
    });
  }

  /**
   * 构建内部hooks
   */
  protected buildHooks(): ServiceHooks {
    return {
      after: _.mapValues(this._actions, (action, name) => {
        return (ctx: PureContext, res: unknown) => {
          try {
            const afterHooks =
              this.globalConfig[generateAfterHookKey(name, this.serviceName)];

            if (Array.isArray(afterHooks) && afterHooks.length > 0) {
              for (const action of afterHooks) {
                // 异步调用, 暂时不修改值
                ctx.call(String(action), ctx.params, { meta: ctx.meta });
              }
            }
          } catch (err) {
            this.logger.error('Call action after hooks error:', err);
          }

          return res;
        };
      }),
    };
  }

  registerMixin(mixin: Partial<ServiceSchema>): void {
    this._mixins.push(mixin);
  }

  /**
   * 注册微服务绑定的数据库
   * 不能调用多次
   */
  registerLocalDb = once((model) => {
    this.registerMixin(TcDbService(model));
  });

  /**
   * 注册数据表可见字段列表
   * @param fields 字段列表
   */
  registerDbField(fields: string[]) {
    this.registerSetting('fields', fields);
  }

  /**
   * 注册一个操作
   *
   * 该操作会同时生成http请求和socketio事件的处理
   * @param name 操作名, 需微服务内唯一
   * @param handler 处理方法
   * @returns
   */
  registerAction(
    name: string,
    handler: ServiceActionHandler,
    schema?: ServiceActionSchema
  ) {
    if (this._actions[name]) {
      console.warn(`重复注册操作: ${name}。操作被跳过...`);
      return;
    }

    this._actions[name] = {
      ...schema,
      handler(
        this: Service,
        ctx: Context<unknown, { language: string; t: TFunction }>
      ) {
        // 调用时生成t函数
        ctx.meta.t = (key: string, defaultValue?: string | object) => {
          if (typeof defaultValue === 'object') {
            // 如果是参数对象的话
            return t(key, {
              ...defaultValue,
              lng: ctx.meta.language,
            });
          }

          return t(key, defaultValue, {
            lng: ctx.meta.language,
          });
        };
        return handler.call(this, ctx);
      },
    };
  }

  /**
   * 注册一个内部方法
   */
  registerMethod(name: string, method: (...args: any[]) => any) {
    if (this._methods[name]) {
      console.warn(`重复注册方法: ${name}。操作被跳过...`);
      return;
    }

    this._methods[name] = method;
  }

  /**
   * 注册一个配置项
   */
  registerSetting(key: string, value: unknown): void {
    if (this._settings[key]) {
      console.warn(`重复注册配置: ${key}。之前的设置将被覆盖...`);
    }

    this._settings[key] = value;
  }

  /**
   * 注册一个事件监听器
   */
  registerEventListener<K extends string>(
    eventName: K,
    handler: (
      payload: K extends keyof BuiltinEventMap ? BuiltinEventMap[K] : unknown,
      ctx: TcPureContext
    ) => void,
    options: Omit<ServiceEvent, 'handler'> = {}
  ) {
    this._events[eventName] = {
      ...options,
      handler: (ctx: TcPureContext<any>) => {
        handler(ctx.params, ctx);
      },
    };
  }

  /**
   * 注册跳过token鉴权的路由地址
   * @param urls 鉴权路由 会自动添加 serviceName 前缀
   * @example "/login"
   */
  registerAuthWhitelist(urls: string[]) {
    this.waitForServices('gateway').then(() => {
      this.broker.broadcast(
        'gateway.auth.addWhitelists',
        {
          urls: urls.map((url) => `/${this.serviceName}${url}`),
        },
        'gateway'
      );
    });
  }

  /**
   * 注册面板功能特性，用于在服务端基础设施开放部分能力
   * @param panelFeature 面板功能
   */
  async setPanelFeature(panelName: string, panelFeatures: PanelFeature[]) {
    await this.setGlobalConfig(`panelFeature.${panelName}`, panelFeatures);
  }

  /**
   * 获取拥有某些特性的面板列表
   * @param panelFeature 面板功能
   */
  getPanelNamesWithFeature(panelFeature: PanelFeature) {
    const map =
      this.getGlobalConfig<Record<string, PanelFeature[]>>('panelFeature');

    const matched = Object.entries(map).filter(([panelName, panelFeatures]) =>
      panelFeatures.includes(panelFeature)
    );

    return matched.map((m) => m[0]);
  }

  /**
   * 等待微服务启动
   * @param serviceNames
   * @param timeout
   * @param interval
   * @param logger
   * @returns
   */
  waitForServices(
    serviceNames: string | Array<string> | Array<ServiceDependency>,
    timeout?: number,
    interval?: number,
    logger?: LoggerInstance
  ): Promise<WaitForServicesResult> {
    if (process.env.NODE_ENV === 'test') {
      // 测试环境中跳过
      return Promise.resolve({
        services: [],
        statuses: [],
      });
    }

    return super.waitForServices(serviceNames, timeout, interval, logger);
  }

  getGlobalConfig<T = any>(key: string): T {
    return _.get(this.globalConfig, key);
  }

  /**
   * 设置全局配置信息
   */
  async setGlobalConfig(key: string, value: any): Promise<void> {
    await this.waitForServices('config');
    await this.broker.call('config.set', {
      key,
      value,
    });
  }

  /**
   * 注册一个触发了action后的回调
   * @param fullActionName 完整的带servicename的action名
   * @param callbackAction 当前服务的action名，不需要带servicename
   */
  async registryAfterActionHook(
    fullActionName: string,
    callbackAction: string
  ) {
    await this.waitForServices(['gateway', 'config']);
    await this.broker.call('config.addToSet', {
      key: `${CONFIG_GATEWAY_AFTER_HOOK}.${fullActionName}`.replaceAll(
        '.',
        '-'
      ),
      value: `${this.serviceName}.${callbackAction}`,
    });
  }

  /**
   * 清理action缓存
   * NOTICE: 这里使用Redis作为缓存管理器，因此不需要通知所有的service
   */
  async cleanActionCache(actionName: string, keys: string[] = []) {
    await this.broker.cacher.clean(
      `${this.serviceName}.${actionName}:${keys.join('|')}**`
    );
  }

  /**
   * 生成一个有命名空间的通知事件名
   */
  protected generateNotifyEventName(eventName: string) {
    return `notify:${this.serviceName}.${eventName}`;
  }

  /**
   * 本地调用操作，不经过外部转发
   * @param actionName 不需要serverName前缀
   */
  protected localCall(
    actionName: string,
    params?: {},
    opts?: CallingOptions
  ): Promise<any> {
    return this.actions[actionName](params, opts);
  }

  private buildLoggerWithPrefix(_originLogger: LoggerInstance) {
    const prefix = `[${this.serviceName}]`;
    const originLogger = _originLogger;
    return {
      info: (...args: any[]) => {
        originLogger.info(prefix, ...args);
      },
      fatal: (...args: any[]) => {
        originLogger.fatal(prefix, ...args);
      },
      error: (...args: any[]) => {
        originLogger.error(prefix, ...args);
      },
      warn: (...args: any[]) => {
        originLogger.warn(prefix, ...args);
      },
      debug: (...args: any[]) => {
        originLogger.debug(prefix, ...args);
      },
      trace: (...args: any[]) => {
        originLogger.trace(prefix, ...args);
      },
    };
  }

  /**
   * 单播推送socket事件
   */
  unicastNotify(
    ctx: TcPureContext,
    userId: string,
    eventName: string,
    eventData: unknown
  ): Promise<void> {
    return ctx.call('gateway.notify', {
      type: 'unicast',
      target: userId,
      eventName: this.generateNotifyEventName(eventName),
      eventData,
    });
  }

  /**
   * 列播推送socket事件
   */
  listcastNotify(
    ctx: TcPureContext,
    userIds: string[],
    eventName: string,
    eventData: unknown
  ) {
    return ctx.call('gateway.notify', {
      type: 'listcast',
      target: userIds,
      eventName: this.generateNotifyEventName(eventName),
      eventData,
    });
  }

  /**
   * 组播推送socket事件
   */
  roomcastNotify(
    ctx: TcPureContext,
    roomId: string,
    eventName: string,
    eventData: unknown
  ): Promise<void> {
    return ctx.call('gateway.notify', {
      type: 'roomcast',
      target: roomId,
      eventName: this.generateNotifyEventName(eventName),
      eventData,
    });
  }
  /**
   * 群播推送socket事件
   */
  broadcastNotify(
    ctx: TcPureContext,
    eventName: string,
    eventData: unknown
  ): Promise<void> {
    return ctx.call('gateway.notify', {
      type: 'broadcast',
      eventName: this.generateNotifyEventName(eventName),
      eventData,
    });
  }
}
