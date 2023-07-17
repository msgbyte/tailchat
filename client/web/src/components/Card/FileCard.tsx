import { downloadUrl } from '@/utils/file-helper';
import React from 'react';
import { Icon } from 'tailchat-design';
import { useMemoizedFn, t, parseUrlStr } from 'tailchat-shared';
import { IconBtn } from '../IconBtn';
import { CardWrapper } from './Wrapper';

export interface FileCardPayload {
  label: string;
  url: string;
}

export const FileCard: React.FC<{
  payload: FileCardPayload;
}> = React.memo((props) => {
  const payload = props.payload ?? {};

  const handleDownload = useMemoizedFn(() => {
    downloadUrl(payload.url, payload.label);
  });
  let videoShow = true;
  const showVideo = useMemoizedFn(() => {
    videoShow = false;
  });

  const fileType = payload.url.substring(payload.url.lastIndexOf('.') + 1);

  if (fileType === 'mp4' || fileType === 'webm' || fileType === 'ogg') {
    return (
      <CardWrapper>
        <div>
          <div className="flex w-full items-center">
            <div className="mr-3 overflow-hidden flex-1">
              <div className="text-sm text-black text-opacity-60 dark:text-white dark:text-opacity-60">
                {payload.label}
              </div>
            </div>
            <IconBtn
              title={t('下载')}
              icon="mdi:cloud-download-outline"
              onClick={handleDownload}
            />
          </div>
          <br />
          <video
            src={parseUrlStr(payload.url)}
            width={300}
            controls
            autoPlay={false}
            preload={'none'}
          ></video>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <div className="flex w-full items-center">
        <div className="mr-3 overflow-hidden flex-1">
          <div className="flex text-lg items-center">
            <Icon icon="mdi:paperclip" />
            <span className="ml-1">{t('文件')}</span>
          </div>

          <div className="text-sm text-black text-opacity-60 dark:text-white dark:text-opacity-60">
            {payload.label}
          </div>
        </div>

        <IconBtn
          title={t('下载')}
          icon="mdi:cloud-download-outline"
          onClick={handleDownload}
        />
      </div>
    </CardWrapper>
  );
});
FileCard.displayName = 'FileCard';
