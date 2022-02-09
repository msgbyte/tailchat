import clsx from 'clsx';
import React from 'react';
import Split from 'react-split';
import { useStorage } from 'tailchat-shared';
import './SplitPanel.less';

/**
 * Reference: https://split.js.org/#/
 */

interface SplitPanelProps {
  className?: string;
}
export const SplitPanel: React.FC<SplitPanelProps> = React.memo((props) => {
  const [sizes, { save: saveSizes }] = useStorage('pin-sizes', [90, 10]);

  const handleDragEnd = (sizes: number[]) => {
    saveSizes(sizes);
  };

  return (
    <Split
      className={clsx('split', props.className)}
      sizes={sizes}
      minSize={250}
      expandToMin={true}
      onDragEnd={handleDragEnd}
    >
      {props.children}
    </Split>
  );
});
SplitPanel.displayName = 'SplitPanel';
