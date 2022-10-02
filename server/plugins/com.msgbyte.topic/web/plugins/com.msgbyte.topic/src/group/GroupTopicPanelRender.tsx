import React, { useCallback, useEffect } from 'react';
import { TopicCard } from '../components/TopicCard';
import {
  showToasts,
  useAsyncRequest,
  useGroupPanelContext,
} from '@capital/common';
import { Button, Empty, IconBtn } from '@capital/component';
import { request } from '../request';
import './GroupTopicPanelRender.less';
import { Translate } from '../translate';

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

  const handleCreateTopic = useCallback(() => {
    showToasts('TODO: 创建话题');
  }, []);

  return (
    <div className="plugin-topic-group-panel">
      {Array.isArray(list) && list.length > 0 ? (
        list.map((_, i) => <TopicCard key={i} />)
      ) : (
        <Empty description={Translate.noTopic}>
          <Button type="primary" onClick={handleCreateTopic}>
            {Translate.createBtn}
          </Button>
        </Empty>
      )}

      <IconBtn
        className="create-btn"
        size="large"
        icon="mdi:plus"
        title={Translate.createBtn}
        onClick={handleCreateTopic}
      />
    </div>
  );
});
GroupTopicPanelRender.displayName = 'GroupTopicPanelRender';

export default GroupTopicPanelRender;
