import { regChatInputButton } from '@capital/common';
import { BaseChatInputButton } from '@capital/component';
import React from 'react';
import { AssistantPopover } from './popover';

const PLUGIN_ID = 'com.msgbyte.ai-assistant';
const PLUGIN_NAME = 'AI Assistant';

console.log(`Plugin ${PLUGIN_NAME}(${PLUGIN_ID}) is loaded`);

regChatInputButton({
  render: () => {
    return (
      <BaseChatInputButton
        icon="eos-icons:ai"
        popoverContent={({ hidePopover }) => (
          <AssistantPopover onCompleted={hidePopover} />
        )}
      />
    );
  },
});
