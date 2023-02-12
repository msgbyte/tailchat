import React from 'react';
import { TopicCard } from '../components/TopicCard';
import { Problem, JumpToGroupPanelButton } from '@capital/component';
import { Translate } from '../translate';

export const TopicInboxItem: React.FC<{ inboxItem: any }> = React.memo(
  (props) => {
    const payload = props.inboxItem.payload;
    if (!payload) {
      return <Problem text={Translate.topicDataError} />;
    }

    return (
      <div style={{ width: '100%' }}>
        <div style={{ height: '100%', overflow: 'auto', paddingBottom: 50 }}>
          <TopicCard topic={payload} />
        </div>

        <JumpToGroupPanelButton
          groupId={payload.groupId}
          panelId={payload.panelId}
        />
      </div>
    );
  }
);
TopicInboxItem.displayName = 'TopicInboxItem';
