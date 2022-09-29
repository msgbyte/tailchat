import { regGroupPanel, Loadable } from '@capital/common';
import { Translate } from './translate';

const PLUGIN_NAME = 'com.msgbyte.topic';

regGroupPanel({
  name: `${PLUGIN_NAME}/grouppanel`,
  label: Translate.topicpanel,
  provider: PLUGIN_NAME,
  render: Loadable(() => import('./group/GroupTopicPanelRender')),
});
