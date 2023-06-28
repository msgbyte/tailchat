export { defaultBrokerConfig } from './runner/moleculer.config';
export { TcService } from './services/base';
export { TcBroker } from './services/broker';
export type { TcDbService } from './services/mixins/db.mixin';
export type {
  TcContext,
  TcPureContext,
  PureContext,
  UserJWTPayload,
  GroupBaseInfo,
  PureServiceSchema,
  PureService,
  PanelFeature,
} from './services/types';
export { parseLanguageFromHead } from './services/lib/i18n/parser';
export { t } from './services/lib/i18n';
export { ApiGatewayMixin } from './services/lib/moleculer-web';
export * as ApiGatewayErrors from './services/lib/moleculer-web/errors';
export * from './services/lib/errors';
export { PERMISSION, allPermission } from './services/lib/role';
export { call } from './services/lib/call';
export {
  config,
  buildUploadUrl,
  builtinAuthWhitelist,
  checkEnvTrusty,
} from './services/lib/settings';

// struct
export type {
  MessageStruct,
  MessageReactionStruct,
  MessageMetaStruct,
  InboxStruct,
} from './structs/chat';
export type { BuiltinEventMap } from './structs/events';
export type {
  GroupStruct,
  GroupRoleStruct,
  GroupPanelStruct,
} from './structs/group';
export { GroupPanelType } from './structs/group';
export { userType } from './structs/user';
export type { UserStruct, UserType, UserStructWithToken } from './structs/user';

// db
export * as db from './db';

// openapi
export * from './openapi';

export * from './const';

// other
export { Utils, Errors } from 'moleculer';
export type { BrokerOptions } from 'moleculer';

/**
 * 统一处理未捕获的错误, 防止直接把应用打崩
 * NOTICE: 未经测试
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection', reason);
});
process.on('uncaughtException', (error, origin) => {
  console.error('uncaughtException', error);
});
