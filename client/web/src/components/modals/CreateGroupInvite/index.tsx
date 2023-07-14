import { Icon } from 'tailchat-design';
import React from 'react';
import { useGroupInfo, t } from 'tailchat-shared';
import { ModalWrapper } from '../../Modal';
import { CreateInviteCode } from './CreateInviteCode';

/**
 * 群组邀请
 */

interface CreateGroupInviteProps {
  groupId: string;
  onInviteCreated?: () => void;
  onInviteUpdated?: () => void;
}
export const CreateGroupInvite: React.FC<CreateGroupInviteProps> = React.memo(
  (props) => {
    const groupId = props.groupId;
    const groupInfo = useGroupInfo(groupId);
    // const [searchName, setSearchName] = useState('');

    // const handleSearch = useCallback(() => {
    //   console.log('searchName', searchName);
    // }, []);

    if (!groupInfo) {
      return <div>{t('异常')}</div>;
    }

    return (
      <ModalWrapper>
        {/* <div>邀请好友加入群组 {groupInfo.name}</div>

      <div>
        <Input.Search
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onSearch={handleSearch}
        />
      </div>

      <Divider>或者创建链接并发送给外部好友</Divider> */}

        <Icon
          className="text-6xl block m-auto opacity-30 mb-4 mt-2"
          icon="mdi:email-edit-outline"
        />

        <div className="text-gray-400 font-bold text-lg mb-2">
          {t('创建链接并发送给外部好友')}
        </div>

        <CreateInviteCode
          groupId={groupId}
          onInviteCreated={props.onInviteCreated}
          onInviteUpdated={props.onInviteUpdated}
        />
      </ModalWrapper>
    );
  }
);
CreateGroupInvite.displayName = 'GroupInvite';
