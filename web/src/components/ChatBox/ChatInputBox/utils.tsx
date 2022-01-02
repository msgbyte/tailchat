import { closeModal, openModal } from '@/components/Modal';
import { ImageUploadPreviewer } from '@/components/modals/ImageUploadPreviewer';
import { fileToDataUrl } from '@/utils/file-helper';
import React from 'react';
import { uploadFile } from 'tailchat-shared';

/**
 * 上传聊天图片，并返回图片地址
 */
export function uploadMessageImage(image: File): Promise<{
  url: string;
  width: number;
  height: number;
}> {
  return new Promise((resolve) => {
    fileToDataUrl(image).then((imageLocalUrl) => {
      const key = openModal(
        <ImageUploadPreviewer
          imageUrl={imageLocalUrl}
          onCancel={() => {
            closeModal(key);
          }}
          onConfirm={async (size) => {
            const fileInfo = await uploadFile(image);
            const imageRemoteUrl = fileInfo.url;

            resolve({
              url: imageRemoteUrl,
              width: size.width,
              height: size.height,
            });
            closeModal(key);
          }}
        />
      );
    });
  });
}
