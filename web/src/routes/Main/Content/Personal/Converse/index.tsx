import { ConversePanel } from '@/components/Panel/personal/ConversePanel';
import React from 'react';
import { useParams } from 'react-router';

interface UserConversePanelParams {
  converseId: string;
}

export const PersonalConverse: React.FC = React.memo(() => {
  const params = useParams<UserConversePanelParams>();

  return <ConversePanel converseId={params.converseId} />;
});
PersonalConverse.displayName = 'PersonalConverse';
