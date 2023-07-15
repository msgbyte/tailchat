/* eslint-disable @typescript-eslint/no-explicit-any */

/// <reference types="react" />

/**
 * 该文件由 Tailchat 自动生成
 * 用于插件的类型声明
 * 生成命令: pnpm run plugins:declaration:generate
 */

/**
 * Tailchat 通用
 */
declare module '@capital/common' {
  export const useGroupPanelParams: any;

  /**
   * 打开模态框
   * @deprecated 请从 @capital/component 引入
   */
  export const openModal: (
    content: React.ReactNode,

    props?: {
      /**
       * 是否显示右上角的关闭按钮
       * @default false
       */
      closable?: boolean;

      /**
       * 遮罩层是否可关闭
       */
      maskClosable?: boolean;

      /**
       * 关闭modal的回调
       */
      onCloseModal?: () => void;
    }
  ) => number;

  /**
   * @deprecated 请从 @capital/component 引入
   */
  export const closeModal: any;

  /**
   * @deprecated 请从 @capital/component 引入
   */
  export const ModalWrapper: any;

  /**
   * @deprecated 请从 @capital/component 引入
   */
  export const useModalContext: any;

  /**
   * @deprecated 请从 @capital/component 引入
   */
  export const openConfirmModal: any;

  /**
   * @deprecated 请从 @capital/component 引入
   */
  export const openReconfirmModal: any;

  /**
   * @deprecated 请从 @capital/component 引入
   */
  export const Loadable: any;

  export const useIsMobile: any;

  export const getGlobalState: any;

  export const useGlobalSocketEvent: <T>(
    eventName: string,
    callback: (data: T) => void
  ) => void;

  export const setUserJWT: any;

  export const getJWTUserInfo: () => Promise<{
    _id?: string;
    nickname?: string;
    email?: string;
    avatar?: string;
  }>;

  export const dataUrlToFile: any;

  export const urlSearchStringify: any;

  export const urlSearchParse: any;

  export const appendUrlSearch: any;

  export const getServiceWorkerRegistration: any;

  export const postMessageEvent: any;

  export const getServiceUrl: () => string;

  export const getCachedUserInfo: (
    userId: string,
    refetch?: boolean
  ) => Promise<{
    _id: string;
    email: string;
    nickname: string;
    discriminator: string;
    avatar: string | null;
    temporary: boolean;
  }>;

  export const getCachedConverseInfo: any;

  export const getCachedBaseGroupInfo: any;

  export const getCachedUserSettings: any;

  /**
   * 本地翻译
   * @example
   * localTrans({'zh-CN': '你好', 'en-US': 'Hello'});
   *
   * @param trans 翻译对象
   */
  export const localTrans: (trans: Record<'zh-CN' | 'en-US', string>) => string;

  export const getLanguage: any;

  export const sharedEvent: any;

