import {
  ChatInputActionContextProps,
  dataUrlToFile,
  uploadFile,
  useAsyncFn,
} from '@capital/common';
import { Button } from '@capital/component';
import React, { useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Translate } from './translate';

declare module 'react-canvas-draw' {
  export default interface CanvasDraw {
    getDataURL(
      fileType?: string,
      useBgImage?: boolean,
      backgroundColour?: string
    );
  }
}

/**
 * 绘图面板
 */
const DrawModal: React.FC<{
  actions: ChatInputActionContextProps;
  onSuccess: () => void;
}> = React.memo(({ actions, onSuccess }) => {
  const sendMsg = actions.sendMsg;
  const drawRef = useRef<CanvasDraw>(null);
  const [{ loading }, handleSend] = useAsyncFn(async () => {
    const dataUrl = drawRef.current.getDataURL();
    const file = dataUrlToFile(dataUrl);
    const res = await uploadFile(file);

    sendMsg(`[img width=400 height=400]${res.url}[/img]`);
    onSuccess();
  }, [sendMsg, onSuccess]);

  return (
    <div>
      <CanvasDraw ref={drawRef} />
      <Button
        block={true}
        type="primary"
        disabled={loading}
        onClick={handleSend}
      >
        {Translate.send}
      </Button>
    </div>
  );
});
DrawModal.displayName = 'DrawModal';

export default DrawModal;
