import type { ChatInputActionContextProps } from '@/components/ChatBox/ChatInputBox/context';
import {
  buildRegFn,
  buildRegList,
  ChatMessage,
  GroupPanel,
  regSocketEventListener,
  PermissionItemType,
  GroupPanelFeature,
  InboxItem,
  buildRegMap,
  BasicInboxItem,
} from 'tailchat-shared';
import type { MetaFormFieldMeta } from 'tailchat-design';
import type { FullModalFactoryConfig } from '@/components/FullModal/Factory';
import type { ReactElement } from 'react';
import type { BaseCardPayload } from '@/components/Card';
export type { BaseCardPayload };
/**
 * 注册自定义面板
 */
export interface PluginCustomPanel {
  /**
   * 面板位置:
   *
   * - personal: 个人面板中的一项
   * - setting: 设置面板
   * - groupdetail: 群组详情
   * - navbar*: 导航栏
   */
  position:
    | 'personal'
    | 'setting'
    | 'groupdetail'
    | 'navbar-more'
    | 'navbar-group'
    | 'navbar-personal';

  /**
   * Iconify 名
   */
  icon: string;

  /**
   * 自定义面板唯一标识名
   */
  name: string;

  /**
   * 自定义面板显示名
   */
  label: string;

  /**
   * 渲染组件
   */
  render: React.ComponentType;
}
export const [pluginCustomPanel, regCustomPanel] =
  buildRegList<PluginCustomPanel>();

export interface PluginPanelMenu {
  name: string;
  label: string;
  icon?: string;
  onClick: (panelInfo: GroupPanel) => void;
}

/**
 * 注册群组面板
 */
export interface PluginGroupPanel {
  /**
   * 面板唯一标识
   * @example com.msgbyte.webview/grouppanel
   */
  name: string;

  /**
   * 面板显示名
   */
  label: string;

  /**
   * 插件提供者, 用于引导没有安装插件的用户安装插件
   */
  provider: string;

  /**
   * 额外的表单数据, 用于创建面板时使用
   */
  extraFormMeta?: MetaFormFieldMeta[];

  /**
   * 该面板如何渲染
   */
  render: React.ComponentType<{ panelInfo: GroupPanel }>;

  /**
   * 面板项右键菜单
   */
  menus?: PluginPanelMenu[];

  /**
   * 面板功能特性
   */
  feature?: GroupPanelFeature[];
}
export const [pluginGroupPanel, regGroupPanel] =
  buildRegList<PluginGroupPanel>();

export interface PluginMessageInterpreter {
  name?: string;
  explainMessage: (message: string) => React.ReactNode;
}

/**
 * 消息解释器
 * 即用于解释消息内容, 并把结果渲染到消息下面
 */
export const [messageInterpreter, regMessageInterpreter] =
  buildRegList<PluginMessageInterpreter>();

/**
 * 消息渲染器
 * 输入消息，返回渲染节点
 */
export const [getMessageRender, regMessageRender] = buildRegFn<
  (message: string) => React.ReactNode
>('message-render', (message) => message);

/**
 * 消息渲染器
 * 输入消息，返回渲染节点
 */
const defaultMessageTextDecorators = {
  url: (url: string, label?: string) => url,
  image: (plain: string, attrs: Record<string, unknown>) => plain,
  card: (plain: string, payload: Record<string, unknown>) => plain,
  mention: (userId: string, userName: string) => `@${userName}`,
  emoji: (emojiCode: string) => emojiCode,
  serialize: (plain: string) => plain,
};
const [_getMessageTextDecorators, regMessageTextDecorators] = buildRegFn<
  () => Partial<typeof defaultMessageTextDecorators>
>('message-text-decorators', () => defaultMessageTextDecorators);
function getMessageTextDecorators() {
  return {
    ...defaultMessageTextDecorators,
    ..._getMessageTextDecorators(),
  };
}
export { getMessageTextDecorators, regMessageTextDecorators };

interface ChatInputAction {
  label: string;
  onClick: (actions: ChatInputActionContextProps) => void;
}
export type { ChatInputActionContextProps };
export const [pluginChatInputActions, regChatInputAction] =
  buildRegList<ChatInputAction>();

