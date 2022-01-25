import React from 'react';
import { Translate } from '../translate';
import { util } from 'genshin-gacha-kit';
import { useAsync } from '@capital/common';
import { PillTabs, PillTabPane } from '@capital/component';
import './index.less';
import { GachaPool } from './GachaPool';

const GenshinPanel: React.FC = React.memo(() => {
  const { value: gachaList } = useAsync(() => {
    return util.getGachaIndex();
  }, []);

  return (
    <div className="plugin-genshin-panel">
      <div className="gacha-title">
        {Translate.genshin} - {Translate.gacha}
      </div>

      <PillTabs>
        {(gachaList ?? []).map((item) => (
          <PillTabPane
            key={item.gacha_id}
            tab={`${item.gacha_name}(${item.begin_time} - ${item.end_time})`}
          >
            <GachaPool gachaId={item.gacha_id} />
          </PillTabPane>
        ))}
      </PillTabs>
    </div>
  );
});
GenshinPanel.displayName = 'GenshinPanel';

export default GenshinPanel;
