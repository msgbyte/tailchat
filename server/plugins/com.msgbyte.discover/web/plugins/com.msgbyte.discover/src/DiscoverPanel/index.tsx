import React from 'react';
import { useAsync } from '@capital/common';
import { LoadingSpinner, ErrorView, NoData } from '@capital/component';
import { request } from '../request';
import styled from 'styled-components';
import { DiscoverServerCard } from './DiscoverServerCard';
import { Translate } from '../translate';

interface DiscoverServerItem {
  groupId: string;
  order: number;
  active: boolean;
}

const Root = styled.div`
  width: 100%;
  overflow: auto;
`;

const DiscoverServerHeader = styled.div`
  font-size: 1.5rem;
  padding: 32px 0;
  text-align: center;
`;

const DiscoverServerList = styled.div`
  margin-top: 16px;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
  padding: 10px;
`;

export const DiscoverPanel: React.FC = React.memo(() => {
  const {
    error,
    loading,
    value: list = [],
  } = useAsync(async (): Promise<DiscoverServerItem[]> => {
    const { data } = await request.get('all');

    return data.list ?? [];
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <Root>
      <DiscoverServerHeader>{Translate.discoverHeader}</DiscoverServerHeader>
      {Array.isArray(list) && list.length > 0 ? (
        <DiscoverServerList>
          {list.map((item, i) => (
            <DiscoverServerCard key={i} groupId={item.groupId} />
          ))}
        </DiscoverServerList>
      ) : (
        <NoData />
      )}
    </Root>
  );
});
DiscoverPanel.displayName = 'DiscoverPanel';
