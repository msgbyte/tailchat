import React from 'react';
import { useAsync } from '@capital/common';
import { request } from '../request';

export const DiscoverPanel: React.FC = React.memo(() => {
  const { value: list } = useAsync(async () => {
    const { data } = await request.get('all');

    return data.list ?? [];
  }, []);

  return <div>DiscoverPanel: {JSON.stringify(list)}</div>;
});
DiscoverPanel.displayName = 'DiscoverPanel';
