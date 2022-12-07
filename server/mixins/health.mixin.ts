import moment from 'moment';
import type { PureContext, PureServiceSchema } from 'tailchat-server-sdk';

const now = moment().format('YYYYMMDDHHmm');

/**
 * 增加一个action
 * 用于返回当前节点的健康信息
 */
export const TcHealth = (): Partial<PureServiceSchema> => {
  return {
    actions: {
      async health(ctx: PureContext) {
        const status = ctx.broker.getHealthStatus();

        const services: any[] = await ctx.call('$node.services');

        return {
          nodeID: this.broker.nodeID,
          cpu: status.cpu,
          memory: status.mem,
          services: services
            .filter((s) => s.available === true)
            .map((s) => s.fullName),
          version: process.env.VERSION || `nightly-${now}`,
        };
      },
    },
  };
};
