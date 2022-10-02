import React from 'react';
import {
  FloatingToolbar,
  CommandButtonGroup,
  ToggleBoldButton,
  ToggleItalicButton,
  ToggleUnderlineButton,
  ToggleCodeButton,
} from '@remirror/react';

/**
 * 菜单
 */
export const Toolbar: React.FC = React.memo(() => {
  return (
    <FloatingToolbar>
      <CommandButtonGroup>
        <ToggleBoldButton />
        <ToggleItalicButton />
        <ToggleUnderlineButton />
        <ToggleCodeButton />
      </CommandButtonGroup>
    </FloatingToolbar>
  );
});
Toolbar.displayName = 'Toolbar';
