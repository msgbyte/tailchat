import React, { useMemo } from 'react';
import { encode } from 'js-base64';
import { isValidStr } from '@capital/common';
import { Translate } from '../translate';
import { FilterXSS, getDefaultWhiteList } from 'xss';
import _mapValues from 'lodash/mapValues';

const xss = new FilterXSS({
  // 允许style存在
  whiteList: {
    ..._mapValues(getDefaultWhiteList(), (v) => [...v, 'style']),
    style: [],
  },
  css: false,
});

const GroupCustomWebPanelRender: React.FC<{ panelInfo: any }> = (props) => {
  const panelInfo = props.panelInfo;

  if (!panelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  const html = panelInfo?.meta?.html;
  const src = useMemo(() => {
    if (isValidStr(html)) {
      try {
        return `data:text/html;charset=utf8;base64,${encode(
          xss.process(html)
        )}`;
      } catch (e) {
        return undefined;
      }
    } else {
      return undefined;
    }
  }, [html]);

  return <iframe className="w-full h-full" src={src} />;
};
GroupCustomWebPanelRender.displayName = 'GroupCustomWebPanelRender';

export default GroupCustomWebPanelRender;
