import React, { useState } from 'react';
import { Button, ButtonProps, Confirm } from 'react-admin';

interface Props extends Pick<ButtonProps, 'label'> {
  component?: React.ComponentType<ButtonProps>;
  confirmTitle?: string;
  confirmContent?: string;
  onConfirm?: () => void;
}
export const ButtonWithConfirm: React.FC<Props> = React.memo((props) => {
  const {
    component: ButtonComponent = Button,
    confirmTitle = '确认要进行该操作么？',
    confirmContent = '该操作不可撤回',
  } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <ButtonComponent
        onClick={(e) => {
          setOpen(true);
        }}
        label={props.label}
      />
      <Confirm
        isOpen={open}
        loading={loading}
        title={confirmTitle}
        content={confirmContent}
        onConfirm={() => {
          setLoading(true);
          props.onConfirm?.();
          setLoading(false);
          setOpen(false);
        }}
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
});
ButtonWithConfirm.displayName = 'ButtonWithConfirm';
