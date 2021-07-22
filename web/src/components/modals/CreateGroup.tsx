import { Button, Carousel, Divider, Input, Typography } from 'antd';
import type { CarouselRef } from 'antd/lib/carousel';
import React, { useCallback, useRef, useState } from 'react';
import { Avatar } from '../Avatar';
import { ModalWrapper } from '../Modal';

export const ModalCreateGroup: React.FC = React.memo(() => {
  const carouselRef = useRef<CarouselRef>(null);
  const [name, setName] = useState('');

  const handleSelectTemplate = useCallback(() => {
    // TODO
    carouselRef.current?.next();
  }, []);

  const handleBack = useCallback(() => {
    carouselRef.current?.prev();
  }, []);

  const handleCreate = useCallback(() => {
    console.log({ name });
  }, [name]);

  return (
    <ModalWrapper style={{ width: 440 }}>
      <Carousel ref={carouselRef} dots={false}>
        <div>
          <Typography.Title level={4} className="text-center mb-4">
            创建群组
          </Typography.Title>

          <Typography.Paragraph className="mb-4 text-center">
            选择以下模板, 开始创建属于自己的群组吧!
          </Typography.Paragraph>

          <div
            className="w-full border rounded text-base py-2 px-3 cursor-pointer font-bold hover:bg-white hover:bg-opacity-10"
            onClick={handleSelectTemplate}
          >
            默认群组
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
      </Carousel>
    </ModalWrapper>
  );
});
ModalCreateGroup.displayName = 'ModalCreateGroup';
