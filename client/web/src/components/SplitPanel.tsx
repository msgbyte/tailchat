import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import Split from 'react-split';
import { useStorage, updateDragStatus} from 'tailchat-shared';
import './SplitPanel.less';


/**
 * Reference: https://split.js.org/#/
 */

interface SplitPanelProps extends PropsWithChildren {
  className?: string;
}
export const SplitPanel: React.FC<SplitPanelProps> = React.memo((props) => {
  const [sizes, { save: saveSizes }] = useStorage('pin-sizes', [90, 10]);
  const updateStatus = updateDragStatus()
  const handleDragEnd = (sizes: number[]) => {
    saveSizes(sizes);
    updateStatus(false)
  
  };

  const handleDragEnter = ()=>{
    updateStatus(true)
  }

  return (
    <Split
      className={clsx('split', props.className)}
      sizes={sizes}
      minSize={250}
      expandToMin={true}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragEnter}
    >
      {props.children}
    </Split>
  );
});
SplitPanel.displayName = 'SplitPanel';
