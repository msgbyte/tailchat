import React, { PropsWithChildren } from 'react';
import styles from './index.module.less';

export const Highlight: React.FC<PropsWithChildren> = React.memo((props) => {
  return <span className={styles.highLight}>{props.children}</span>;
});
Highlight.displayName = 'Highlight';
