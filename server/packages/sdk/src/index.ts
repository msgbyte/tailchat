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
} from './services/types';
export { parseLanguageFromHead } from './services/lib/i18n/parser';
export { t } from './services/lib/i18n';
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
export type { MessageMetaStruct } from './structs/chat';
export type { BuiltinEventMap } from './structs/events';
export type {
  GroupStruct,
  GroupRoleStruct,
  GroupPanelStruct,
} from './structs/group';
export type { UserStruct } from './structs/user';

// db
export * as db from './db';

export * from './const';

// other
export { Utils, Errors } from 'moleculer';

/**
 * 统一处理未捕获的错误
 * NOTICE: 未经测试
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection', reason);
});
process.on('uncaughtException', (error, origin) => {
  console.error('uncaughtException', error);
});
