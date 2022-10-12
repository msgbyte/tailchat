import React, { useCallback, useEffect } from 'react';
import { TopicCard } from '../components/TopicCard';
import {
  showSuccessToasts,
  useAsyncRequest,
  useGlobalSocketEvent,
  useGroupPanelContext,
} from '@capital/common';
import {
  Button,
  Empty,
  IconBtn,
  openModal,
  closeModal,
  LoadingOnFirst,
} from '@capital/component';
import { request } from '../request';
import { Translate } from '../translate';
import { TopicCreate } from '../components/modals/TopicCreate';
import styled from 'styled-components';
import { useTopicStore } from '../store';
import type { GroupTopic } from '../types';

const Root = styled(LoadingOnFirst)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',

  '.create-btn': {
    position: 'absolute',
    right: 20,
    bottom: 20,

    '> .anticon': {
      fontSize: 24,
    },
  },
});

const GroupTopicPanelRender: React.FC = React.memo(() => {
  const panelInfo = useGroupPanelContext();
  const { panelId, groupId } = panelInfo;
  const { topicMap, addTopicPanel, addTopicItem, updateTopicItem } =
    useTopicStore();
  const topicList = topicMap[panelId];

  const [{ loading }, fetch] = useAsyncRequest(async () => {
    if (!groupId || !panelId) {
      return [];
    }

    const { data } = await request.get('list', {
      params: {
        groupId,
        panelId,
      },
    });

    addTopicPanel(panelId, data);
  }, [groupId, panelId, addTopicPanel]);

  useEffect(() => {
    /**
     * 加载的时候获取列表
     */
    fetch();
  }, [fetch]);

  useGlobalSocketEvent(
    'plugin:com.msgbyte.topic.create',
    (topic: GroupTopic) => {
      /**
       * 仅处理当前面板的话题更新
       */
      if (topic.panelId === panelId) {
        addTopicItem(panelId, topic);
      }
    }
  );

  useGlobalSocketEvent(
    'plugin:com.msgbyte.topic.createComment',
    (topic: GroupTopic) => {
      /**
       * 仅处理当前面板的话题更新
       */
      if (topic.panelId === panelId) {
        updateTopicItem(panelId, topic);
      }
    }
  );

  const handleCreateTopic = useCallback(() => {
    const key = openModal(
      <TopicCreate
        onCreate={async (text) => {
          await request.post('create', {
            groupId,
            panelId,
            content: text,
          });

          showSuccessToasts();
          closeModal(key);
        }}
      />
    );
  }, [panelInfo, fetch]);

  return (
    <Root spinning={loading}>
      {Array.isArray(topicList) && topicList.length > 0 ? (
        topicList.map((item, i) => <TopicCard key={i} topic={item} />)
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
    </Root>
  );
});
GroupTopicPanelRender.displayName = 'GroupTopicPanelRender';

export default GroupTopicPanelRender;
