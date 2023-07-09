import { blobUrlToFile } from '@/utils/file-helper';
import clsx from 'clsx';
import React, { PropsWithChildren, useState } from 'react';
import { uploadFile, UploadFileResult, useAsyncRequest } from 'tailchat-shared';
import { ImagePicker } from './ImagePicker';

export const AvatarUploader: React.FC<
  PropsWithChildren<{
    circle?: boolean;
    className?: string;
    onUploadSuccess: (fileInfo: UploadFileResult) => void;
  }>
> = React.memo((props) => {
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
    <ImagePicker
      className={clsx('relative', {
        'rounded-full overflow-hidden': props.circle,
      })}
      disabled={loading}
      onChange={handlePickImage}
    >
      {loading && (
        <div
          className="absolute bottom-0 left-0 h-1"
          style={{ width: `${uploadProgress}%` }}
        />
      )}

      {props.children}
    </ImagePicker>
  );
});
AvatarUploader.displayName = 'AvatarUploader';
