import { Intersection } from '@/components/Intersection';
import React from 'react';
import { useConverseAck, useEvent } from 'tailchat-shared';

/**
 * 消息已读回调容器
 * 套在消息体外面可以实现消息出现在视野内就发送已读提示
 */
interface MessageAckContainerProps extends React.PropsWithChildren {
  converseId: string;
  messageId: string;
}
export const MessageAckContainer: React.FC<MessageAckContainerProps> =
  React.memo((props) => {
    const { updateConverseAck } = useConverseAck(props.converseId);

    const handleIntersection = useEvent(() => {
      updateConverseAck(props.messageId);
    });

    return (
      <Intersection onIntersection={handleIntersection}>
        {props.children}
      </Intersection>
    );
  });
MessageAckContainer.displayName = 'MessageAckContainer';
