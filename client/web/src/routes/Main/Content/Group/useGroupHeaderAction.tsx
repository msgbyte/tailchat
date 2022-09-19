import { closeModal, openModal } from '@/components/Modal';
import { GroupDetail } from '@/components/modals/GroupDetail';
import { CreateGroupInvite } from '@/components/modals/CreateGroupInvite';
import React from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { quitGroup, showAlert, t, useIsGroupOwner } from 'tailchat-shared';
import { useLocationNav } from '@/hooks/useHistoryNav';

/**
 * 群组 Header 的操作 hooks
 */
export function useGroupHeaderAction(groupId: string) {
  const isOwner = useIsGroupOwner(groupId);
  const navigate = useNavigate();

  const handleShowGroupDetail = useCallback(() => {
    const key = openModal(
      <GroupDetail
        groupId={groupId}
        onClose={() => {
          closeModal(key);
        }}
      />
    );
  }, [groupId]);

  const handleInviteUser = useCallback(() => {
    openModal(<CreateGroupInvite groupId={groupId} />);
  }, [groupId]);

  const handleQuitGroup = useCallback(() => {
    showAlert({
      message: isOwner
        ? t('您是群组管理者，退出群组会导致解散群组')
        : t('确定要退出群组么?'),
      async onConfirm() {
        await quitGroup(groupId);
        navigate('/main', {
          replace: true,
        }); // 返回到主页
      },
    });
  }, [groupId, isOwner]);

  useLocationNav('group.*', (nav) => {
    if (nav.startsWith('group.detail')) {
      handleShowGroupDetail();
    }
  });

  return { handleShowGroupDetail, handleInviteUser, handleQuitGroup };
}
