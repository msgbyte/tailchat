import {
  getMessageRender,
  regGroupPanel,
  regPluginInboxItemMap,
} from '@capital/common';
import { Loadable } from '@capital/component';
import { Translate } from './translate';

const PLUGIN_NAME = 'com.msgbyte.topic';

regGroupPanel({
  name: `${PLUGIN_NAME}/grouppanel`,
  label: Translate.topicpanel,
  provider: PLUGIN_NAME,
  render: Loadable(() => import('./group/GroupTopicPanelRender')),
  feature: ['subscribe', 'ack'],
});

regPluginInboxItemMap('plugin:com.msgbyte.topic.comment', {
  source: Translate.topicpanel,
  getPreview: (item) => {
    return {
      title: Translate.topicpanel,
      desc: getMessageRender(item?.payload?.content ?? ''),
    };
  },
  render: Loadable(() =>
    import('./inbox/TopicInboxItem').then((module) => module.TopicInboxItem)
  ),
});
