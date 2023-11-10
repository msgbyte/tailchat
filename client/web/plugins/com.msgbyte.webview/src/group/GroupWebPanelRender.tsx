import React from 'react';
import { Translate } from '../translate';
import { GroupPanelContainer, WebviewKeepAlive } from '@capital/component';
import urlRegex from 'url-regex';
import { useGroupPanelContext } from '@capital/common';

const GroupWebPanelRender: React.FC<{ panelInfo: any }> = (props) => {
  const { groupId, panelId } = useGroupPanelContext();
  const panelInfo = props.panelInfo;

  if (!panelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  let url = String(panelInfo?.meta?.url);
  if (
    !url.includes('://') &&
    urlRegex({ exact: true, strict: false }).test(url)
  ) {
    // 不包含协议, 但是是个网址
    url = 'https://' + url;
  }

  return (
    <GroupPanelContainer groupId={groupId} panelId={panelId}>
      <WebviewKeepAlive key={String(url)} className="w-full h-full" url={url} />
    </GroupPanelContainer>
  );
};
GroupWebPanelRender.displayName = 'GroupWebPanelRender';

export default GroupWebPanelRender;
