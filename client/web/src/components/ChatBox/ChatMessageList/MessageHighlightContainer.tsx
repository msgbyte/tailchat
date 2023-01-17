import React, { PropsWithChildren, useEffect, useMemo } from 'react';

interface Props extends PropsWithChildren {
  messageId: string;
}

/**
 * 消息高亮容器
 * 在消息项的外部包裹该容器，则对应的消息会高亮
 * 基于 [data-message-id="xxx"] 选择器
 */
export const MessageHighlightContainer: React.FC<Props> = React.memo(
  (props) => {
    const className = useMemo(
      () => `message-highlight-${String(Math.random()).substring(2)}`,
      []
    );
    useEffect(() => {
      const style = document.createElement('style');
      style.innerHTML = `
.${className} [data-message-id="${props.messageId}"] {
  background: #e0e7ff !important;
}

.dark .${className} [data-message-id="${props.messageId}"] {
  background: rgba(0, 0, 0, 0.15) !important;
}
      `;
      style.setAttribute('highlight-message-id', props.messageId);

      document.body.append(style);

      return () => {
        style.remove();
      };
    }, [props.messageId, className]);

    return <div className={className}>{props.children}</div>;
  }
);
MessageHighlightContainer.displayName = 'MessageHighlightContainer';
