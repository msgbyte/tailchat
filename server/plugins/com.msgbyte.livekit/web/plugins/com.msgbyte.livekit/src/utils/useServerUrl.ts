import { postRequest } from '@capital/common';
import { useEffect, useState } from 'react';

export function useServerUrl() {
  const [serverUrl, setServerUrl] = useState<string | undefined>();

  useEffect(() => {
    postRequest('/plugin:com.msgbyte.livekit/url').then(({ data }) => {
      setServerUrl(data.url);
    });
  }, []);

  return serverUrl;
}
