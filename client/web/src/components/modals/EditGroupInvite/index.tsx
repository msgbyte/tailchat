import { MetaFormFieldMeta, WebMetaForm } from 'tailchat-design';
import React from 'react';
import { model, t, useEvent } from 'tailchat-shared';
import { ModalWrapper } from '../../Modal';

interface MetaFormValues {
  expiredAt: number;
  usageLimit: number;
}

const fields: MetaFormFieldMeta[] = [
  {
    type: 'select',
    name: 'expiredAt',
    label: t('过期时间'),
    defaultValue: -1,
    options: [
      {
        label: t('30分钟'),
        value: 30 * 60,
      },
      {
        label: t('1小时'),
        value: 60 * 60,
      },
      {
        label: t('6小时'),
        value: 6 * 60 * 60,
      },
      {
        label: t('12小时'),
        value: 12 * 60 * 60,
      },
      {
        label: t('1天'),
        value: 24 * 60 * 60,
      },
      {
        label: t('7天'),
        value: 7 * 24 * 60 * 60,
      },
      {
        label: t('永不'),
        value: -1,
      },
    ],
  },
  {
    type: 'select',
    name: 'usageLimit',
    label: t('最大使用次数'),
    defaultValue: -1,
    options: [
      {
        label: t('无限制'),
        value: -1,
      },
      {
        label: t('1次使用'),
        value: 1,
      },
      {
        label: t('5次使用'),
        value: 5,
      },
      {
        label: t('10次使用'),
        value: 10,
      },
      {
        label: t('25次使用'),
        value: 25,
      },
      {
        label: t('50次使用'),
        value: 50,
      },
      {
        label: t('100次使用'),
        value: 100,
      },
    ],
  },
];

/**
 * 群组邀请
 */

interface EditGroupInviteProps {
  groupId: string;
  code: string;
  onEditSuccess: () => void;
}
export const EditGroupInvite: React.FC<EditGroupInviteProps> = React.memo(
  (props) => {
    const handleEditGroupInvite = useEvent(async (values: MetaFormValues) => {
      await model.group.editGroupInvite(
        props.groupId,
        props.code,
        values.expiredAt === -1
          ? undefined
          : Date.now() + values.expiredAt * 1000,
        values.usageLimit === -1 ? undefined : values.usageLimit
      );

      props.onEditSuccess();
    });

    return (
      <ModalWrapper title={t('编辑邀请链接')}>
        <WebMetaForm fields={fields} onSubmit={handleEditGroupInvite} />
      </ModalWrapper>
    );
  }
);
EditGroupInvite.displayName = 'EditGroupInvite';
