import React, { useCallback, useState } from 'react';
import { Incubator, ToastPresets } from 'react-native-ui-lib';

const { Toast } = Incubator;

export function useToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showToast = useCallback((text: string) => {
    setVisible(true);
    setMessage(text);
  }, []);

  return {
    showToast,
    toastEl: (
      <Toast
        preset={ToastPresets.SUCCESS}
        visible={visible}
        message={message}
        onDismiss={() => setVisible(false)}
        autoDismiss={3500}
        swipeable={true}
      />
    ),
  };
}
