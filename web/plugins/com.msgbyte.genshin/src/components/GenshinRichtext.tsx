import React, { useMemo } from 'react';
import parser from 'html-react-parser';

/**
 * 原神富文本渲染
 */
export const GenshinRichtext: React.FC<{
  raw: string;
}> = React.memo(({ raw }) => {
  const el = useMemo(() => {
    const processedHtml = raw.replace(
      /\<color=(.*?)\>(.*?)\<\/color\>/g,
      '<span style="color: $1;">$2</span>'
    );

    return parser(processedHtml);
  }, [raw]);
  return <>{el}</>;
});
GenshinRichtext.displayName = 'GenshinRichtext';
