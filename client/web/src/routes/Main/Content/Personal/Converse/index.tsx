import { NotFound } from '@/components/NotFound';
import { ConversePanel } from '@/components/Panel/personal/ConversePanel';
import React from 'react';
import { useParams } from 'react-router';

export const PersonalConverse: React.FC = React.memo(() => {
  const params = useParams<{ converseId: string }>();

  if (!params.converseId) {
    return <NotFound />;
  }

  return <ConversePanel converseId={params.converseId} />;
});
PersonalConverse.displayName = 'PersonalConverse';
