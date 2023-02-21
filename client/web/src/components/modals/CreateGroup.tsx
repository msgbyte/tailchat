import { Button, Divider, Input, Typography } from 'antd';
import React, { Fragment, useCallback, useRef, useState } from 'react';
import {
  createGroup,
  GroupPanelType,
  t,
  useAppDispatch,
  useAsyncRequest,
  groupActions,
} from 'tailchat-shared';
import type { GroupPanel } from 'tailchat-shared';
import { closeModal, ModalWrapper } from '../Modal';
import { Slides, SlidesRef } from '../Slides';
import { useNavigate } from 'react-router';
import { applyDefaultFallbackGroupPermission } from 'tailchat-shared';
import { Avatar } from 'tailchat-design';

const panelTemplate: {
  key: string;
  label: string;
  panels: GroupPanel[];
}[] = [
  {
    key: 'default',
    label: t('默认群组'),
    panels: [
      {
        id: '00',
        name: t('文字频道'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '01',
        name: t('大厅'),
        parentId: '00',
        type: GroupPanelType.TEXT,
      },
    ],
  },
  {
    key: 'work',
    label: t('工作协同'),
    panels: [
      {
        id: '00',
        name: t('公共'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '01',
        name: t('全员'),
        parentId: '00',
        type: GroupPanelType.TEXT,
      },
      {
        id: '10',
        name: t('临时会议'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '11',
        name: t('会议室') + '1',
        parentId: '10',
        type: GroupPanelType.TEXT,
      },
      {
        id: '11',
        name: t('会议室') + '2',
        parentId: '10',
        type: GroupPanelType.TEXT,
      },
    ],
  },
];

export const ModalCreateGroup: React.FC = React.memo(() => {
  const slidesRef = useRef<SlidesRef>(null);
  const [panels, setPanels] = useState<GroupPanel[]>([]);
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSelectTemplate = useCallback((panels: GroupPanel[]) => {
    setPanels(panels);
    slidesRef.current?.next();
  }, []);

  const handleBack = useCallback(() => {
    slidesRef.current?.prev();
  }, []);

  const [{ loading }, handleCreate] = useAsyncRequest(async () => {
    const data = await createGroup(name, panels);

    dispatch(groupActions.appendGroups([data]));

    navigate(`/main/group/${data._id}`); // 创建完成后跳转到新建的群组

    // 应用默认权限
    await applyDefaultFallbackGroupPermission(String(data._id));

    closeModal();
  }, [name, panels, location]);

  return (
    <ModalWrapper style={{ maxWidth: 440 }}>
      <Slides ref={slidesRef}>
        <div>
          <Typography.Title level={4} className="text-center mb-4">
            {t('创建群组')}
          </Typography.Title>

          <Typography.Paragraph className="mb-4 text-center">
            {t('选择以下模板, 开始创建属于自己的群组吧!')}
          </Typography.Paragraph>

          <div className="space-y-2.5">
            {panelTemplate.map((template, index) => (
              <Fragment key={template.key}>
                {/* Hardcode: 将第一个模板与之后的模板区分开 */}
                {index === 1 && <Divider />}
                <div
                  key={template.key}
                  className="w-full border rounded text-base py-2 px-3 cursor-pointer font-bold hover:bg-white hover:bg-opacity-10"
                  onClick={() => handleSelectTemplate(template.panels)}
                >
                  {template.label}
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <div>
          <Typography.Title level={4} className="text-center mb-4">
            {t('自定义你的群组')}
          </Typography.Title>

          <Typography.Paragraph className="text-center mb-2">
            {t('不要担心, 在此之后你可以随时进行变更')}
          </Typography.Paragraph>

          <div className="text-center mb-2">
            {/* TODO: upload avatar */}
            <Avatar className="mx-auto" size={80} name={name} />
          </div>

          <div>
            <div>{t('群组名称')}:</div>

            <Input
              className="shadow-none"
              size="large"
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Divider />

          <div className="flex justify-between">
            <Button
              type="link"
              onClick={handleBack}
              className="text-gray-600 dark:text-white font-bold"
            >
              {t('返回')}
            </Button>
            <Button type="primary" loading={loading} onClick={handleCreate}>
              {t('确认创建')}
            </Button>
          </div>
        </div>
      </Slides>
    </ModalWrapper>
  );
});
ModalCreateGroup.displayName = 'ModalCreateGroup';
