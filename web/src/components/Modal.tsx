import React, { useCallback, useContext, useState } from 'react';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import _last from 'lodash/last';
import _pull from 'lodash/pull';
import _isString from 'lodash/isString';
import _noop from 'lodash/noop';
import { PortalAdd, PortalRemove } from './Portal';
import { Typography } from 'antd';
import { Icon } from '@iconify/react';
import { CSSTransition } from 'react-transition-group';
// import { animated, useSpring } from 'react-spring';
// import { easeQuadInOut } from 'd3-ease';
// import { Iconfont } from './Iconfont';

import './Modal.less';

const transitionEndListener = (node: HTMLElement, done: () => void) =>
  node.addEventListener('transitionend', done, false);

/**
 * 模态框
 */

const ModalContext = React.createContext<{
  closeModal: () => void;
}>({
  closeModal: _noop,
});

interface ModalProps {
  visible?: boolean;
  onChangeVisible?: (visible: boolean) => void;

  /**
   * 是否显示右上角的关闭按钮
   * @default false
   */
  closable?: boolean;

  /**
   * 遮罩层是否可关闭
   */
  maskClosable?: boolean;
}
export const Modal: React.FC<ModalProps> = React.memo((props) => {
  const {
    visible,
    onChangeVisible,
    closable = false,
    maskClosable = true,
  } = props;
  const [showing, setShowing] = useState(true);

  const handleClose = useCallback(() => {
    if (maskClosable === false) {
      return;
    }

    setShowing(false);
  }, [maskClosable]);

  const stopPropagation = useCallback((e: React.BaseSyntheticEvent) => {
    e.stopPropagation();
  }, []);

  if (visible === false) {
    return null;
  }

  return (
    <CSSTransition
      in={showing}
      classNames="modal-anim"
      timeout={200}
      addEndListener={transitionEndListener}
      onExited={() => {
        if (showing === false && _isFunction(onChangeVisible)) {
          onChangeVisible(false);
        }
      }}
      appear={true}
    >
      <div
        className="absolute left-0 right-0 top-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center"
        onClick={handleClose}
      >
        <ModalContext.Provider value={{ closeModal: handleClose }}>
          {/* Inner */}
          <div
            className="modal-inner bg-gray-800 rounded overflow-auto relative"
            style={{ maxHeight: '80vh', maxWidth: '80vw' }}
            onClick={stopPropagation}
          >
            {closable === true && (
              <Icon
                className="absolute right-2.5 top-3.5 text-xl z-10"
                icon="mdi-close"
                onClick={handleClose}
              />
            )}
            {props.children}
          </div>
        </ModalContext.Provider>
      </div>
    </CSSTransition>
  );
});
Modal.displayName = 'Modal';

const modelKeyStack: number[] = [];

/**
 * 关闭Modal
 */
export function closeModal(key?: number): void {
  if (_isNil(key)) {
    key = _last(modelKeyStack);
  }

  if (typeof key === 'number') {
    _pull(modelKeyStack, key);

    PortalRemove(key);
  }
}

/**
 * 打开新的Modal
 */
export function openModal(
  content: React.ReactNode,
  props?: Pick<ModalProps, 'closable'>
): number {
  const key = PortalAdd(
    <Modal
      {...props}
      visible={true}
      onChangeVisible={(visible) => {
        if (visible === false) {
          closeModal(key);
        }
      }}
    >
      {content}
    </Modal>
  );

  modelKeyStack.push(key);

  return key;
}

/**
 * 获取modal上下文
 */
export function useModalContext() {
  const { closeModal } = useContext(ModalContext);

  return { closeModal };
}

/**
 * 标准模态框包装器
 */
// const ModalWrapperContainer = styled.div`
//   padding: 16px;
//   min-width: 300px;
//   ${(props) => props.theme.mixins.desktop('min-width: 420px;')}
// `;
export const ModalWrapper: React.FC<{
  title?: string;
}> = React.memo((props) => {
  const title = _isString(props.title) ? (
    <Typography.Title
      level={4}
      style={{ textAlign: 'center', marginBottom: 16 }}
    >
      {props.title}
    </Typography.Title>
  ) : null;

  return (
    <div className="p-4" style={{ minWidth: 300 }}>
      {title}
      {props.children}
    </div>
  );
});
ModalWrapper.displayName = 'ModalWrapper';
