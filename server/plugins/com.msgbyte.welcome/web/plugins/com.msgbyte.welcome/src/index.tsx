import { regPluginGroupConfigItem } from '@capital/common';
import { TextArea } from '@capital/component';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Translate } from './translate';

console.log('Plugin Group Welcome is loaded');

const Desc = styled.div`
  color: rgba(#999, 0.8);
  font-size: 9px;
  margin-top: 2px;
`;

regPluginGroupConfigItem({
  name: 'groupWelcomeText',
  title: Translate.welcomeText,
  tip: Translate.welcomeTip,
  component: ({ value, onChange, loading }) => {
    const [text, setText] = useState(value ?? '');

    return (
      <>
        <TextArea
          disabled={loading}
          value={text}
          maxLength={1000}
          showCount={true}
          rows={5}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => onChange(text)}
        />
        <Desc>{Translate.welcomeDesc}</Desc>
      </>
    );
  },
});
