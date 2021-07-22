import { Button, Divider, Input, Typography } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { GroupPanelType } from 'tailchat-shared';
import type { GroupPanel } from 'tailchat-shared';
import { Avatar } from '../Avatar';
import { ModalWrapper } from '../Modal';
import { Slides, SlidesRef } from '../Slides';

const panelTemplate: {
  key: string;
  label: string;
  panels: GroupPanel[];
}[] = [
  {
    key: 'default',
    label: '默认群组',
    panels: [
      {
        id: '00',
        name: '文字频道',
        type: GroupPanelType.GROUP,
      },
      {
        id: '01',
        name: '大厅',
        parentId: '00',
        type: GroupPanelType.TEXT,
      },
    ],
  },
  {
    key: 'work',
    label: '工作协同',
    panels: [
      {
        id: '00',
        name: '公共',
        type: GroupPanelType.GROUP,
      },
      {
        id: '01',
        name: '全员',
        parentId: '00',
        type: GroupPanelType.TEXT,
      },
      {
        id: '10',
        name: '临时会议',
        type: GroupPanelType.GROUP,
      },
      {
        id: '11',
        name: '会议室1',
        parentId: '10',
        type: GroupPanelType.TEXT,
      },
      {
        id: '11',
        name: '会议室2',
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

  const handleSelectTemplate = useCallback((panels: GroupPanel[]) => {
    setPanels(panels);
    slidesRef.current?.next();
  }, []);

  const handleBack = useCallback(() => {
    slidesRef.current?.prev();
  }, []);

  const handleCreate = useCallback(() => {
    console.log({ name, panels });
  }, [name, panels]);

  return (
    <ModalWrapper style={{ width: 440 }}>
      <Slides ref={slidesRef}>
        <div>
          <Typography.Title level={4} className="text-center mb-4">
            创建群组
          </Typography.Title>

          <Typography.Paragraph className="mb-4 text-center">
            选择以下模板, 开始创建属于自己的群组吧!
          </Typography.Paragraph>

          <div className="space-y-2.5">
            {panelTemplate.map((template) => (
              <div
                key={template.key}
                className="w-full border rounded text-base py-2 px-3 cursor-pointer font-bold hover:bg-white hover:bg-opacity-10"
                onClick={() => handleSelectTemplate(template.panels)}
              >
                {template.label}
              </div>
            ))}
          </div>
        </div>

        <div>
          <Typography.Title level={4} className="text-center mb-4">
            自定义你的群组
          </Typography.Title>

          <Typography.Paragraph className="text-center mb-2">
            不要担心, 在此之后你可以随时进行变更
          </Typography.Paragraph>

          <div className="text-center mb-2">
            {/* TODO */}
            <Avatar size={80} name={name} />
          </div>

          <div>
            <div>群组名称:</div>

            <Input
              className="shadow-none"
              size="large"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Divider />

          <div className="flex justify-between">
            <Button
              type="link"
              onClick={handleBack}
              className="text-white font-bold"
            >
              返回
            </Button>
            <Button type="primary" onClick={handleCreate}>
              确认创建
            </Button>
          </div>
        </div>
      </Slides>
    </ModalWrapper>
  );
});
ModalCreateGroup.displayName = 'ModalCreateGroup';
