import React, { useEffect, useMemo, useRef } from 'react';
import { ResizeWatcher } from './ResizeWatcher';
import { Scroller, ScrollerRef } from './Scroller';
import { useUpdate } from 'ahooks';

interface VirtualChatListProps<ItemType> {
  className?: string;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  getItemKey?: (item: ItemType) => string;
  items: ItemType[];
  itemContent: (item: ItemType, index: number) => React.ReactNode;
}

const defaultContainerStyle: React.CSSProperties = {
  overflow: 'hidden',
};

const defaultInnerStyle: React.CSSProperties = {
  height: '100%',
};

const scrollerStyle: React.CSSProperties = {
  height: '100%',
};

const InternalVirtualChatList = <ItemType extends object>(
  props: VirtualChatListProps<ItemType>
) => {
  const scrollerRef = useRef<ScrollerRef>(null);
  const itemHeightCache = useMemo(() => new Map<ItemType, number>(), []);
  const forceUpdate = useUpdate();
  const style = useMemo(
    () => ({
      ...defaultContainerStyle,
      ...props.style,
    }),
    [props.style]
  );
  const innerStyle = useMemo(
    () => ({
      ...defaultInnerStyle,
      ...props.innerStyle,
    }),
    [props.innerStyle]
  );

  useEffect(() => {
    // 挂载后滚动到底部
    scrollerRef.current?.scrollToBottom();
  }, []);

  return (
    <div className="virtual-chat-list" style={style}>
      <Scroller ref={scrollerRef} style={scrollerStyle} innerStyle={innerStyle}>
        {props.items.map((item, i) => (
          <div
            key={props.getItemKey ? props.getItemKey(item) : i}
            className="virtual-chat-list__item"
            style={{ height: itemHeightCache.get(item) }}
          >
            <ResizeWatcher
              onResize={(size) => {
                itemHeightCache.set(item, size.height);
                forceUpdate();
              }}
            >
              {props.itemContent(item, i)}
            </ResizeWatcher>
          </div>
        ))}
      </Scroller>
    </div>
  );
};

type VirtualChatListInterface = typeof InternalVirtualChatList & React.FC;

export const VirtualChatList: VirtualChatListInterface = React.memo(
  InternalVirtualChatList
) as any;
VirtualChatList.displayName = 'VirtualChatList';
