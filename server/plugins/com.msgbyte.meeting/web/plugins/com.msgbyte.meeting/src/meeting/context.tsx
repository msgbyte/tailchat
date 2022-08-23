import React, { useContext } from 'react';
import type { TailchatMeetingClient } from 'tailchat-meeting-sdk';

interface MeetingClientContextProps {
  client: TailchatMeetingClient;
}

const MeetingClientContext = React.createContext<MeetingClientContextProps>(
  {} as MeetingClientContextProps
);
MeetingClientContext.displayName = 'MeetingClientContext';

/**
 * Provider 会议sdk client
 */
export const MeetingClientContextProvider: React.FC<{
  client: TailchatMeetingClient;
}> = React.memo((props) => {
  return (
    <MeetingClientContext.Provider value={{ client: props.client }}>
      {props.children}
    </MeetingClientContext.Provider>
  );
});
MeetingClientContextProvider.displayName = 'MeetingClientContextProvider';

/**
 * 会议sdk client context
 */
export function useMeetingClientContext() {
  return useContext(MeetingClientContext);
}
