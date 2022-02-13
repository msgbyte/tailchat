import { blobUrlToFile } from '@/utils/file-helper';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';
import React, { useState } from 'react';
import { uploadFile, UploadFileResult, useAsyncRequest } from 'tailchat-shared';
import { AvatarPicker } from './AvatarPicker';

export const AvatarUploader: React.FC<{
  circle?: boolean;
  className?: string;
  onUploadSuccess: (fileInfo: UploadFileResult) => void;
}> = React.memo((props) => {
  const [uploadProgress, setUploadProgress] = useState(0); // 0 - 100
  const [{ loading }, handlePickImage] = useAsyncRequest(
    async (blobUrl: string) => {
      const file = await blobUrlToFile(blobUrl);

      const fileInfo = await uploadFile(file, {
        onProgress(percent) {
          const uploadProgress = Number((percent * 100).toFixed());
          console.log(`进度:${uploadProgress}`);
          setUploadProgress(uploadProgress);
        },
      });

      console.log('上传成功', fileInfo);
      props.onUploadSuccess(fileInfo);
    },
    []
  );

  return (
    <AvatarPicker
      className="relative"
      disabled={loading}
      onChange={handlePickImage}
    >
      <div className={clsx('group', props.className)}>
        {props.children}
        {loading && (
          <div
            className="absolute bottom-0 left-0 h-1"
            style={{ width: `${uploadProgress}%` }}
          />
        )}

        <div
          className={clsx(
            'absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition opacity-0 group-hover:opacity-100',
            {
              'rounded-1/2': props.circle,
            }
          )}
        >
          <Icon className="text-white opacity-80" icon="mdi:camera-outline" />
        </div>
      </div>
    </AvatarPicker>
  );
});
AvatarUploader.displayName = 'AvatarUploader';