  export const useAsync: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    deps?: React.DependencyList
  ) => { loading: boolean; value?: any; error?: Error };

  export const useAsyncFn: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    deps?: React.DependencyList
  ) => [{ loading: boolean; value?: any; error?: Error }, T];

  export const useAsyncRefresh: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    deps?: React.DependencyList
  ) => { loading: boolean; value?: any; error?: Error; refresh: () => void };

  export const useAsyncRequest: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    deps?: React.DependencyList
  ) => [{ loading: boolean; value?: any }, T];

  export const useEvent: any;

  export const uploadFile: any;

  export const showToasts: (
    message: string,
    type?: 'info' | 'success' | 'error' | 'warning'
  ) => void;

  export const showSuccessToasts: any;

  export const showErrorToasts: (error: any) => void;

  export const fetchAvailableServices: any;

  export const isValidStr: (str: any) => str is string;

  export const useGroupPanelInfo: any;

  export const sendMessage: any;

  export const showMessageTime: any;

  export const joinArray: any;

  export const useConverseMessageContext: any;

  export const loginWithToken: any;

  export const useWatch: any;

  export const navigate: any;

  export const useLocation: any;

  export const useNavigate: any;

  /**
   * @deprecated please use createMetaFormSchema from @capital/component
   */
  export const createFastFormSchema: any;

  /**
   * @deprecated please use metaFormFieldSchema from @capital/component
   */
  export const fieldSchema: any;

  export const getTextColorHex: any;

  export const useCurrentUserInfo: any;

  export const createPluginRequest: (pluginName: string) => {
    get: (actionName: string, config?: any) => Promise<any>;
    post: (actionName: string, data?: any, config?: any) => Promise<any>;
  };

  export const postRequest: any;

  export const pluginCustomPanel: any;

  export const regCustomPanel: (info: {
    position:
      | 'personal'
      | 'setting'
      | 'groupdetail'
      | 'navbar-more'
      | 'navbar-group'
      | 'navbar-personal';
    icon: string;
    name: string;
    label: string;
    render: React.ComponentType;
  }) => void;

  export const pluginGroupPanel: any;

  export const regGroupPanel: any;

  export const messageInterpreter: {
    name?: string;
    explainMessage: (message: string) => React.ReactNode;
  }[];

  export const regMessageInterpreter: (interpreter: {
    name?: string;
    explainMessage: (message: string) => React.ReactNode;
  }) => void;

  export const getMessageRender: (message: string) => React.ReactNode;

  export const regMessageRender: (
    render: (message: string) => React.ReactNode
  ) => void;

  export const getMessageTextDecorators: any;

  export const regMessageTextDecorators: any;

  export const ChatInputActionContextProps: any;

  export const pluginChatInputActions: any;

  export const regChatInputAction: any;

  export const pluginChatInputButtons: any;

  export const regChatInputButton: any;

  export const regSocketEventListener: (item: {
    eventName: string;
    eventFn: (...args: any[]) => void;
  }) => void;

  export const pluginColorScheme: any;

  export const regPluginColorScheme: any;

  export const pluginInspectServices: any;

  export const regInspectService: any;

  export const pluginMessageExtraParsers: any;

  export const regMessageExtraParser: any;

  export const pluginRootRoute: any;

  export const regPluginRootRoute: any;

  export const pluginPanelActions: any;

  export const regPluginPanelAction: (
    action:
      | {
          name: string;
          label: string;
          icon: string;
          position: 'group';
          onClick: (ctx: { groupId: string; panelId: string }) => void;
        }
      | {
          name: string;
          label: string;
          icon: string;
          position: 'dm';
          onClick: (ctx: { converseId: string }) => void;
        }
  ) => void;

  export const pluginPermission: any;

  export const regPluginPermission: (permission: {
    /**
     * 权限唯一key, 用于写入数据库
     * 如果为插件则权限点应当符合命名规范, 如: plugin.com.msgbyte.github.manage
     */
    key: string;
    /**
     * 权限点显示名称
     */
    title: string;
    /**
     * 权限描述
     */
    desc: string;
    /**
     * 是否默认开启
     */
    default: boolean;
    /**
     * 是否依赖其他权限点
     */
    required?: string[];
  }) => void;

  export const pluginGroupPanelBadges: any;

  export const regGroupPanelBadge: any;

  export const pluginGroupTextPanelExtraMenus: any;

  export const regPluginGroupTextPanelExtraMenu: any;

  export const pluginUserExtraInfo: any;

  export const regUserExtraInfo: any;

  export const pluginSettings: any;

  export const regPluginSettings: any;

  export const pluginInboxItemMap: any;

  export const regPluginInboxItemMap: any;

  export const pluginGroupConfigItems: any;

  export const regPluginGroupConfigItem: any;

  export const pluginLoginAction: any;

  export const regLoginAction: any;

  export const useGroupIdContext: () => string;

  export const useGroupPanelContext: () => {
    groupId: string;
    panelId: string;
  } | null;

  export const useSocketContext: any;
}

