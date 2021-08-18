import React, { useRef, useState } from 'react';
import { closeModal, openModal } from './Modal';
import { showToasts, t } from 'tailchat-shared';
import { Avatar } from 'antd';
import { Icon } from '@iconify/react';
import { ModalAvatarCropper } from './modals/AvatarCropper';

interface AvatarPickerProps {
  className?: string;
  imageUrl?: string; // 初始image url, 仅children为空时生效
  onChange?: (blobUrl: string) => void;
  disabled?: boolean; // 禁用选择
}
/**
 * 头像选择器
 */
export const AvatarPicker: React.FC<AvatarPickerProps> = React.memo((props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [cropUrl, setCropUrl] = useState<string>(props.imageUrl || ''); // 裁剪后并使用的url

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (reader.result) {
          const key = openModal(
            <ModalAvatarCropper
              imageUrl={reader.result.toString()}
              onConfirm={(croppedImageBlobUrl) => {
                closeModal(key);
                setCropUrl(croppedImageBlobUrl);

                if (typeof props.onChange === 'function') {
                  props.onChange(croppedImageBlobUrl);
                }
              }}
            />,
            {
              maskClosable: false,
              closable: true,
            }
          );
        } else {
          showToasts(t('文件读取失败'), 'error');
        }
      });
      reader.readAsDataURL(e.target.files[0]);

      // 清理选中状态
      e.target.files = null;
      e.target.value = '';
    }
  };

  return (
    <div className={props.className}>
      <div
        className="cursor-pointer inline-block relative"
        onClick={() => !props.disabled && fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleSelectFile}
          accept="image/*"
        />
        {props.children ? (
          props.children
        ) : (
          <Avatar
            size={64}
            icon={<Icon className="anticon" icon="mdi:account" />}
            src={cropUrl}
          />
        )}
      </div>
    </div>
  );
});
AvatarPicker.displayName = 'AvatarPicker';
