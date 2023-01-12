import React from 'react';
import { t, useMemoizedFn } from 'tailchat-shared';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { useChatInputActionContext } from './context';
import { uploadMessageImage } from './utils';
import { getMessageTextDecorators } from '@/plugin/common';
import { Icon } from 'tailchat-design';

export const ChatDropArea: React.FC = React.memo(() => {
  const actionContext = useChatInputActionContext();

  const handleDrop = useMemoizedFn((files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'));
    if (images.length > 0) {
      // 目前只取一张
      const img = images[0];
      uploadMessageImage(img).then(({ url, width, height }) => {
        actionContext?.sendMsg(
          getMessageTextDecorators().image(url, { width, height })
        );
      });
    }
  });

  const [collectedProps, ref] = useDrop({
    accept: [NativeTypes.FILE],
    drop(item: { files: any[] }) {
      handleDrop(item.files);
    },
    canDrop(item: any) {
      return true;
    },
    collect: (monitor: DropTargetMonitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  if (!collectedProps.canDrop) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={
        'absolute inset-0 bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-50 p-4'
      }
    >
      <div className="h-full w-full border-dashed border-8 flex flex-col justify-center items-center">
        <div>
          <Icon icon="mdi:cloud-upload" fontSize={128} />
        </div>
        <div className="text-xl font-bold">{t('拖放文件以发送到当前会话')}</div>
      </div>
    </div>
  );
});
ChatDropArea.displayName = 'ChatDropArea';
