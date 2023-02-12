import { Input } from 'antd';

export {
  Button,
  Checkbox,
  Input,
  Divider,
  Space,
  Menu,
  Table,
  Switch,
  Tooltip,
  notification,
  Empty,
} from 'antd';
export const TextArea = Input.TextArea;
export {
  Avatar,
  SensitiveText,
  Icon,
  CopyableText,
  /**
   * @deprecated please use WebMetaForm
   */
  WebMetaForm as WebFastForm,
  WebMetaForm,
  createMetaFormSchema,
  metaFormFieldSchema,
} from 'tailchat-design';
export { Link } from 'react-router-dom';

export { MessageAckContainer } from '@/components/ChatBox/ChatMessageList/MessageAckContainer';
export { Image } from '@/components/Image';
export { IconBtn } from '@/components/IconBtn';
export { PillTabs, PillTabPane } from '@/components/PillTabs';
export { LoadingSpinner } from '@/components/LoadingSpinner';
export {
  FullModalField,
  DefaultFullModalInputEditorRender,
  DefaultFullModalTextAreaEditorRender,
} from '@/components/FullModal/Field';
export {
  openModal,
  closeModal,
  ModalWrapper,
  useModalContext,
  openConfirmModal,
  openReconfirmModal,
} from '@/components/Modal';
export { Loadable } from '@/components/Loadable';
export { Loading } from '@/components/Loading';
export { LoadingOnFirst } from '@/components/LoadingOnFirst';
export { SidebarView } from '@/components/SidebarView';
export { GroupPanelSelector } from '@/components/GroupPanelSelector';
export { Emoji } from '@/components/Emoji';
export { PortalAdd, PortalRemove } from '@/components/Portal';
export { ErrorBoundary } from '@/components/ErrorBoundary';
export { UserAvatar } from '@/components/UserAvatar';
export { UserName } from '@/components/UserName';
export { Markdown } from '@/components/Markdown';
export { Webview, WebviewKeepAlive } from '@/components/Webview';
export { Card } from '@/components/Card';
export { Problem } from '@/components/Problem';
export {
  JumpToButton,
  JumpToGroupPanelButton,
  JumpToConverseButton,
} from '@/components/JumpToButton';
