import { blobUrlToFile } from '@/utils/file-helper';
import React, { useState } from 'react';
import { uploadFile, UploadFileResult, useAsyncRequest } from 'tailchat-shared';
import { AvatarPicker } from './AvatarPicker';

export const AvatarUploader: React.FC<{
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
      {props.children}
      {loading && (
        <div
          className="absolute bottom-0 left-0 h-1"
          style={{ width: `${uploadProgress}%` }}
        />
      )}
    </AvatarPicker>
  );
});
AvatarUploader.displayName = 'AvatarUploader';
