import { Typography } from 'antd';
import React from 'react';
import { version } from 'tailchat-shared';
import logoUrl from '@assets/images/logo.svg';

const { Paragraph, Text } = Typography;

export const SettingsAbout: React.FC = React.memo(() => {
  return (
    <div className="select-text">
      <img
        className="float-right select-none"
        width={128}
        height={128}
        src={logoUrl}
      />

      <Paragraph>
        <Text className="font-bold">TailChat</Text>
        <Text>: 属于所有人的开源聊天工具</Text>
      </Paragraph>
      <Paragraph>可供高度自定义的聊天工具</Paragraph>
      <Paragraph>完全独属于私人团队的沟通平台</Paragraph>

      <Paragraph>
        <div>特性(亮点):</div>
        <ul className="list-disc list-inside">
          <li>基于面板的群组空间, 可高度自定义化</li>
          <li>基于微内核的前端插件支撑, 私人定制化</li>
          <li>分布式部署可供任意规模的使用需求</li>
        </ul>
      </Paragraph>

      <Paragraph>当前版本: {version}</Paragraph>
    </div>
  );
});
SettingsAbout.displayName = 'SettingsAbout';
