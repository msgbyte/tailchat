import React from 'react';
import { TopicCard } from '../components/TopicCard';
import './GroupTopicPanelRender.less';

const GroupTopicPanelRender: React.FC = React.memo(() => {
  return (
    <div className="plugin-topic-group-panel">
      {Array.from({ length: 20 }).map((_, i) => (
        <TopicCard key={i} />
      ))}
    </div>
  );
});
GroupTopicPanelRender.displayName = 'GroupTopicPanelRender';

export default GroupTopicPanelRender;
