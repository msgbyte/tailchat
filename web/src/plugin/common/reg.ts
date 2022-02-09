import type { ChatInputActionContextProps } from '@/components/ChatBox/ChatInputBox/context';
import {
  buildRegFn,
  buildRegList,
  ChatMessage,
  FastFormFieldMeta,
  GroupPanel,
  regSocketEventListener,
} from 'tailchat-shared';

/**
 * 注册自定义面板
 */
export interface PluginCustomPanel {
  /**
   * 面板位置:
   *
   * - personal: 个人面板中的一项
   * - setting: 设置面板
   * - navbar: 导航栏(未实装)
   */
  position: 'personal' | 'setting' | 'navbar';

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
  extraFormMeta: FastFormFieldMeta[];

  /**
   * 该面板如何渲染
   */
  render: React.ComponentType<{ panelInfo: GroupPanel }>;
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
export const [getMessageTextDecorators, regMessageTextDecorators] = buildRegFn<
  () => {
    url: (plain: string) => string;
    image: (plain: string, attrs: Record<string, unknown>) => string;
  }
>('message-text-decorators', () => ({
  url: (plain: string) => plain,
  image: (plain: string) => plain,
}));

interface ChatInputAction {
  label: string;
  onClick: (actions: ChatInputActionContextProps) => void;
}
export type { ChatInputActionContextProps };
export const [pluginChatInputActions, regChatInputAction] =
  buildRegList<ChatInputAction>();

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
