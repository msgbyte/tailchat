import React from 'react';
import { useNavigate } from 'react-router';
import { t } from 'tailchat-shared';

interface Props {
  link: string;
  text: string;
}
/**
 * 跳转到会话面板
 */
export const JumpToButton: React.FC<Props> = React.memo((props) => {
  const navigate = useNavigate();

  return (
    <div className="absolute bottom-4 left-0 right-0 text-center">
      <div
        className="shadow-lg px-6 py-2 rounded-full inline-block bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
        onClick={() => {
          navigate(props.link);
        }}
      >
        {props.text}
      </div>
    </div>
  );
});
JumpToButton.displayName = 'JumpToButton';

export const JumpToGroupPanelButton: React.FC<{
  groupId: string;
  panelId: string;
}> = React.memo((props) => {
  const link = `/main/group/${props.groupId}/${props.panelId}`;

  return <JumpToButton link={link} text={t('跳转到面板')} />;
});
JumpToGroupPanelButton.displayName = 'JumpToGroupPanelButton';

export const JumpToConverseButton: React.FC<{
  groupId?: string;
  converseId: string;
}> = React.memo((props) => {
  const link = props.groupId
    ? `/main/group/${props.groupId}/${props.converseId}`
    : `/main/personal/converse/${props.converseId}`;

  return <JumpToButton link={link} text={t('跳转到会话')} />;
});
JumpToConverseButton.displayName = 'JumpToConverseButton';
