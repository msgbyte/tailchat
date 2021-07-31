import { openModal } from '@/components/Modal';
import { GroupInvite } from '@/components/modals/GroupInvite';
import React from 'react';
import { useCallback } from 'react';

export function useGroupHeaderAction(groupId: string) {
  const handleInviteUser = useCallback(() => {
    openModal(<GroupInvite groupId={groupId} />);
  }, [groupId]);

  return { handleInviteUser };
}
