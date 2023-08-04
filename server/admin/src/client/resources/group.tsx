import React, { useState } from 'react';
import {
  createTextField,
  Identifier,
  ListTable,
  Message,
  Modal,
  ReferenceFieldEdit,
  useEvent,
  useTranslation,
} from 'tushan';
import { groupFields } from '../fields';
import { callAction } from '../request';

export const GroupList: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [modal, contextHolder] = Modal.useModal();
  return (
    <>
      {contextHolder}
      <ListTable
        filter={[
          createTextField('q', {
            label: 'Search',
          }),
        ]}
        fields={groupFields}
        action={{
          detail: true,
          edit: true,
          delete: true,
          export: true,
          create: true,
          custom: (record) => [
            {
              key: 'addGroupMember',
              label: t('custom.action.addGroupMember'),
              onClick: () => {
                let userId: Identifier;
                const { close } = modal.confirm({
                  title: t('custom.action.addGroupMemberTitle'),
                  content: (
                    <div>
                      <div>{t('custom.action.selectUser')}:</div>
                      <UserSelector onChange={(val) => (userId = val)} />
                    </div>
                  ),
                  onOk: async () => {
                    if (!userId) {
                      Message.error(
                        t('custom.action.addGroupMemberRequiredTip')
                      );
                      return;
                    }

                    try {
                      await callAction('group.addMember', {
                        groupId: record.id,
                        userId,
                      });
                      Message.success(t('tushan.common.success'));
                      close();
                    } catch (err) {
                      console.error(err);
                      Message.error(String(err));
                    }
                  },
                });
              },
            },
          ],
        }}
      />
    </>
  );
});
GroupList.displayName = 'GroupList';

export const UserSelector: React.FC<{ onChange: (val: Identifier) => void }> =
  React.memo((props) => {
    const [userId, setUserId] = useState<Identifier>('');

    const handleChange = useEvent((val: Identifier) => {
      setUserId(val);
      props.onChange(val);
    });

    return (
      <ReferenceFieldEdit
        value={userId}
        onChange={handleChange}
        options={{
          displayField: (record) =>
            `${record.nickname}#${record.discriminator}`,
          reference: 'users',
        }}
      />
    );
  });
UserSelector.displayName = 'UserSelector';
