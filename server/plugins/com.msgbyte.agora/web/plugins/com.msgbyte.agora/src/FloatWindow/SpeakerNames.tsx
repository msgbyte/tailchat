import React from 'react';
import { joinArray } from '@capital/common';
import { useMeetingStore } from './store';
import { UserName } from '@capital/component';
import { Translate } from '../translate';

export const SpeakerNames: React.FC = React.memo(() => {
  const volumes = useMeetingStore((state) => state.volumes);
  const activeUserNames = volumes
    .filter((v) => v.level >= 60)
    .map((v) => <UserName key={v.uid} userId={v.uid} />);

  return (
    <span>
      <span>{joinArray(activeUserNames, ',')}</span>

      {activeUserNames.length > 0
        ? ' ' + Translate.isSpeaking
        : Translate.nomanSpeaking}
    </span>
  );
});
SpeakerNames.displayName = 'SpeakerNames';
