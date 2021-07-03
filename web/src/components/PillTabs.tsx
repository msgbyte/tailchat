import { Tabs } from 'antd';
import React from 'react';

import './PillTabs.less';

export const PillTabs = React.memo((props) => {
  return (
    <Tabs className="pill-tabs" type="card" animated={true}>
      {props.children}
    </Tabs>
  );
});
PillTabs.displayName = 'PillTabs';

export const PillTabPane = Tabs.TabPane;
