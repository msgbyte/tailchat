import type { ResourceWithOptions } from 'adminjs';
import User from '../../models/user/user';
import Group from '../../models/group/group';
import Message from '../../models/chat/message';
import File from '../../models/file';

export function getResources() {
  return [
    {
      resource: User,
      options: {
        properties: {
          email: {
            isDisabled: true,
          },
          username: {
            isVisible: false,
          },
          password: {
            isVisible: false,
          },
        },
        sort: {
          direction: 'desc',
          sortBy: 'createdAt',
        },
      },
    } as ResourceWithOptions,
    Group,
    {
      resource: Message,
      options: {
        properties: {
          content: {
            type: 'textarea',
          },
        },
      },
    } as ResourceWithOptions,
    File,
  ];
}
