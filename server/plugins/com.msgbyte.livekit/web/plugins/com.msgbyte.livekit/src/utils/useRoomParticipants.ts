import { useAsyncFn, useEvent } from '@capital/common';
import { useMemo, useRef } from 'react';
import { request } from '../request';

export function useRoomParticipants(roomName: string) {
  const [{ value: participants = [], loading }, _handleFetchParticipants] =
    useAsyncFn(async () => {
      const { data } = await request.post('roomMembers', {
        roomName,
      });

      return data ?? [];
    }, [roomName]);

  const fetchParticipants = useEvent(_handleFetchParticipants);

  const lockRef = useRef(false);

  const isFirstLoading = useMemo(() => {
    if (loading && lockRef.current === false) {
      lockRef.current = true;
      return true;
    }

    return false;
  }, [loading]);

  return {
    loading,
    isFirstLoading,
    participants,
    fetchParticipants,
  };
}
