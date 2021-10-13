import { closeModal, openModal } from '@/components/Modal';
import { ImageUploadPreviewer } from '@/components/modals/ImageUploadPreviewer';
import { fileToDataUrl } from '@/utils/file-helper';
import React from 'react';
import { uploadFile } from 'tailchat-shared';

/**
 * 上传聊天图片，并返回图片地址
 */
export function uploadMessageImage(image: File): Promise<string> {
  return new Promise((resolve) => {
    fileToDataUrl(image).then((imageLocalUrl) => {
      const key = openModal(
        <ImageUploadPreviewer
          imageUrl={imageLocalUrl}
          onConfirm={async () => {
            const fileInfo = await uploadFile(image);
            const imageRemoteUrl = fileInfo.url;

            resolve(imageRemoteUrl);
            closeModal(key);
          }}
        />
      );
    });
  });
}
