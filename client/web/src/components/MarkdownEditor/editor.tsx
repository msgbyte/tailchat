import React from 'react';
import { Editor } from '@bytemd/react';
import { plugins } from './plugins';
import { uploadFile } from 'tailchat-shared';
import { Markdown } from '../Markdown';
import { createRoot } from 'react-dom/client';
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
        uploadImages={(files) => {
          return Promise.all(
            files.map((f) =>
              uploadFile(f).then((file) => {
                return {
                  url: file.url,
                };
              })
            )
          );
        }}
        overridePreview={(el, props) =>
          createRoot(el).render(
            <div className="markdown-body">
              <Markdown raw={props.value} />
            </div>
          )
        }
      />
    );
  }
);
MarkdownEditor.displayName = 'MarkdownEditor';
