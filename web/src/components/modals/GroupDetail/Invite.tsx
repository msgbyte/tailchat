import React, { useCallback, useMemo } from 'react';
import {
  getAllGroupInviteCode,
  t,
  GroupInvite as GroupInviteType,
  datetimeFromNow,
  formatFullTime,
  deleteGroupInvite,
  useAsyncRefresh,
  showToasts,
} from 'tailchat-shared';
import { Button, Space, Table, Tooltip } from 'antd';
import type { ColumnType } from 'antd/lib/table';
import { UserName } from '@/components/UserName';
import { openModal, openReconfirmModalP } from '@/components/Modal';
import { CreateGroupInvite } from '../CreateGroupInvite';
import { LoadingOnFirst } from '@/components/LoadingOnFirst';
import { IconBtn } from '@/components/IconBtn';
import copy from 'copy-to-clipboard';
import { generateInviteCodeUrl } from '@/utils/url-helper';

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

  const handleCopyInviteCode = useCallback((inviteCode: string) => {
    copy(generateInviteCodeUrl(inviteCode));
    showToasts(t('邀请链接已复制到剪切板'), 'success');
  }, []);

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

          if (new Date(date).valueOf() < Date.now()) {
            return t('已过期');
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
        render: (id: string, record) => {
          return (
            <Space>
              <IconBtn
                title={t('复制邀请链接')}
                shape="square"
                icon="mdi:content-copy"
                onClick={() => handleCopyInviteCode(record.code)}
              />
              <IconBtn
                title={t('删除')}
                shape="square"
                icon="mdi:delete-outline"
                danger={true}
                onClick={() => handleDeleteInvite(id)}
              />
            </Space>
          );
        },
      },
    ],
    [handleCopyInviteCode, handleDeleteInvite]
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
