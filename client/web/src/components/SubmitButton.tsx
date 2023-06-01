import { Button, ButtonProps } from 'antd';
import React, { useState } from 'react';

interface SubmitButtonProps extends ButtonProps {
  onClick: (event: React.MouseEvent) => void | Promise<void>;
}

/**
 * Submit Button, use for submit somthing to server
 * auto add loading state in onClick
 */
export const SubmitButton: React.FC<SubmitButtonProps> = React.memo((props) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      loading={loading}
      {...props}
      onClick={async (e) => {
        if (props.onClick) {
          setLoading(true);
          await props.onClick(e);
          setLoading(false);
        }
      }}
    />
  );
});
SubmitButton.displayName = 'SubmitButton';
