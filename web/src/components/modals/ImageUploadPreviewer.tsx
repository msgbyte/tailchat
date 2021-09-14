import { ModalWrapper } from '@/plugin/common';
import { Button } from '@/plugin/component';
import React from 'react';
import { t, useAsyncFn } from 'tailchat-shared';

interface ImageUploadPreviewerProps {
  imageUrl: string;
  onConfirm: () => void;
}
export const ImageUploadPreviewer: React.FC<ImageUploadPreviewerProps> =
  React.memo((props) => {
    const { imageUrl } = props;

    const [{ loading }, handleConfirm] = useAsyncFn(async () => {
      if (typeof props.onConfirm === 'function') {
        await Promise.resolve(props.onConfirm());
      }
    }, [props.onConfirm]);

    return (
      <ModalWrapper style={{ maxHeight: '60vh', maxWidth: '60vw' }}>
        <div className="flex">
          <div className="w-2/3 p-2.5 bg-black bg-opacity-20 rounded">
            <img className="max-h-160" src={imageUrl} />
          </div>

          <div className="w-1/3 p-2 flex flex-col items-end justify-between">
            <div className="text-right">
              <div className="text-lg">{t('上传图片到会话')}</div>
              <div className="text-sm text-gray-400">
                {t('请勿上传违反当地法律法规的图片')}
              </div>
            </div>

            <Button
              className="mt-4"
              type="primary"
              loading={loading}
              onClick={handleConfirm}
            >
              {t('确认')}
            </Button>
          </div>
        </div>
      </ModalWrapper>
    );
  });
ImageUploadPreviewer.displayName = 'ImageUploadPreviewer';