/**
 * Tailchat 组件
 */
declare module '@capital/component' {
  export const Button: any;

  export const Checkbox: any;

  export const Input: any;

  export const Divider: any;

  export const Space: any;

  export const Menu: any;

  export const Table: any;

  export const Switch: any;

  export const Tooltip: any;

  /**
   * @link https://ant.design/components/notification-cn/
   */
  export const notification: any;

  export const Empty: React.FC<
    React.PropsWithChildren<{
      prefixCls?: string;
      className?: string;
      style?: React.CSSProperties;
      imageStyle?: React.CSSProperties;
      image?: React.ReactNode;
      description?: React.ReactNode;
    }>
  >;

  export const Popover: any;

  export const Tag: any;

  export const Skeleton: any;

  export const TextArea: any;

  export const Avatar: any;

  export const SensitiveText: React.FC<{ className?: string; text: string }>;

  export const Icon: React.FC<{ icon: string } & React.SVGProps<SVGSVGElement>>;

  export const CopyableText: React.FC<{
    className?: string;
    style?: React.CSSProperties;
    config?:
      | boolean
      | {
          text?: string;
          onCopy?: (event?: React.MouseEvent<HTMLDivElement>) => void;
          icon?: React.ReactNode;
          tooltips?: boolean | React.ReactNode;
          format?: 'text/plain' | 'text/html';
        };
  }>;

  export const WebFastForm: any;

  export const WebMetaForm: any;

  export const createMetaFormSchema: any;

  export const metaFormFieldSchema: any;

  export const Link: any;

  export const MessageAckContainer: any;

  export const BaseChatInputButton: any;

  export const useChatInputActionContext: any;

  export const GroupExtraDataPanel: any;

  export const Image: any;

  export const IconBtn: React.FC<{
    icon: string;
    className?: string;
    iconClassName?: string;
    size?: 'small' | 'middle' | 'large';
    shape?: 'circle' | 'square';
    title?: string;
    danger?: boolean;
    active?: boolean;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLElement>;
  }>;

  export const PillTabs: any;

  export const PillTabPane: any;

  export const FullModalField: any;

  export const DefaultFullModalInputEditorRender: any;

  export const DefaultFullModalTextAreaEditorRender: any;

  export const openModal: (
    content: React.ReactNode,

    props?: {
      /**
       * 是否显示右上角的关闭按钮
       * @default false
       */
      closable?: boolean;

      /**
       * 遮罩层是否可关闭
       */
      maskClosable?: boolean;

      /**
       * 关闭modal的回调
       */
      onCloseModal?: () => void;
    }
  ) => number;

  export const closeModal: any;

  export const ModalWrapper: any;

  export const useModalContext: any;

  export const openConfirmModal: any;

  export const openReconfirmModal: any;

  export const Loadable: any;

  export const Loading: React.FC<{
    spinning: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }>;

  export const LoadingSpinner: React.FC<{ tip?: string }>;

  export const LoadingOnFirst: React.FC<{
    spinning: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }>;

  export const SidebarView: any;

  export const GroupPanelSelector: any;

  export const Emoji: any;

  export const PortalAdd: any;

  export const PortalRemove: any;

  export const ErrorBoundary: any;

  export const ErrorView: React.FC<{
    error: Error;
  }>;

  export const UserAvatar: React.FC<{
    userId: string;
    className?: string;
    style?: React.CSSProperties;
    size?: 'large' | 'small' | 'default' | number;
  }>;

  export const UserName: React.FC<{
    userId: string;
    className?: string;
    style?: React.CSSProperties;
  }>;

  export const Markdown: any;

  export const MarkdownEditor: any;

  export const Webview: any;

  export const WebviewKeepAlive: any;

  export const Card: any;

  export const Problem: any;

  export const JumpToButton: any;

  export const JumpToGroupPanelButton: any;

  export const JumpToConverseButton: any;

  export const NoData: any;
}
