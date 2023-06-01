import React, { useState } from 'react';
import {
  isValidStr,
  model,
  t,
  useAppDispatch,
  useAppSelector,
  useAsyncRequest,
  useCachedUserInfo,
  userActions,
} from 'tailchat-shared';
import { ModalWrapper } from '../Modal';
import { Button, Input, Space } from 'antd';
import { Problem } from '../Problem';
import { SubmitButton } from '../SubmitButton';

export const SetFriendNickname: React.FC<{
  userId: string;
  onSuccess?: () => void;
}> = React.memo((props) => {
  const userInfo = useCachedUserInfo(props.userId);
  const friendInfo = useAppSelector((state) =>
    state.user.friends.find((item) => item.id === props.userId)
  );
  const dispatch = useAppDispatch();
  const [nickname, setNickname] = useState(friendInfo?.nickname ?? '');

  const [, handleSetFriendNickname] = useAsyncRequest(async () => {
    await model.friend.setFriendNickname(props.userId, nickname);
    dispatch(
      userActions.setFriendNickname({
        friendId: props.userId,
        nickname,
      })
    );

    props.onSuccess?.();
  }, [props.userId, props.onSuccess, nickname]);

  if (!friendInfo) {
    return <Problem text={t('没有找到该用户信息, 可能出现了一些异常')} />;
  }

  return (
    <ModalWrapper
      title={
        isValidStr(friendInfo.nickname) ? t('更改好友昵称') : t('添加好友昵称')
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <p>{t('使用个人昵称更快地找到好友。仅您自己可见。')}</p>
        <Input
          placeholder={userInfo.nickname}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <Button type="text" onClick={() => setNickname('')}>
          {t('重置好友昵称')}
        </Button>

        <SubmitButton
          type="primary"
          block={true}
          size="large"
          onClick={handleSetFriendNickname}
        >
          {t('确认')}
        </SubmitButton>
      </Space>
    </ModalWrapper>
  );
});
SetFriendNickname.displayName = 'SetFriendNickname';
