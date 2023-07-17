import { downloadUrl } from '@/utils/file-helper';
import React from 'react';
import { Icon } from 'tailchat-design';
import { useMemoizedFn, t } from 'tailchat-shared';
import { IconBtn } from '../IconBtn';
import { CardWrapper } from './Wrapper';
import { parseUrlStr } from 'tailchat-shared';

export interface VideoCardPayload {
  label: string;
  url: string;
}

export const VideoCard: React.FC<{
  payload: VideoCardPayload;
}> = React.memo((props) => {
  const payload = props.payload ?? {};

  const handleDownload = useMemoizedFn(() => {
    downloadUrl(payload.url, payload.label);
  });

  return (
    <div>
      <video
        src={parseUrlStr(payload.url)}
        width={300}
        controls
        autoPlay={false}
      ></video>
    </div>
  );
});
VideoCard.displayName = 'VideoCard';
