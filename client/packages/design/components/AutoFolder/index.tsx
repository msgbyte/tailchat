import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface AutoFolderProps extends PropsWithChildren {
  maxHeight: number;
  showFullText?: React.ReactNode;
  backgroundColor?: string;
}
export const AutoFolder: React.FC<AutoFolderProps> = React.memo((props) => {
  const { maxHeight, showFullText = 'More', backgroundColor = 'white' } = props;
  const [isShowFull, setIsShowFull] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const observer = useMemo(
    () =>
      new window.ResizeObserver((entries) => {
        if (entries[0]) {
          const { height } = entries[0].contentRect;
          if (height > maxHeight) {
            setIsShowFull(false);

            observer.disconnect(); // 触发一次则解除连接
          } else {
            setIsShowFull(true);
          }
        }
      }),
    []
  );

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }
    observer.observe(contentRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        maxHeight: isShowFull ? 'none' : maxHeight,
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
            backgroundImage: `linear-gradient(rgba(0,0,0,0), ${backgroundColor})`,
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
