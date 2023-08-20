import {
  createEmailField,
  createTextField,
  createBooleanField,
  createAvatarField,
  createJSONField,
  createDateTimeField,
  createUrlField,
  emailValidator,
  createNumberField,
  createReferenceField,
  createTextAreaField,
} from 'tushan';
import { createFileSizeField } from './components/field/filesize';
import { createUserField } from './components/field/user';
import { parseUrlStr } from './utils';

export const userFields = [
  createTextField('id', {
    list: {
      sort: true,
    },
  }),
  createEmailField('email', {
    edit: {
      rules: [
        {
          required: true,
        },
        {
          validator: emailValidator,
        },
      ],
    },
  }),
  createTextField('nickname'),
  createTextField('discriminator', {
    edit: {
      rules: [
        {
          required: true,
        },
        {
          match: /\d{4}/,
        },
      ],
    },
  }),
  createBooleanField('temporary'),
  createAvatarField('avatar', {
    preRenderTransform: (val) =>
      typeof val === 'string' ? parseUrlStr(val) : val,
  }),
  createTextField('type', {
    edit: {
      hidden: true,
    },
  }),
  createBooleanField('emailVerified'),
  createBooleanField('banned', {
    edit: {
      hidden: true,
    },
  }),
  createJSONField('settings', {
    list: {
      width: 200,
    },
  }),
  createDateTimeField('createdAt', {
    format: 'iso',
    edit: {
      hidden: true,
    },
  }),
];

export const messageFields = [
  createTextField('id', {
    list: {
      sort: true,
    },
  }),
  createTextAreaField('content', {
    list: {
      width: 400,
      ellipsis: true,
    },
  }),
  createUserField('author', {
    reference: 'users',
    displayField: 'nickname',
    list: {
      width: 80,
    },
  }),
  createReferenceField('groupId', {
    reference: 'groups',
    displayField: 'name',
    list: {
      width: 80,
    },
  }),
  createTextField('converseId'),
  createBooleanField('hasRecall'),
  createJSONField('reactions'),
  createDateTimeField('createdAt', {
    format: 'iso',
    edit: {
      hidden: true,
    },
  }),
];

export const groupFields = [
  createTextField('id'),
  createTextField('name'),
  createReferenceField('owner', {
    reference: 'users',
    displayField: (record) => `${record.nickname}#${record.discriminator}`,
    list: {
      width: 160,
    },
  }),
  createTextField('members.length', {
    edit: {
      hidden: true,
    },
  }),
  createTextField('panels.length', {
    edit: {
      hidden: true,
    },
  }),
  createJSONField('roles', {
    edit: {
      hidden: true,
    },
  }),
  createJSONField('fallbackPermissions', {
    edit: {
      hidden: true,
    },
  }),
  createDateTimeField('createdAt', {
    format: 'iso',
    edit: {
      hidden: true,
    },
  }),
];

export const fileFields = [
  createTextField('objectName'),
  createUrlField('url', {
    preRenderTransform: parseUrlStr,
  }),
  createFileSizeField('size', {
    list: {
      width: 120,
    },
  }),
  createTextField('metaData.content-type'),
  createTextField('etag'),
  createUserField('userId', {
    reference: 'users',
    displayField: 'nickname',
    list: {
      width: 80,
    },
  }),
  createDateTimeField('createdAt'),
];

export const mailFields = [
  createTextField('to'),
  createTextField('subject'),
  createTextField('host'),
  createNumberField('port'),
  createBooleanField('secure'),
  createBooleanField('is_success'),
  createJSONField('data'),
  createTextField('error'),
  createDateTimeField('createdAt'),
];

export const discoverFields = [
  createReferenceField('groupId', {
    reference: 'groups',
    displayField: 'name',
  }),
  createBooleanField('active', {
    edit: {
      default: true,
    },
  }),
  createNumberField('order', {
    edit: {
      default: 0,
    },
    list: {
      sort: true,
    },
  }),
];
