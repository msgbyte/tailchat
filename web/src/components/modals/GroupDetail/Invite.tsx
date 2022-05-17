import { LoadingSpinner } from '@/plugin/component';
import React, { useCallback, useMemo } from 'react';
import {
  getAllGroupInviteCode,
  t,
  GroupInvite as GroupInviteType,
  datetimeFromNow,
  formatFullTime,
  deleteGroupInvite,
  useAsyncRefresh,
} from 'tailchat-shared';
import { Button, Table, Tooltip } from 'antd';
import type { ColumnType } from 'antd/lib/table';
import { UserName } from '@/components/UserName';
import { Loading } from '@/components/Loading';
import { openReconfirmModalP } from '@/components/Modal';

export const GroupInvite: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  const groupId = props.groupId;
  const { loading, value, refresh } = useAsyncRefresh(async () => {
    const list = await getAllGroupInviteCode(groupId);

    return list;
  }, [groupId]);

  const handleDeleteInvite = useCallback(
    async (inviteId: string) => {
      if (await openReconfirmModalP()) {
        await deleteGroupInvite(groupId, inviteId);
        await refresh();
      }
    },
    [groupId, refresh]
  );

  const columns: ColumnType<GroupInviteType>[] = useMemo(
    () => [
      {
        title: t('邀请码'),
        dataIndex: 'code',
      },
      {
        title: t('创建时间'),
        dataIndex: 'createdAt',
        render: (date) => (
          <Tooltip title={formatFullTime(date)}>
            {datetimeFromNow(date)}
          </Tooltip>
        ),
      },
      {
        title: t('过期时间'),
        dataIndex: 'expiredAt',
        render: (date) => (
          <Tooltip title={formatFullTime(date)}>
            {datetimeFromNow(date)}
          </Tooltip>
        ),
      },
      {
        title: t('创建者'),
        dataIndex: 'creator',
        render: (userId) => <UserName userId={userId} />,
      },
      {
        title: t('操作'),
        dataIndex: '_id',
        render: (id: string) => {
          return (
            <div>
              <Button
                type="primary"
                danger={true}
                onClick={() => handleDeleteInvite(id)}
              >
                {t('删除')}
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDeleteInvite]
  );

  return (
    <Loading spinning={loading}>
      <Table
        columns={columns}
        dataSource={value}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
    </Loading>
  );
});
GroupInvite.displayName = 'GroupInvite';
