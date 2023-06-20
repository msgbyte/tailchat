import React, { useState } from 'react';
import { Button, ButtonProps, Confirm, useTranslate } from 'react-admin';

interface Props extends Pick<ButtonProps, 'label'> {
  component?: React.ComponentType<ButtonProps>;
  confirmTitle?: string;
  confirmContent?: string;
  onConfirm?: () => void;
}
export const ButtonWithConfirm: React.FC<Props> = React.memo((props) => {
  const translate = useTranslate();

  const {
    component: ButtonComponent = Button,
    confirmTitle = translate('custom.common.confirmTitle'),
    confirmContent = translate('custom.common.confirmContent'),
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
