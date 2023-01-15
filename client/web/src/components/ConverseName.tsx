import React from 'react';
import { useAppSelector, useDMConverseName } from 'tailchat-shared';

interface ConverseNameProps {
  converseId: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ConverseName: React.FC<ConverseNameProps> = React.memo((props) => {
  const { converseId, className, style } = props;
  const converse = useAppSelector((state) => state.chat.converses[converseId]);
  const converseName = useDMConverseName(converse);

  return (
    <span className={className} style={style}>
      {converseName}
    </span>
  );
});
ConverseName.displayName = 'ConverseName';
