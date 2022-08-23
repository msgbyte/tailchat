import React, { useContext } from 'react';
import type { AppSocket } from 'tailchat-shared';

const SocketContext = React.createContext<AppSocket>({} as AppSocket);
SocketContext.displayName = 'SocketContext';

export const SocketContextProvider: React.FC<{ socket: AppSocket }> =
  React.memo((props) => {
    return (
      <SocketContext.Provider value={props.socket}>
        {props.children}
      </SocketContext.Provider>
    );
  });
SocketContextProvider.displayName = 'SocketContextProvider';

export function useSocketContext(): AppSocket {
  const context = useContext(SocketContext);

  return context;
}
