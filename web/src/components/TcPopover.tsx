import React, { useCallback, useState, useMemo, useContext } from 'react';
import { Popover } from 'antd';
import type { PopoverProps } from 'antd/lib/popover';
import _noop from 'lodash/noop';

const TcPopoverContext = React.createContext({ closePopover: _noop });

/**
 * 重新封装一层Popover
 * 管理Popover的显示与隐藏
 * 可以由Context来让子节点关闭popover
 */
export const TcPopover: React.FC<PopoverProps> = React.memo((props) => {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = useCallback(
    (v) => {
      setVisible(v);

      typeof props.onVisibleChange === 'function' && props.onVisibleChange(v);
    },
    [props.onVisibleChange]
  );

  const closePopover = useCallback(() => {
    setVisible(false);
  }, []);

  const handler = useMemo(() => ({ closePopover }), [closePopover]);

  return (
    <TcPopoverContext.Provider value={handler}>
      <Popover
        {...props}
        visible={visible}
        onVisibleChange={handleVisibleChange}
      />
    </TcPopoverContext.Provider>
  );
});
TcPopover.displayName = 'TcPopover';

export function useTcPopoverContext() {
  const context = useContext(TcPopoverContext);

  return {
    closePopover: context?.closePopover ?? _noop,
  };
}
