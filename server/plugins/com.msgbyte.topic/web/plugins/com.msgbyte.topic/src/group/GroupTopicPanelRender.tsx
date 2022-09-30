import React, { useEffect } from 'react';
import { TopicCard } from '../components/TopicCard';
import { useAsyncRequest, useGroupPanelContext } from '@capital/common';
import { Empty } from '@capital/component';
import { request } from '../request';
import './GroupTopicPanelRender.less';

const GroupTopicPanelRender: React.FC = React.memo(() => {
  const panelInfo = useGroupPanelContext();

  const [{ value: list = [] }, fetch] = useAsyncRequest(async () => {
    if (!panelInfo) {
      return [];
    }

    const { data } = await request.get('list', {
      params: {
        groupId: panelInfo.groupId,
        panelId: panelInfo.panelId,
      },
    });

    return data;
  }, [panelInfo]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="plugin-topic-group-panel">
      {Array.isArray(list) && list.length > 0 ? (
        list.map((_, i) => <TopicCard key={i} />)
      ) : (
        <Empty />
      )}
    </div>
  );
});
GroupTopicPanelRender.displayName = 'GroupTopicPanelRender';

export default GroupTopicPanelRender;
