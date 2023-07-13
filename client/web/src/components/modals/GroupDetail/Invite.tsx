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
  useEvent,
} from 'tailchat-shared';
import { Button, Space, Table, Tooltip } from 'antd';
import type { ColumnType } from 'antd/lib/table';
import { UserName } from '@/components/UserName';
import { closeModal, openModal, openReconfirmModalP } from '@/components/Modal';
import { CreateGroupInvite } from '../CreateGroupInvite';
import { LoadingOnFirst } from '@/components/LoadingOnFirst';
import { IconBtn } from '@/components/IconBtn';
import copy from 'copy-to-clipboard';
import { generateInviteCodeUrl } from '@/utils/url-helper';
import { SensitiveText } from 'tailchat-design';
import { EditGroupInvite } from '../EditGroupInvite';

export const GroupInvite: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  const groupId = props.groupId;
  const { loading, value, refresh } = useAsyncRefresh(async () => {
    const list = await getAllGroupInviteCode(groupId);

    return list.reverse(); // 倒序返回
  }, [groupId]);

  const handleCreateInvite = useEvent(() => {
    openModal(
      <CreateGroupInvite
        groupId={groupId}
        onInviteCreated={() => {
          refresh();
        }}
      />
    );
  });

  const handleEditInviteCode = useEvent((inviteCode: string) => {
    const key = openModal(
      <EditGroupInvite
        groupId={groupId}
        code={inviteCode}
        onEditSuccess={() => {
          showToasts(t('邀请设置修改成功'), 'success');
          closeModal(key);
          refresh();
        }}
      />
    );
  });

  const handleCopyInviteCode = useEvent((inviteCode: string) => {
    copy(generateInviteCodeUrl(inviteCode));
    showToasts(t('邀请链接已复制到剪切板'), 'success');
  });

  const handleDeleteInvite = useEvent(async (inviteId: string) => {
    if (await openReconfirmModalP()) {
      await deleteGroupInvite(groupId, inviteId);
      await refresh();
    }
  });

  const columns: ColumnType<GroupInviteType>[] = useMemo(
    () => [
      {
        title: t('邀请码'),
        dataIndex: 'code',
        width: 200,
        render: (text) => <SensitiveText text={text} />,
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
        title: t('使用次数'),
        dataIndex: 'usage',
        render: (usage, record) => {
          return (
            <div>
              {usage}
              {record.usageLimit && ` / ${record.usageLimit}`}
            </div>
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
                title={t('编辑邀请链接')}
                shape="square"
                icon="mdi:edit"
                onClick={() => handleEditInviteCode(record.code)}
              />
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
