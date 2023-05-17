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
} from 'tushan';
import { createFileSizeField } from './components/field/filesize';

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
  createAvatarField('avatar'),
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
  createTextField('id'),
  createTextField('content'),
  createTextField('author'),
  createTextField('groupId'),
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
  createTextField('owner'),
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
  createJSONField('roles'),
  createJSONField('fallbackPermissions'),
  createDateTimeField('createdAt', {
    format: 'iso',
    edit: {
      hidden: true,
    },
  }),
];

export const fileFields = [
  createTextField('objectName'),
  createUrlField('url'),
  createFileSizeField('size', {
    list: {
      width: 120,
    },
  }),
  createTextField('metaData.content-type'),
  createTextField('etag'),
  createTextField('userId'),
  createDateTimeField('createdAt'),
];

export const mailFields = [
  createTextField('userId'),
  createTextField('host'),
  createNumberField('port'),
  createBooleanField('secure'),
  createBooleanField('is_success'),
  createJSONField('data'),
  createTextField('error'),
  createDateTimeField('createdAt'),
];
