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
import { openModal, openReconfirmModalP } from '@/components/Modal';
import { CreateGroupInvite } from '../CreateGroupInvite';
import { LoadingOnFirst } from '@/components/LoadingOnFirst';

export const GroupInvite: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  const groupId = props.groupId;
  const { loading, value, refresh } = useAsyncRefresh(async () => {
    const list = await getAllGroupInviteCode(groupId);

    return list.reverse(); // 倒序返回
  }, [groupId]);

  const handleCreateInvite = useCallback(() => {
    openModal(
      <CreateGroupInvite
        groupId={groupId}
        onInviteCreated={() => {
          refresh();
        }}
      />
    );
  }, [groupId, refresh]);

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
        render: (date) => {
          if (!date) {
            return t('永不过期');
          }

          return (
            <Tooltip title={formatFullTime(date)}>
              {datetimeFromNow(date)}
            </Tooltip>
          );
        },
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
    <LoadingOnFirst spinning={loading}>
      <div className="text-right mb-2">
        <Button type="primary" onClick={handleCreateInvite}>
          {t('创建邀请码')}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={value}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
    </LoadingOnFirst>
  );
});
GroupInvite.displayName = 'GroupInvite';
