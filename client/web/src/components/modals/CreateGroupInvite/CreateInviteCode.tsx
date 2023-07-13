import { InviteCodeExpiredAt } from '@/components/InviteCodeExpiredAt';
import { closeModal, openModal } from '@/components/Modal';
import { generateInviteCodeUrl } from '@/utils/url-helper';
import { Menu, Typography, Dropdown, MenuProps, Button } from 'antd';
import React, { useState } from 'react';
import {
  useAsyncRequest,
  createGroupInviteCode,
  t,
  GroupInvite,
  PERMISSION,
  useHasGroupPermission,
  useEvent,
  showToasts,
} from 'tailchat-shared';
import { EditGroupInvite } from '../EditGroupInvite';
import styles from './CreateInviteCode.module.less';

enum InviteCodeType {
  Normal = 'normal',
  Permanent = 'permanent',
}

interface CreateInviteCodeProps {
  groupId: string;
  onInviteCreated?: () => void;
}
export const CreateInviteCode: React.FC<CreateInviteCodeProps> = React.memo(
  ({ groupId, onInviteCreated }) => {
    const [createdInvite, setCreateInvite] = useState<GroupInvite | null>(null);
    const [{ loading }, handleCreateInviteLink] = useAsyncRequest(
      async (inviteType: InviteCodeType) => {
        const invite = await createGroupInviteCode(groupId, inviteType);
        setCreateInvite(invite);
        onInviteCreated?.();
      },
      [groupId, onInviteCreated]
    );
    const [hasInvitePermission, hasUnlimitedInvitePermission] =
      useHasGroupPermission(groupId, [
        PERMISSION.core.invite,
        PERMISSION.core.unlimitedInvite,
      ]);

    const handleEditGroupInvite = useEvent(() => {
      if (!createdInvite) {
        return;
      }

      const key = openModal(
        <EditGroupInvite
          groupId={groupId}
          code={createdInvite.code}
          onEditSuccess={() => {
            showToasts(t('邀请设置修改成功'), 'success');
            closeModal(key);
          }}
        />
      );
    });

    const menu: MenuProps = {
      items: [
        {
          key: 'persist',
          label: t('创建永久邀请码'),
          disabled: !hasUnlimitedInvitePermission,
          onClick: () => handleCreateInviteLink(InviteCodeType.Permanent),
        },
      ],
    };

    return (
      <div>
        {createdInvite ? (
          <div>
            <Typography.Title
              className="bg-white bg-opacity-30 dark:bg-black dark:bg-opacity-30 px-2 py-1 select-text text-lg rounded border border-black border-opacity-20"
              level={4}
              copyable={true}
            >
              {generateInviteCodeUrl(createdInvite.code)}
            </Typography.Title>
            <p className="text-gray-500 text-sm">
              <InviteCodeExpiredAt invite={createdInvite} />
              <Button type="link" size="small" onClick={handleEditGroupInvite}>
                {t('编辑')}
              </Button>
            </p>
          </div>
        ) : (
          <Dropdown.Button
            className={styles.createInviteBtn}
            size="large"
            type="primary"
            disabled={!hasInvitePermission}
            loading={loading}
            onClick={() => handleCreateInviteLink(InviteCodeType.Normal)}
            menu={menu}
            trigger={['click']}
          >
            {t('创建链接')}
          </Dropdown.Button>
        )}
      </div>
    );
  }
);
CreateInviteCode.displayName = 'CreateInviteCode';
