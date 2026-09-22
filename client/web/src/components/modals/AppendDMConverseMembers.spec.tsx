import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { request } from 'tailchat-shared/api/request';
import { setToasts } from 'tailchat-shared/manager/ui';
import { closeModal } from '../Modal';
import { AppendDMConverseMembers } from './AppendDMConverseMembers';

jest.mock('tailchat-shared/api/request', () => ({
  request: { post: jest.fn() },
}));
jest.mock('tailchat-shared', () => ({
  ...jest.requireActual('tailchat-shared/model/converse'),
  ...jest.requireActual('tailchat-shared/hooks/useAsyncFn'),
  ...jest.requireActual('tailchat-shared/hooks/useAsyncRequest'),
  t: (text: string) => text,
}));
jest.mock('../Modal', () => ({
  closeModal: jest.fn(),
  ModalWrapper: ({ children }: any) => children,
}));
jest.mock('../UserPicker/FriendPicker', () => ({
  FriendPicker: ({ onChange }: any) => (
    <button onClick={() => onChange(['other'])}>Select</button>
  ),
}));

test('an invitation rejected by the recipient setting shows the server error and keeps the dialog open', async () => {
  const toast = jest.fn();
  setToasts(toast);
  (request.post as jest.Mock).mockRejectedValue(
    new Error('Only friends may invite this user')
  );
  const errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<AppendDMConverseMembers converseId="conversation" />);
  fireEvent.click(screen.getByRole('button', { name: 'Select' }));
  fireEvent.click(screen.getByRole('button', { name: /确\s*认/ }));

  await waitFor(() =>
    expect(toast).toHaveBeenCalledWith(
      'Only friends may invite this user',
      'error'
    )
  );
  expect(closeModal).not.toHaveBeenCalled();
  errorLog.mockRestore();
});
