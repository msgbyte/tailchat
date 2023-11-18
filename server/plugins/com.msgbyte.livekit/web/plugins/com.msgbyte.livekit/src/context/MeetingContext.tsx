import React, { PropsWithChildren, useContext, useMemo } from 'react';
import {
  MeetingState,
  MeetingStateStoreType,
  createMeetingStateStore,
} from '../store/meeting';
import { useStore } from 'zustand';

const MeetingContext = React.createContext<MeetingStateStoreType>(null);

export const MeetingContextProvider: React.FC<PropsWithChildren> = React.memo(
  (props) => {
    const store = useMemo(() => createMeetingStateStore(), []);

    return (
      <MeetingContext.Provider value={store}>
        {props.children}
      </MeetingContext.Provider>
    );
  }
);
MeetingContextProvider.displayName = 'MeetingContextProvider';

export function useMeetingContextState<T>(selector: (s: MeetingState) => T) {
  const context = useContext(MeetingContext);

  return useStore(context, selector);
}
