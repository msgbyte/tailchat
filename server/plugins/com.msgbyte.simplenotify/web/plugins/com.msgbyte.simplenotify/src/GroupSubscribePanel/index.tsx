import React, { useCallback, useMemo } from 'react';
import {
  openModal,
  closeModal,
  useGroupIdContext,
  useAsyncRefresh,
  useAsyncRequest,
  getServiceUrl,
  useGroupPanelInfo,
} from '@capital/common';
import { Button, SensitiveText, Space, Table } from '@capital/component';
import { Translate } from '../translate';
import { AddGroupSubscribeModal } from './AddGroupSubscribeModal';
import { request } from '../request';

interface SubscribeItem {
  _id: string;
  groupId: string;
  textPanelId: string;
  createdAt: string;
  updatedAt: string;
}

const GroupPanelName: React.FC<{
  groupId: string;
  panelId: string;
}> = React.memo(({ groupId, panelId }) => {
  const groupPanelInfo = useGroupPanelInfo(groupId, panelId);

  return groupPanelInfo?.name ?? '';
});

const GroupSubscribePanel: React.FC = React.memo(() => {
  const groupId = useGroupIdContext();

  const { value: subscribes, refresh } = useAsyncRefresh(async () => {
    const { data } = await request.post('list', { groupId, type: 'group' });
    return data;
  }, [groupId]);

  const handleAdd = useCallback(() => {
    const key = openModal(
      <AddGroupSubscribeModal
        groupId={groupId}
        onSuccess={() => {
          closeModal(key);
          refresh();
        }}
      />
    );
  }, [groupId, refresh]);

  const [, handleDelete] = useAsyncRequest(
    async (subscribeId) => {
      await request.post('delete', {
        groupId,
        subscribeId,
      });

      refresh();
    },
    [groupId, refresh]
  );

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        key: '_id',
        dataIndex: '_id',
        width: 250,
        render: (text: string) => <SensitiveText text={text} />,
      },
      {
        title: Translate.panel,
        key: 'textPanelId',
        dataIndex: 'textPanelId',
        render: (panelId: string) => (
          <GroupPanelName groupId={groupId} panelId={panelId} />
        ),
      },
      {
        title: Translate.createdTime,
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (date: string) => new Date(date).toLocaleString(),
      },
      {
        title: Translate.action,
        key: 'action',
        render: (_, record: SubscribeItem) => (
          <Space>
            <Button onClick={() => handleDelete(record._id)}>
              {Translate.delete}
            </Button>
          </Space>
        ),
      },
    ],
    [handleDelete]
  );

  return (
    <div>
      <div
        style={{
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h2>{Translate.groupSubscribe}</h2>

        <Button type="primary" onClick={handleAdd}>
          {Translate.add}
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={subscribes}
        pagination={false}
      />

      {Array.isArray(subscribes) && subscribes.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <h3>如何接入:</h3>
          <p>
            直接发送请求:&nbsp;
            <code style={{ userSelect: 'text' }}>
              {getServiceUrl()}
              /api/plugin:com.msgbyte.simplenotify/webhook/callback?subscribeId=&lt;ID&gt;&text=&lt;文本内容&gt;
            </code>
          </p>
          <p>支持GET与POST</p>
          <p>
            <b>请保管好您的ID</b>
          </p>
        </div>
      )}
    </div>
  );
});
GroupSubscribePanel.displayName = 'GroupSubscribePanel';

export default GroupSubscribePanel;
