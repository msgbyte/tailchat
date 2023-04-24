import { Problem } from '@/components/Problem';
import React from 'react';
import styled from 'styled-components';
import { isValidStr, t } from 'tailchat-shared';
import { DocumentMarkdownRender } from './DocumentMarkdownRender';

const DocumentIframe = styled.iframe`
  .tc-modal & {
    width: 60vw;
    height: 70vh;
    min-width: 100%;
  }
`;

interface DocumentViewProps {
  documentUrl?: string;
}
export const DocumentView: React.FC<DocumentViewProps> = React.memo((props) => {
  const { documentUrl } = props;

  if (!isValidStr(documentUrl)) {
    return <Problem text={t('该插件没有更多描述')} />;
  }

  if (documentUrl.endsWith('.md')) {
    return <DocumentMarkdownRender url={documentUrl} />;
  } else if (documentUrl.endsWith('.html') || documentUrl.startsWith('http')) {
    return <DocumentIframe src={documentUrl} />;
  } else {
    return <Problem text={t('不支持渲染的文档链接')} />;
  }
});
DocumentView.displayName = 'DocumentView';
