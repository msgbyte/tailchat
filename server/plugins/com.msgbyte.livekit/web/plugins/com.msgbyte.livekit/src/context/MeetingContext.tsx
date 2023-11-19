import React, { PropsWithChildren, useContext, useMemo } from 'react';
import {
  MeetingState,
  MeetingStateStoreType,
  createMeetingStateStore,
} from '../store/meeting';
import { useStore } from 'zustand';

const MeetingContext = React.createContext<MeetingStateStoreType>(null);

interface MeetingContextProviderProps extends PropsWithChildren {
  meetingId: string;
}

export const MeetingContextProvider: React.FC<MeetingContextProviderProps> =
  React.memo((props) => {
    const store = useMemo(
      () => createMeetingStateStore(props.meetingId),
      [props.meetingId]
    );

    return (
      <MeetingContext.Provider value={store}>
        {props.children}
      </MeetingContext.Provider>
    );
  });
MeetingContextProvider.displayName = 'MeetingContextProvider';

export function useMeetingContextState<T>(selector: (s: MeetingState) => T) {
  const context = useContext(MeetingContext);

  return useStore(context, selector);
}
