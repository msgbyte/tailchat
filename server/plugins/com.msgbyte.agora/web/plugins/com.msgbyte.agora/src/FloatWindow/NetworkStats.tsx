import { localTrans } from '@capital/common';
import type { NetworkQuality } from 'agora-rtc-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Translate } from '../translate';
import { useClient } from './client';

const Root = styled.div`
  display: flex;
  position: absolute;
  padding: 4px 8px;
  z-index: 20;

  div + div {
    margin-left: 8px;
  }
`;

export const NetworkStats: React.FC = React.memo(() => {
  const client = useClient();
  const [stats, setStats] = useState<NetworkQuality>(undefined);

  useEffect(() => {
    const cb = (stats: NetworkQuality) => {
      setStats(stats);
    };

    client.on('network-quality', cb);

    return () => {
      client.off('network-quality', cb);
    };
  }, []);

  if (!stats) {
    return null;
  }

  return (
    <Root>
      <div>
        {Translate.uplink}: {parseQualityText(stats.uplinkNetworkQuality)}
      </div>
      <div>
        {Translate.downlink}: {parseQualityText(stats.downlinkNetworkQuality)}
      </div>
    </Root>
  );
});
NetworkStats.displayName = 'NetworkStats';

function parseQualityText(quality: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
  if (quality === 1 || quality === 2) {
    return localTrans({
      'zh-CN': '优秀',
      'en-US': 'Good',
    });
  }

  if (quality === 3 || quality === 4) {
    return localTrans({
      'zh-CN': '一般',
      'en-US': 'Normal',
    });
  }

  if (quality === 5 || quality === 6) {
    return localTrans({
      'zh-CN': '差',
      'en-US': 'Bad',
    });
  }

  return localTrans({
    'zh-CN': '未知',
    'en-US': 'Unknown',
  });
}
