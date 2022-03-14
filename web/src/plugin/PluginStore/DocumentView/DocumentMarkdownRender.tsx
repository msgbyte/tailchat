import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Markdown } from '@/components/Markdown';
import { Problem } from '@/components/Problem';
import React from 'react';
import { useAsync } from 'tailchat-shared';

export const DocumentMarkdownRender: React.FC<{ url: string }> = React.memo(
  ({ url }) => {
    const { loading, value, error } = useAsync(async () => {
      const data = await fetch(url);
      if (data.status >= 400) {
        throw new Error('请求异常');
      }
      const raw = data.text();

      return raw;
    }, [url]);

    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <Problem text={String(error)} />;
    }

    return <Markdown raw={String(value)} />;
  }
);
DocumentMarkdownRender.displayName = 'DocumentMarkdownRender';
