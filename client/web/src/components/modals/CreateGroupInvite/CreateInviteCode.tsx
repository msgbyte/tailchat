import { InviteCodeExpiredAt } from '@/components/InviteCodeExpiredAt';
import { generateInviteCodeUrl } from '@/utils/url-helper';
import { Menu, Typography, Dropdown, MenuProps } from 'antd';
import React, { useState } from 'react';
import {
  useAsyncRequest,
  createGroupInviteCode,
  t,
  GroupInvite,
  PERMISSION,
  useHasGroupPermission,
} from 'tailchat-shared';
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
