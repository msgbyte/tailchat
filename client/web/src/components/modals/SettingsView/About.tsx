import { Typography } from 'antd';
import React from 'react';
import { t, version } from 'tailchat-shared';
import logoUrl from '@assets/images/logo.svg';
import { Icon } from 'tailchat-design';

const { Paragraph, Text, Link } = Typography;

const LogoLink: React.FC<{
  src: string;
  icon: React.ReactNode | string;
}> = React.memo((props) => {
  const { src, icon } = props;

  return (
    <a
      className="p-2.5 hover:bg-black hover:bg-opacity-20 rounded"
      href={src}
      target="_blank"
      rel="noreferrer"
    >
      {typeof icon === 'string' ? <Icon icon={icon} /> : icon}
    </a>
  );
});
LogoLink.displayName = 'LogoLink';

export const SettingsAbout: React.FC = React.memo(() => {
  return (
    <div className="select-text">
      <img
        className="float-right select-none bg-black rounded-2xl bg-opacity-40 p-2"
        width={128}
        height={128}
        src={logoUrl}
      />

      <Paragraph>
        <Text className="font-bold">Tailchat</Text>
        <Text>: {t('属于所有人的开源聊天工具')} </Text>
      </Paragraph>
      <Paragraph>{t('可供高度自定义的聊天工具')}</Paragraph>
      <Paragraph>{t('完全独属于私人团队的沟通平台')}</Paragraph>

      <Paragraph>
        <div>{t('特性(亮点)')}:</div>
        <ul className="list-disc list-inside">
          <li>{t('基于面板的群组空间, 可高度自定义化')}</li>
          <li>{t('基于微内核的前端插件支撑, 私人定制化')}</li>
          <li>{t('分布式部署可供任意规模的使用需求')}</li>
        </ul>
      </Paragraph>

      <Paragraph>
        {t('当前版本')}: {version}
      </Paragraph>

      <div className="text-8xl flex flex-wrap space-x-4 bg-black p-4 rounded-md bg-opacity-20">
        <LogoLink
          src="https://github.com/msgbyte/tailchat"
          icon="logos:github-octocat"
        />
        <LogoLink
          src="https://en.wikipedia.org/wiki/Open_source"
          icon="logos:opensource"
        />
        <LogoLink src="https://www.docker.com/" icon="logos:docker-icon" />
        <LogoLink
          src="https://ministar.moonrailgun.com/"
          icon={
            <img
              className="w-24 h-24"
              src="https://ministar.moonrailgun.com/img/logo.svg"
            />
          }
        />
        <LogoLink src="https://zh-hans.reactjs.org/" icon="logos:react" />
        <LogoLink src="https://redux.js.org/" icon="logos:redux" />
        <LogoLink
          src="https://www.typescriptlang.org/"
          icon="logos:typescript-icon"
        />
      </div>

      <Paragraph className="mt-4">
        {t('开源地址')}:{' '}
        <Link href="https://github.com/msgbyte/tailchat" target="_blank">
          https://github.com/msgbyte/tailchat
        </Link>
      </Paragraph>
    </div>
  );
});
SettingsAbout.displayName = 'SettingsAbout';
