import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSocketContext } from '@/context/SocketContext';

export const SettingsDebug: React.FC = React.memo(() => {
  const socket = useSocketContext();
  const [socketConnected, setSocketConnected] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setSocketConnected(socket.connected);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      <p>当前Socket状态: {JSON.stringify(socketConnected)}</p>
      <div className="space-x-1">
        <Button type="primary" onClick={() => socket.mockReconnect()}>
          Socket 模拟重连
        </Button>
      </div>
    </div>
  );
});
SettingsDebug.displayName = 'SettingsDebug';
