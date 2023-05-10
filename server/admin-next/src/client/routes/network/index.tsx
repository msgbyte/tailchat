import React from 'react';
import { request } from '../../request';
import _uniq from 'lodash/uniq';
import { TagItems } from '../../components/TagItems';
import { Card, Spin, Table, Typography, useAsync } from 'tushan';

/**
 * Tailchat 网络状态
 */
export const TailchatNetwork: React.FC = React.memo(() => {
  const { value: data, loading } = useAsync(async () => {
    const { data } = await request('/network/all');

    return data;
  });

  if (loading) {
    return <Spin />;
  }

  return (
    <Card>
      <Typography.Title heading={6}>
        {'custom.network.nodeList'}
      </Typography.Title>

      <Table
        columns={[
          {
            dataIndex: 'id',
            title: 'ID',
            render: (id, item: any) => (
              <div>
                {id}
                {item.local && <span> (*)</span>}
              </div>
            ),
          },
          {
            dataIndex: 'hostname',
            title: 'Host',
          },
          {
            dataIndex: 'cpu',
            title: 'CPU',
            render: (usage) => usage + '%',
          },
          {
            dataIndex: 'ipList',
            title: 'IP',
            render: (ips) => <TagItems items={ips ?? []} />,
          },
          {
            dataIndex: 'client.version',
            title: 'Client Version',
          },
        ]}
        data={data.nodes ?? []}
      />

      <Typography.Title heading={6}>
        {'custom.network.serviceList'}
      </Typography.Title>

      <div>
        <TagItems items={_uniq<string>(data.services ?? [])} />
      </div>

      <Typography.Title heading={6}>
        {'custom.network.actionList'}
      </Typography.Title>
      <div>
        <TagItems items={_uniq<string>(data.actions ?? [])} />
      </div>

      <Typography.Title heading={6}>
        {'custom.network.eventList'}
      </Typography.Title>

      <div>
        <TagItems items={_uniq<string>(data.events ?? [])} />
      </div>
    </Card>
  );
});
TailchatNetwork.displayName = 'TailchatNetwork';
