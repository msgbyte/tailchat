import React from 'react';
import {
  Remirror,
  useRemirror,
  OnChangeJSON,
  EditorComponent,
} from '@remirror/react';
import { useMemoizedFn } from 'ahooks';
import type { RemirrorJSON } from 'remirror';
import { Toolbar } from './toolbar';
import { extensions } from './extensions';
import { transformToBBCode } from './bbcode';
import './editor.css';

interface RichEditorProps extends React.PropsWithChildren {
  initContent: string;
  onChange: (bbcode: string) => void;
}
export const RichEditor: React.FC<RichEditorProps> = React.memo((props) => {
  const { manager, state } = useRemirror({
    extensions,
    content: props.initContent,
    stringHandler: 'html',
    selection: 'end',
  });

  const handleChange = useMemoizedFn((json: RemirrorJSON) => {
    props.onChange(transformToBBCode(json));
  });

  return (
    <Remirror
      classNames={['tailchat-rich-editor']}
      manager={manager}
      initialContent={state}
    >
      <Toolbar />
      <EditorComponent />
      <OnChangeJSON onChange={handleChange} />
      {props.children}
    </Remirror>
  );
});
RichEditor.displayName = 'RichEditor';
