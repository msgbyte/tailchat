import React, { Fragment } from 'react';
import bbcodeParser from './parser';
import urlRegex from 'url-regex';

/**
 * 客户端预处理文本
 * @param plainText 服务端文本
 */
export function preProcessLinkText(plainText: string): string {
  const text = plainText.replace(
    urlRegex({ exact: false, strict: true }),
    '[url]$&[/url]'
  ); // 将聊天记录中的url提取成bbcode 需要过滤掉被bbcode包住的部分

  return text;
}

// 处理所有的预处理文本
export function preProcessText(plainText: string): string {
  return bbcodeParser.preProcessText(plainText, preProcessLinkText);
}

interface BBCodeProps {
  plainText: string;
}
export const BBCode: React.FC<BBCodeProps> = React.memo(({ plainText }) => {
  const bbcodeComponent = bbcodeParser.render(preProcessText(plainText ?? ''));

  return <Fragment>{bbcodeComponent}</Fragment>;
});
BBCode.displayName = 'BBCode';
