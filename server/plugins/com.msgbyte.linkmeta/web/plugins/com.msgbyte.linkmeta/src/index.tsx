import { regMessageExtraParser, regInspectService } from '@capital/common';
import { Translate } from './translate';
import urlRegex from 'url-regex';
import React from 'react';
import { UrlMetaPreviewer } from './UrlMetaPreviewer';

regMessageExtraParser({
  name: 'com.msgbyte.linkmeta/urlParser',
  render({ content }) {
    const matched = String(content).match(urlRegex());
    if (matched) {
      const urlMatch = matched.filter((m) => !m.includes('['));

      if (urlMatch.length > 0 && typeof urlMatch[0] === 'string') {
        return <UrlMetaPreviewer url={urlMatch[0]} />;
      }
    }

    return null;
  },
});

regInspectService({
  name: 'plugin:com.msgbyte.linkmeta',
  label: Translate.linkmetaService,
});
