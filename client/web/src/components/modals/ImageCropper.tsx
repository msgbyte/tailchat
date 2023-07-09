import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop/types';
import _isNil from 'lodash/isNil';
import { showToasts, t } from 'tailchat-shared';
import React, { useState } from 'react';
import { Button } from 'antd';
import { ModalWrapper } from '../Modal';

/**
 * 头像裁剪模态框
 */
export const ImageCropperModal: React.FC<{
  imageUrl: string;
  aspect?: number;
  onConfirm: (croppedImageBlobUrl: string) => void;
}> = React.memo((props) => {
  const aspect = props.aspect ?? 1;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area>({ width: 0, height: 0, x: 0, y: 0 });

  const handleConfirm = async () => {
    const blobUrl = await getCroppedImg(
      await createImage(props.imageUrl),
      area
    );
    props.onConfirm(blobUrl);
  };

  return (
    <ModalWrapper
      className="flex flex-col"
      style={{ width: '80vw', height: '80vh' }}
    >
      <div className="flex-1 relative mb-4">
        <Cropper
          image={props.imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, area) => setArea(area)}
        />
      </div>

      <Button type="primary" onClick={handleConfirm}>
        {t('确认')}
      </Button>
    </ModalWrapper>
  );
});
ImageCropperModal.displayName = 'ImageCropperModal';

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });
}

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

let fileUrlTemp: string | null = null; // 缓存裁剪后的图片url
/**
 * 根据裁剪信息裁剪原始图片
 * 生成一个临时的资源文件路径
 * @param image 原始图片元素
 * @param crop 裁剪信息
 * @param rotation 旋转角度
 * @param fileName 文件名
 * @returns 裁剪后的图片blob url
 */
function getCroppedImg(
  image: HTMLImageElement,
  crop: Area,
  rotation = 0,
  fileName = 'newFile.jpeg'
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!_isNil(ctx)) {
    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    // set each dimensions to double largest dimension to allow for a safe area for the
    // image to rotate in without being clipped by canvas context
    canvas.width = safeArea;
    canvas.height = safeArea;

    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // draw rotated image and store data.
    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );
    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = crop.width;
    canvas.height = crop.height;

    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - crop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - crop.y)
    );
  }

  return new Promise<string>((resolve) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          // reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        (blob as any).name = fileName;
        if (typeof fileUrlTemp === 'string') {
          window.URL.revokeObjectURL(fileUrlTemp);
        }
        fileUrlTemp = window.URL.createObjectURL(blob);
        resolve(fileUrlTemp);
      }, 'image/jpeg');
    } catch (err) {
      console.error(err);
      showToasts('无法正确生成图片, 可能是因为您的浏览器版本过旧', 'error');
    }
  });
}
