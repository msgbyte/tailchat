import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  paddingTop: 10,
  paddingBottom: 10,

  '.ant-empty': {
    paddingTop: 80,
  },

  '.list': {
    height: '100%',
    overflow: 'auto',
  },

  '.create-btn': {
    position: 'absolute',
    right: 20,
    bottom: 20,

    '> .anticon': {
      fontSize: 24,
    },
  },
});

const PAGE_SIZE = 20;

const GroupTopicPanelRender: React.FC = React.memo(() => {
  const panelInfo = useGroupPanelContext();
  const { panelId, groupId } = panelInfo;
  const {
    topicMap,
    addTopicPanel,
    addTopicItem,
    updateTopicItem,
    resetTopicPanel,
  } = useTopicStore();
  const topicList = topicMap[panelId];
  const currentPageRef = useRef(1);
  const [hasMore, setHasMore] = useState(true);

  const [{ loading }, fetch] = useAsyncRequest(
    async (page = 1) => {
      if (!groupId || !panelId) {
        return [];
      }

      const { data: list } = await request.post('list', {
        groupId,
        panelId,
        page,
        size: PAGE_SIZE,
      });

      if (Array.isArray(list)) {
        addTopicPanel(panelId, list);
        if (list.length !== PAGE_SIZE) {
          // 没有更多了
          setHasMore(false);
        }
      }
    },
    [groupId, panelId, addTopicPanel]
  );

  useEffect(() => {
    /**
     * 加载的时候获取列表
     */
    fetch();

    return () => {
      // 因为监听更新只在当前激活的面板中监听，还没添加到全局，因此为了保持面板状态需要清理面板状态
      // TODO: 增加群组级别的更新监听新增后可以移除
      resetTopicPanel(panelId);
    };
  }, []);

  const handleLoadMore = useCallback(() => {
    currentPageRef.current += 1;
    fetch(currentPageRef.current);
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
        <div className="list">
          {topicList.map((item, i) => (
            <TopicCard key={i} topic={item} />
          ))}

          {hasMore ? (
            <Button type="link" disabled={loading} onClick={handleLoadMore}>
              {loading ? Translate.loading : Translate.loadMore}
            </Button>
          ) : (
            <Button type="link" disabled={true} onClick={handleLoadMore}>
              {Translate.noMore}
            </Button>
          )}
        </div>
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