interface ChatInputButton {
  render: () => React.ReactElement;
}
export const [pluginChatInputButtons, regChatInputButton] =
  buildRegList<ChatInputButton>();

export { regSocketEventListener };

/**
 * 注册配色方案
 */
export const [pluginColorScheme, regPluginColorScheme] = buildRegList<{
  label: string;
  name: string;
}>();

/**
 * 注册检查服务方案
 */
export const [pluginInspectServices, regInspectService] = buildRegList<{
  label: string;
  name: string;
}>();

/**
 * 注册对消息的额外解释函数
 */
export const [pluginMessageExtraParsers, regMessageExtraParser] = buildRegList<{
  name: string;
  render: (payload: ChatMessage) => React.ReactNode;
}>();

/**
 * 注册根路由
 */
export const [pluginRootRoute, regPluginRootRoute] = buildRegList<{
  name: string;
  path: string;
  component: React.ComponentType;
}>();

export interface BasePluginPanelActionProps {
  /**
   * 唯一标识
   */
  name: string;
  /**
   * 显示名
   */
  label: string;
  /**
   * 来自iconify的图标标识
   */
  icon: string;
}

export interface GroupPluginPanelActionProps
  extends BasePluginPanelActionProps {
  position: 'group';
  onClick: (ctx: { groupId: string; panelId: string }) => void;
}

export interface DMPluginPanelActionProps extends BasePluginPanelActionProps {
  position: 'dm';
  onClick: (ctx: { converseId: string }) => void;
}

/**
 * 注册 面板操作 到面板右上角
 */
export const [pluginPanelActions, regPluginPanelAction] = buildRegList<
  GroupPluginPanelActionProps | DMPluginPanelActionProps
>();

/**
 * 注册插件权限
 */
export const [pluginPermission, regPluginPermission] =
  buildRegList<PermissionItemType>();

/**
 * 注册自定义群组面板badge
 */
export const [pluginGroupPanelBadges, regGroupPanelBadge] = buildRegList<{
  name: string;
  render: (groupId: string, panelId: string) => React.ReactNode;
}>();

/**
 * 注册自定义群组文本面板项额外操作菜单
 */
export const [
  pluginGroupTextPanelExtraMenus,
  regPluginGroupTextPanelExtraMenu,
] = buildRegList<PluginPanelMenu>();

interface PluginUserExtraInfo {
  name: string;
  label: string;
  /**
   * 自定义渲染函数
   * 可选
   */
  component?: {
    render?: React.ComponentType<{
      value: unknown;
    }>;
    editor?: React.ComponentType<{
      value: unknown;
      onSave: (val: unknown) => void;
    }>;
  };
}

/**
 * 注册用户自定义信息(比如社交账号，地理位置，手机号这些非必须的信息)
 */
export const [pluginUserExtraInfo, regUserExtraInfo] =
  buildRegList<PluginUserExtraInfo>();

type PluginSettings = FullModalFactoryConfig & {
  position: 'system'; // 后面可能还会有个人设置/群组设置
};

/**
 * 注册插件设置项
 */
export const [pluginSettings, regPluginSettings] =
  buildRegList<PluginSettings>();

interface PluginInboxItem {
  /**
   * 来源
   */
  source: string;
  getPreview: (inboxItem: BasicInboxItem) => { title: string; desc: string };
  render: React.ComponentType<{ inboxItem: BasicInboxItem }>;
}

/**
 * 注册收件箱内容
 */
export const [pluginInboxItemMap, regPluginInboxItemMap] =
  buildRegMap<PluginInboxItem>();

interface PluginCardItem {
  render: React.ComponentType<{ payload: BaseCardPayload }>;
}

/**
 * 注册卡片类型
 */
export const [pluginCardItemMap, regPluginCardItem] =
  buildRegMap<PluginCardItem>();

export const [pluginGroupConfigItems, regPluginGroupConfigItem] = buildRegList<{
  name: string;
  title: string;
  tip?: string;
  component: (props: {
    value: any;
    onChange: (val: unknown) => void;
    loading: boolean;
  }) => ReactElement;
}>();

/**
 * 注册登录操作
 */
export const [pluginLoginAction, regLoginAction] = buildRegList<{
  name: string;
  component: React.ComponentType;
}>();
