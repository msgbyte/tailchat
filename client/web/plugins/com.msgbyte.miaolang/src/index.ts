import { regChatInputAction, openModal, Loadable } from '@capital/common';
import { createElement } from 'react';
import { Translate } from './translate';

const SendMiaoModal = Loadable(() =>
  import('./SendMiaoModal').then((module) => ({
    default: module.SendMiaoModal,
  }))
);

// Just for reduce entry file size
import('./reg');

regChatInputAction({
  label: Translate.title,
  onClick: (actions) => {
    openModal(createElement(SendMiaoModal, { actions }));
  },
});
