import React, { useCallback, useEffect } from 'react';
import { TopicCard } from '../components/TopicCard';
import {
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

  const [{ value: list = [], loading }, fetch] = useAsyncRequest(async () => {
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

  useGlobalSocketEvent('plugin:com.msgbyte.topic.create', () => {
    fetch(); // not good, 待优化
  });

  useGlobalSocketEvent('plugin:com.msgbyte.topic.createComment', () => {
    fetch(); // not good, 待优化
  });

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
    <Root spinning={loading}>
      {Array.isArray(list) && list.length > 0 ? (
        list.map((item, i) => <TopicCard key={i} topic={item} />)
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
