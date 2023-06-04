import React from 'react';
import {
  createTextField,
  ListTable,
  Message,
  Modal,
  useRefreshList,
  useResourceContext,
  useTranslation,
  useUpdate,
} from 'tushan';
import { userFields } from '../fields';
import { request } from '../request';

export const UserList: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [update] = useUpdate();
  const resource = useResourceContext();
  const refreshUser = useRefreshList(resource);

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
        refresh: true,
        export: true,
        custom: (record) => [
          {
            key: 'resetPassword',
            label: t('custom.action.resetPassword'),
            onClick: () => {
              const { close } = Modal.confirm({
                title: t('tushan.common.confirmTitle'),
                content: t('tushan.common.confirmContent'),
                onConfirm: async () => {
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
          !record.banned
            ? {
                key: 'banUser',
                label: t('custom.action.banUser'),
                onClick: () => {
                  const { close } = Modal.confirm({
                    title: t('tushan.common.confirmTitle'),
                    content: t('custom.action.banUserDesc'),
                    onConfirm: async () => {
                      try {
                        await request.post('/user/ban', {
                          userId: record.id,
                        });
                        Message.success(t('tushan.common.success'));
                        refreshUser();
                        close();
                      } catch (err) {
                        console.error(err);
                        Message.error(String(err));
                      }
                    },
                  });
                },
              }
            : {
                key: 'unbanUser',
                label: t('custom.action.unbanUser'),
                onClick: () => {
                  const { close } = Modal.confirm({
                    title: t('tushan.common.confirmTitle'),
                    content: t('custom.action.unbanUserDesc'),
                    onConfirm: async () => {
                      try {
                        await request.post('/user/unban', {
                          userId: record.id,
                        });
                        Message.success(t('tushan.common.success'));
                        refreshUser();
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
