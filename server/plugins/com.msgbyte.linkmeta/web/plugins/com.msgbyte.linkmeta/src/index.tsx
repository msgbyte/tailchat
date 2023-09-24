import {
  regMessageExtraParser,
  regInspectService,
  getMessageTextDecorators,
} from '@capital/common';
import { Translate } from './translate';
import urlRegex from 'url-regex';
import React from 'react';
import { UrlMetaPreviewer } from './UrlMetaPreviewer';

regMessageExtraParser({
  name: 'com.msgbyte.linkmeta/urlParser',
  render({ content }) {
    const matched = String(
      getMessageTextDecorators().serialize(String(content))
    ).match(urlRegex());
    if (matched) {
      const urlMatch = matched
        .filter((m) => !m.includes('['))
        .filter((m) => !m.startsWith(window.location.origin));

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
