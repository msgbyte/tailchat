import { buildRegList, FastFormFieldMeta } from 'tailchat-shared';

/**
 * 注册群组面板
 */
export interface PluginGroupPanel {
  /**
   * 面板唯一标识
   * @example com.msgbyte.webpanel/grouppanel
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
  render: React.ComponentType;
}
export const [pluginGroupPanel, regGroupPanel] =
  buildRegList<PluginGroupPanel>();
