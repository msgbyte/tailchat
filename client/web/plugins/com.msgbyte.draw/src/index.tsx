import React from 'react';
import {
  regChatInputAction,
  Loadable,
  openModal,
  closeModal,
} from '@capital/common';
import { Translate } from './translate';
const DrawModal = Loadable(() => import('./DrawModal'));

regChatInputAction({
  label: Translate.draw,
  onClick: (actions) => {
    const key = openModal(
      <DrawModal actions={actions} onSuccess={() => closeModal(key)} />
    );
  },
});
