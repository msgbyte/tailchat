import {
  createAvatarField,
  createEmailField,
  createImageField,
  createTextField,
  createBooleanField,
} from 'tushan';

export const userFields = [
  createTextField('id', {
    label: 'ID',
    list: {
      sort: true,
    },
  }),
  createEmailField('email', {
    label: 'Email',
  }),
  createTextField('nickname', {
    label: 'Nickname',
  }),
  createTextField('discriminator', {
    label: 'Discriminator',
  }),
  createBooleanField('temporary', {
    label: 'Temporary',
  }),
  createImageField('avatar', {
    label: 'Avatar',
    height: 42,
  }),
  createTextField('settings', {
    label: 'Settings',
    list: {
      width: 200,
    },
    edit: {
      hidden: true, // wait for json field
    },
  }),
  createTextField('createdAt', {
    label: 'Created At',
  }),
];

export const messageFields = [
  createTextField('id', {
    label: 'ID',
  }),
  createTextField('content', {
    label: 'Content',
  }),
  createTextField('author', {
    label: 'Author',
  }),
  createTextField('groupId'),
  createTextField('converseId'),
  createBooleanField('hasRecall'),
  createTextField('reactions'),
  createTextField('createdAt'),
];

export const groupFields = [
  createTextField('id', {
    label: 'ID',
  }),
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
  createTextField('roles'),
  createTextField('fallbackPermissions'),
  createTextField('createdAt'),
];
