import type { Context } from 'moleculer';
import type { TFunction } from 'i18next';
import type { UserStruct } from '../structs/user';
import type { GroupStruct } from '../structs/group';
import type { BuiltinEventMap } from '../structs/events';

export type {
  ServiceSchema as PureServiceSchema,
  Service as PureService,
} from 'moleculer';

export interface UserJWTPayload {
  _id: string;
  nickname: string;
  email: string;
  avatar: string;
}

interface TranslationMeta {
  t: TFunction;
  language: string;
}

export type PureContext<P = {}, M extends object = {}> = Context<P, M>;

export interface TcPureContext<P = {}, M = {}>
  extends Omit<Context<P>, 'emit'> {
  meta: TranslationMeta & M;

  // 事件类型重写
  emit<K extends string>(
    eventName: K,
    data: K extends keyof BuiltinEventMap ? BuiltinEventMap[K] : unknown,
    groups?: string | string[]
  ): Promise<void>;
  emit(eventName: string): Promise<void>;
}

export type TcContext<P = {}, M = {}> = TcPureContext<
  P,
  {
    user: UserJWTPayload;
    token: string;
    userId: string;

    /**
     * 仅在 socket.io 的请求中会出现
     */
    socketId?: string;
  } & M
>;

export type GroupBaseInfo = Pick<GroupStruct, 'name' | 'avatar' | 'owner'> & {
  memberCount: number;
};

/**
 * 面板能力
 */
export type PanelFeature = 'subscribe'; // 订阅变更，即用户登录时自动加入面板的房间
