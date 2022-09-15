import React, { useRef } from 'react';
import { Scroller, ScrollerRef } from './Scroller';

export const VirtualChatList: React.FC = React.memo(() => {
  const scrollerRef = useRef<ScrollerRef>(null);

  return (
    <Scroller ref={scrollerRef}>
      {/* TODO */}
      <div>Foo</div>
    </Scroller>
  );
});
VirtualChatList.displayName = 'VirtualChatList';
