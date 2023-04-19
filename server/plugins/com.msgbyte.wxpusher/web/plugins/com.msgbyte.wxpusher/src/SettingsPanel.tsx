import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPluginRequest, useAsync } from '@capital/common';
import { LoadingSpinner, ErrorView } from '@capital/component';
import { Translate } from './translate';

const request = createPluginRequest('com.msgbyte.wxpusher');

const SettingsPanel: React.FC = React.memo(() => {
  const [wxpusherUserId, setWxpusherUserId] = useState('');
  const { loading, error } = useAsync(async () => {
    const { data } = await request.get('getWXPusherUserId');

    setWxpusherUserId(data);
  }, []);

  if (loading) {
    return <LoadingSpinner tip={Translate.loadingState} />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return wxpusherUserId ? (
    <div>
      <div>{Translate.binded}</div>
      <div>
        {Translate.currentWXPusherId}: {wxpusherUserId}
      </div>
    </div>
  ) : (
    <QRCode
      onBindSuccess={(wxpusherUserId) => {
        setWxpusherUserId(wxpusherUserId);
      }}
    />
  );
});
SettingsPanel.displayName = 'SettingsPanel';

export const QRCode: React.FC<{
  onBindSuccess: (wxpusherUserId: string) => void;
}> = React.memo((props) => {
  const {
    loading,
    error,
    value: url,
  } = useAsync(async () => {
    const { data } = await request.post('createQRCode');
    return data.data.url;
  }, []);

  const onBindSuccessRef = useRef(props.onBindSuccess);
  onBindSuccessRef.current = props.onBindSuccess;
  useLayoutEffect(() => {
    let timer: number;
    async function loop() {
      const { data: wxpusherUserId } = await request.get('getWXPusherUserId');
      if (wxpusherUserId) {
        onBindSuccessRef.current(wxpusherUserId);
      } else {
        timer = window.setTimeout(loop, 4 * 1000); // 4s loop
      }
    }

    loop();

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  if (loading) {
    return <LoadingSpinner tip={Translate.loadingQRCode} />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <div>
      <div>{Translate.useWechatBindTip}</div>
      <img width={260} src={url} />
    </div>
  );
});
QRCode.displayName = 'QRCode';

export default SettingsPanel;
