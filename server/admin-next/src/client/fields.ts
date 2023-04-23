import {
  createAvatarField,
  createEmailField,
  createImageField,
  createTextField,
  createUrlField,
} from 'tushan';

export const userFields = [
  createTextField('id', {
    label: 'ID',
  }),
  createTextField('name', {
    label: 'Name',
    list: {
      sort: true,
    },
  }),
  createEmailField('email', {
    label: 'Email',
  }),
  createUrlField('website', {
    label: 'Website',
  }),
];

export const photoFields = [
  createTextField('id', {
    label: 'ID',
  }),
  createTextField('albumId', {
    label: 'AlbumId',
  }),
  createTextField('title', {
    label: 'Title',
  }),
  createImageField('url', {
    label: 'Url',
  }),
  createAvatarField('thumbnailUrl', {
    label: 'ThumbnailUrl',
  }),
];
