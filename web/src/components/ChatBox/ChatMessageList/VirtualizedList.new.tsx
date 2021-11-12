import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ChatMessage, t, usePrevious, useUpdateRef } from 'tailchat-shared';
import { messageReverseItemId } from './const';
import { buildMessageItemRow } from './Item';
import type { MessageListProps } from './types';
import {
  List,
  CellMeasurer,
  CellMeasurerCache,
  ListRowRenderer,
  InfiniteLoader,
} from 'react-virtualized';

// const OVERSCAN_COUNT_BACKWARD = 80;
// const OVERSCAN_COUNT_FORWARD = 80;
// const HEIGHT_TRIGGER_FOR_MORE_POSTS = 200; // 触发加载更多的方法

// const postListStyle = {
//   padding: '14px 0px 7px',
// };

// const virtListStyles: React.CSSProperties = {
//   position: 'absolute',
//   bottom: 0,
//   maxHeight: '100%',
// };

// const dynamicListStyle: React.CSSProperties = {}; // TODO

export const VirtualizedMessageList: React.FC<MessageListProps> = React.memo(
  (props) => {
    const listRef = useRef<List>(null);
    // const postListRef = useRef<HTMLDivElement>(null);
    // const [isBottom, setIsBottom] = useState(true);
    // useLockScroll(props.messages, listRef);

    useEffect(() => {
      listRef.current?.scrollToRow(props.messages.length - 1);
    }, [props.messages]);

    // const handleScroll = (info: OnScrollInfo) => {
    //   const {
    //     clientHeight,
    //     scrollOffset,
    //     scrollHeight,
    //     scrollDirection,
    //     scrollUpdateWasRequested,
    //   } = info;
    //   if (scrollHeight <= 0) {
    //     return;
    //   }

    //   const didUserScrollBackwards =
    //     scrollDirection === 'backward' && !scrollUpdateWasRequested;
    //   const isOffsetWithInRange = scrollOffset < HEIGHT_TRIGGER_FOR_MORE_POSTS;

    //   if (
    //     didUserScrollBackwards &&
    //     isOffsetWithInRange &&
    //     !props.isLoadingMore
    //   ) {
    //     // 加载更多历史信息
    //     props.onLoadMore();
    //   }

    //   if (clientHeight + scrollOffset === scrollHeight) {
    //     // 当前滚动条位于底部
    //     setIsBottom(true);
    //     props.onUpdateReadedMessage(
    //       props.messages[props.messages.length - 1]._id
    //     );
    //   }
    // };

    // const onUpdateReadedMessageRef = useUpdateRef(props.onUpdateReadedMessage);
    // useEffect(() => {
    //   if (props.messages.length === 0) {
    //     return;
    //   }

    //   if (postListRef.current?.scrollTop === 0) {
    //     // 当前列表在最低
    //     onUpdateReadedMessageRef.current(
    //       props.messages[props.messages.length - 1]._id
    //     );
    //   }
    // }, [props.messages.length]);

    /**
     * 渲染列表元素
     */
    const rowRenderer: ListRowRenderer = ({ index, key, parent, style }) => {
      // if (key === messageReverseItemId.OLDER_MESSAGES_LOADER) {
      //   return (
      //     <div key={key} className="text-center text-gray-400">
      //       {t('加载中...')}
      //     </div>
      //   );
      // } else if (key === messageReverseItemId.TEXT_CHANNEL_INTRO) {
      //   return (
      //     <div key={key} className="text-center text-gray-400">
      //       {t('到顶了')}
      //     </div>
      //   );
      // }

      return (
        <CellMeasurer
          cache={measurerCache}
          columnIndex={0}
          key={key}
          rowIndex={index}
          parent={parent}
        >
          {({ measure, registerChild }) => (
            <div
              ref={(el) => el && registerChild && registerChild(el)}
              onLoad={measure}
              style={style}
            >
              {buildMessageItemRow(props.messages, props.messages[index]._id)}
              {/* {buildMessageItemRow(props.messages, key)} */}
            </div>
          )}
        </CellMeasurer>
      );
    };
    // const itemData = useMemo(
    //   () => [
    //     ...props.messages.map((m) => m._id).reverse(),
    //     props.hasMoreMessage
    //       ? messageReverseItemId.OLDER_MESSAGES_LOADER
    //       : messageReverseItemId.TEXT_CHANNEL_INTRO,
    //   ],
    //   [props.messages, props.hasMoreMessage]
    // );

    const measurerCache = useMemo(
      () =>
        new CellMeasurerCache({
          fixedWidth: true,
          minHeight: 24,
        }),
      []
    );

    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            overscanRowCount={0}
            rowCount={props.messages.length}
            deferredMeasurementCache={measurerCache}
            rowHeight={measurerCache.rowHeight}
            rowRenderer={rowRenderer}
            onRowsRendered={({ startIndex }) => console.log(startIndex)}
            scrollToIndex={props.messages.length - 1}
            scrollToAlignment="end"
          />
        )}
      </AutoSizer>
    );
  }
);
VirtualizedMessageList.displayName = 'VirtualizedMessageList';
