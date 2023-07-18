import { downloadUrl } from '@/utils/file-helper';
import React from 'react';
import { Icon } from 'tailchat-design';
import { useMemoizedFn, t } from 'tailchat-shared';
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
