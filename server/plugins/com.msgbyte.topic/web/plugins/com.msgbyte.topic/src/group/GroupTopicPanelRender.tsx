import React, { useCallback, useEffect } from 'react';
import { TopicCard } from '../components/TopicCard';
import { useAsyncRequest, useGroupPanelContext } from '@capital/common';
import {
  Button,
  Empty,
  IconBtn,
  openModal,
  closeModal,
  LoadingSpinner,
} from '@capital/component';
import { request } from '../request';
import { Translate } from '../translate';
import { TopicCreate } from '../components/modals/TopicCreate';
import styled from 'styled-components';

const Root = styled.div({
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Root>
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
    </Root>
  );
});
GroupTopicPanelRender.displayName = 'GroupTopicPanelRender';

export default GroupTopicPanelRender;
