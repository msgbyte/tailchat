import { postRequest } from '@capital/common';
import type { UseTokenOptions } from '@livekit/components-react';
import { useEffect, useState } from 'react';

export function useToken(roomName: string, options: UseTokenOptions = {}) {
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const tokenFetcher = async () => {
      const params = new URLSearchParams({ ...options.userInfo, roomName });
      const { data } = await postRequest(
        `/plugin:com.msgbyte.livekit/generateToken?${params.toString()}`
      );
      const { accessToken } = data;
      setToken(accessToken);
    };

    tokenFetcher();
  }, [roomName, options]);

  return token;
}
