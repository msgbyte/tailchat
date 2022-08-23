import type { PureServiceSchema } from 'tailchat-server-sdk';

/**
 * 缓存清理工具
 *
 * @deprecated 请使用 this.cleanActionCache
 */
export const TcCacheCleaner = (
  eventNames: string[]
): Partial<PureServiceSchema> => {
  const events = {};

  eventNames.forEach((name) => {
    events[name] = function () {
      if (this.broker.cacher) {
        this.logger.debug(`Clear local '${this.name}' cache`);
        this.broker.cacher.clean(`${this.name}.**`);
      }
    };
  });

  return {
    events,
  };
};
