import React from 'react';
import { Editor } from '@bytemd/react';
import { plugins } from './plugins';
import 'bytemd/dist/index.css';
import './style.less';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
}
export const MarkdownEditor: React.FC<MarkdownEditorProps> = React.memo(
  (props) => {
    return (
      <Editor
        plugins={plugins}
        value={props.value ?? ''}
        onChange={props.onChange}
      />
    );
  }
);
MarkdownEditor.displayName = 'MarkdownEditor';
