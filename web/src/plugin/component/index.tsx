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
} from 'antd';
export const TextArea = Input.TextArea;
export { Image } from '@/components/Image';
export { Icon } from '@/components/Icon';
export { PillTabs, PillTabPane } from '@/components/PillTabs';
export { LoadingSpinner } from '@/components/LoadingSpinner';
export {
  /**
   * @deprecated please use WebMetaForm
   */
  WebMetaForm as WebFastForm,
  WebMetaForm,
  createMetaFormSchema,
  metaFormFieldSchema,
} from 'tailchat-design';
export {
  FullModalField,
  DefaultFullModalInputEditorRender,
  DefaultFullModalTextAreaEditorRender,
} from '@/components/FullModal/Field';
export { Loading } from '@/components/Loading';
export { SidebarView } from '@/components/SidebarView';
export { GroupPanelSelector } from '@/components/GroupPanelSelector';
export { Emoji } from '@/components/Emoji';
export { PortalAdd, PortalRemove } from '@/components/Portal';
export { ErrorBoundary } from '@/components/ErrorBoundary';
