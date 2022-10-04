import React, { useCallback, useEffect } from 'react';
import { TopicCard } from '../components/TopicCard';
import { useAsyncRequest, useGroupPanelContext } from '@capital/common';
import {
  Button,
  Empty,
  IconBtn,
  openModal,
  closeModal,
} from '@capital/component';
import { request } from '../request';
import { Translate } from '../translate';
import { TopicCreate } from '../components/modals/TopicCreate';
import './GroupTopicPanelRender.less';

const GroupTopicPanelRender: React.FC = React.memo(() => {
  const panelInfo = useGroupPanelContext();

  const [{ value: list = [] }, fetch] = useAsyncRequest(async () => {
    if (!panelInfo.groupId || !panelInfo.panelId) {
      return [];
    }

    const { data } = await request.get('list', {
      params: {
        groupId: panelInfo.groupId,
        panelId: panelInfo.panelId,
      },
    });

    return data;
  }, [panelInfo.groupId, panelInfo.panelId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleCreateTopic = useCallback(() => {
    const key = openModal(
      <TopicCreate
        onCreate={async (text) => {
          await request.post('create', {
            groupId: panelInfo.groupId,
            panelId: panelInfo.panelId,
            content: text,
          });

          fetch();

          closeModal(key);
        }}
      />
    );
  }, [panelInfo, fetch]);

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
