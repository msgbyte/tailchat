import React, { useCallback, useRef, useState } from 'react';
import { showToasts, t, useAsyncFn } from 'tailchat-shared';
import { useGlobalKeyDown } from '../../hooks/useGlobalKeyDown';
import { isEnterHotkey, isEscHotkey } from '../../utils/hot-key';
import { Switch, Button } from 'antd';
import { ModalWrapper } from '@/components/Modal';

interface ImageSize {
  width: number;
  height: number;
}

interface ImageUploadPreviewerProps {
  imageUrl: string;
  onConfirm: (imageUploadInfo: {
    size: ImageSize;
    uploadOriginImage: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}
export const ImageUploadPreviewer: React.FC<ImageUploadPreviewerProps> =
  React.memo((props) => {
    const { imageUrl } = props;
    const imageSizeRef = useRef<ImageSize>({ width: 0, height: 0 });
    const [uploadOriginImage, setUploadOriginImage] = useState(false);

    const [{ loading }, handleConfirm] = useAsyncFn(async () => {
      if (
        imageSizeRef.current.width === 0 ||
        imageSizeRef.current.height === 0
      ) {
        showToasts(t('操作过于频繁'), 'warning');
        return;
      }

      if (typeof props.onConfirm === 'function') {
        await Promise.resolve(
          props.onConfirm({
            size: imageSizeRef.current,
            uploadOriginImage,
          })
        );
      }
    }, [props.onConfirm, uploadOriginImage]);

    useGlobalKeyDown(
      (e) => {
        if (isEnterHotkey(e)) {
          e.stopPropagation();
          e.preventDefault();
          handleConfirm();
        } else if (isEscHotkey(e)) {
          e.stopPropagation();
          props.onCancel();
        }
      },
      {
        capture: true,
      }
    );

    const handleLoad = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;

        imageSizeRef.current = {
          width: target.naturalWidth,
          height: target.naturalHeight,
        };
      },
      []
    );

    return (
      <ModalWrapper style={{ maxHeight: '60vh', maxWidth: '60vw' }}>
        <div className="flex">
          <div className="w-2/3 p-2.5 bg-black bg-opacity-20 rounded">
            <img
              className="max-h-72 m-auto"
              src={imageUrl}
              onLoad={handleLoad}
            />
          </div>

          <div className="w-1/3 p-2 flex flex-col items-end justify-between">
            <div className="text-right">
              <div className="text-lg">{t('上传图片到会话')}</div>
              <div className="text-sm text-gray-400">
                {t('请勿上传违反当地法律法规的图片')}
              </div>
            </div>

            <div className="w-full">
              <div className="text-left">
                <Switch
                  checked={uploadOriginImage}
                  onChange={(checked) => setUploadOriginImage(checked)}
                />
                <span>{t('上传原图')}</span>
              </div>

              <div className="text-right">
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
          </div>
        </div>
      </ModalWrapper>
    );
  });
ImageUploadPreviewer.displayName = 'ImageUploadPreviewer';
