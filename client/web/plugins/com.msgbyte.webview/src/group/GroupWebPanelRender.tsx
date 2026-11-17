import React from 'react';
import { Translate } from '../translate';
import { GroupPanelContainer, WebviewKeepAlive } from '@capital/component';
import { useGroupPanelContext } from '@capital/common';
import { normalizePanelUrl } from '../url';

const GroupWebPanelRender: React.FC<{ panelInfo: any }> = (props) => {
  const { groupId, panelId } = useGroupPanelContext();
  const panelInfo = props.panelInfo;

  if (!panelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  const url = normalizePanelUrl(String(panelInfo?.meta?.url));
  const background = panelInfo?.meta?.background ?? false;

  return (
    <GroupPanelContainer groupId={groupId} panelId={panelId}>
      <WebviewKeepAlive
        key={String(url)}
        className={`w-full h-full ${background ? 'bg-white' : ''}`}
        url={url}
      />
    </GroupPanelContainer>
  );
};
GroupWebPanelRender.displayName = 'GroupWebPanelRender';

export default GroupWebPanelRender;
