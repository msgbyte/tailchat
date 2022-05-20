import React, { useEffect, useRef, useState } from 'react';

interface AutoFolderProps {
  maxHeight: number;
  showFullText?: string;
  backgroundColor?: string;
}
export const AutoFolder: React.FC<AutoFolderProps> = React.memo((props) => {
  const {
    maxHeight,
    showFullText = 'More',
    backgroundColor = 'rgba(0,0,0,0)',
  } = props;
  const [isShowFull, setIsShowFull] = useState(false);
  const contentRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > maxHeight) {
        setIsShowFull(false);
      } else {
        setIsShowFull(true);
      }
    }
  }, [props.maxHeight]);

  return (
    <div
      style={{
        height: isShowFull ? 'auto' : maxHeight,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div ref={contentRef}>{props.children}</div>

      {!isShowFull && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundImage: `linear-gradient(${backgroundColor}, white)`,
            padding: '4px 0',
          }}
          onClick={() => setIsShowFull(true)}
        >
          {showFullText}
        </div>
      )}
    </div>
  );
});
AutoFolder.displayName = 'AutoFolder';
