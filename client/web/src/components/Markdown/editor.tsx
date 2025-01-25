import React from 'react';
import { Editor, EditorProps } from '@bytemd/react';
import { uploadFile, UploadFileUsage } from 'tailchat-shared';
import { Markdown } from '../Markdown';
import { createRoot } from 'react-dom/client';
import gfm from '@bytemd/plugin-gfm';
import 'bytemd/dist/index.css';
import './editor.less';

export const plugins = [gfm()];

const overridePreview: EditorProps['overridePreview'] = (el, props) => {
  createRoot(el).render(
    <div className="markdown-body">
      <Markdown raw={props.value} />
    </div>
  );
};

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  imageUsage?: UploadFileUsage;
}
export const MarkdownEditor: React.FC<MarkdownEditorProps> = React.memo(
  (props) => {
    return (
      <Editor
        plugins={plugins}
        value={props.value ?? ''}
        onChange={props.onChange}
        uploadImages={(files) => {
          return Promise.all(
            files.map((f) =>
              uploadFile(f, {
                usage: props.imageUsage || 'unknown',
              }).then((file) => {
                return {
                  url: file.url,
                };
              })
            )
          );
        }}
        overridePreview={overridePreview}
      />
    );
  }
);
MarkdownEditor.displayName = 'MarkdownEditor';
