import { regGroupPanel } from '@capital/common';
import { Loadable } from '@capital/component';
import { Translate } from './translate';

const PLUGIN_ID = 'com.msgbyte.mdpanel';
const PLUGIN_NAME = 'Markdown Panel';

console.log(`Plugin ${PLUGIN_NAME}(${PLUGIN_ID}) is loaded`);

/**
 * @note 应该用 PLUGIN_ID 而不是 PLUGIN_NAME, 后续需要逐步迁移
 */
regGroupPanel({
  name: `${PLUGIN_NAME}/customwebpanel`,
  label: Translate.name,
  provider: PLUGIN_NAME,
  render: Loadable(() => import('./group/MarkdownPanel'), {
    componentName: `${PLUGIN_ID}:MarkdownPanel`,
  }),
});
