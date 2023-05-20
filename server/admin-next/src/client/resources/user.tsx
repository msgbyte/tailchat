import React from 'react';
import {
  createTextField,
  ListTable,
  Message,
  Modal,
  useResourceContext,
  useTranslation,
  useUpdate,
} from 'tushan';
import { userFields } from '../fields';

export const UserList: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [update] = useUpdate();
  const resource = useResourceContext();

  return (
    <ListTable
      filter={[
        createTextField('q', {
          label: 'Search',
        }),
      ]}
      fields={userFields}
      action={{
        create: true,
        detail: true,
        edit: true,
        delete: true,
        export: true,
        custom: [
          {
            key: 'resetPassword',
            label: t('custom.action.resetPassword'),
            onClick: (record: any) => {
              const { close } = Modal.confirm({
                title: t('tushan.common.confirmTitle'),
                content: t('tushan.common.confirmContent'),
                onConfirm: async (e) => {
                  try {
                    await update(resource, {
                      id: record.id,
                      data: {
                        password:
                          '$2a$10$eSebpg0CEvsbDC7j1NxB2epMUkYwKhfT8vGdPQYkfeXYMqM8HjnpW', // 123456789
                      },
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
  );
});
UserList.displayName = 'UserList';
