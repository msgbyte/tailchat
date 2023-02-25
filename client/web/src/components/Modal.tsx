import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import _last from 'lodash/last';
import _pull from 'lodash/pull';
import _isString from 'lodash/isString';
import _noop from 'lodash/noop';
import { PortalAdd, PortalRemove } from './Portal';
import { Button, Typography } from 'antd';
import { Icon } from 'tailchat-design';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { useIsMobile } from '@/hooks/useIsMobile';
import { stopPropagation } from '@/utils/dom-helper';
import { ErrorBoundary } from './ErrorBoundary';
import { t } from 'tailchat-shared';

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

interface ModalProps extends PropsWithChildren {
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

  const closeModal = useCallback(() => {
    setShowing(false);
  }, []);

  const handleClose = useCallback(() => {
    if (maskClosable === false) {
      return;
    }

    closeModal();
  }, [maskClosable, closeModal]);

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
        className="absolute left-0 right-0 top-0 bottom-0 bg-black bg-opacity-60 flex justify-center items-center z-10"
        onClick={handleClose}
        data-tc-role="modal-mask"
      >
        <ModalContext.Provider value={{ closeModal }}>
          {/* Inner */}
          <div
            className="modal-inner bg-content-light dark:bg-content-dark rounded overflow-auto relative z-10"
            style={{ maxHeight: '80vh', maxWidth: '80vw' }}
            onClick={stopPropagation}
            data-tc-role="modal"
          >
            {closable === true && (
              <Icon
                className="absolute right-2.5 top-3.5 text-xl z-10 cursor-pointer"
                icon="mdi:close"
                onClick={closeModal}
              />
            )}

            <ErrorBoundary>{props.children}</ErrorBoundary>
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
  props?: Pick<ModalProps, 'closable' | 'maskClosable'> & {
    onCloseModal?: () => void | Promise<void>;
  }
): number {
  const key = PortalAdd(
    <Modal
      {...props}
      visible={true}
      onChangeVisible={async (visible) => {
        if (visible === false) {
          if (typeof props?.onCloseModal === 'function') {
            await props.onCloseModal();
          }

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

interface OpenConfirmModalProps {
  onConfirm: () => void;
  onCancel?: () => void;
  title?: string;
  content?: string;
}
export function openConfirmModal(props: OpenConfirmModalProps) {
  const key = openModal(
    <ModalWrapper title={props.title ?? t('确认操作')}>
      <h3 className="text-center pb-6">{props.content}</h3>
      <div className="space-x-2 text-right">
        <Button
          onClick={() => {
            props.onCancel?.();
            closeModal(key);
          }}
        >
          {t('取消')}
        </Button>
        <Button
          type="primary"
          onClick={() => {
            props.onConfirm();
            closeModal(key);
          }}
        >
          {t('确认')}
        </Button>
      </div>
    </ModalWrapper>,
    {
      onCloseModal: props.onCancel,
    }
  );
}

type OpenReconfirmModalProps = Pick<
  OpenConfirmModalProps,
  'title' | 'content' | 'onConfirm' | 'onCancel'
>;
/**
 * 打开再次确认操作modal
 */
export function openReconfirmModal(props: OpenReconfirmModalProps) {
  openConfirmModal({
    onConfirm: props.onConfirm,
    onCancel: props.onCancel,
    title: props.title ?? t('确认要进行该操作么?'),
    content: props.content ?? t('该操作无法被撤回'),
  });
}
/**
 * 打开再次确认操作modal(Promise版本)
 * @example
 * if(await openReconfirmModalP()) {
 *   // do somthing
 * }
 */
export function openReconfirmModalP(
  props?: Omit<OpenReconfirmModalProps, 'onConfirm' | 'onCancel'>
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    openReconfirmModal({
      ...props,
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
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
export const ModalWrapper: React.FC<
  PropsWithChildren<{
    title?: string;
    className?: string;
    style?: React.CSSProperties;
  }>
> = React.memo((props) => {
  const isMobile = useIsMobile();

  const title = _isString(props.title) ? (
    <Typography.Title level={4} className="text-center mb-4">
      {props.title}
    </Typography.Title>
  ) : null;

  return (
    <div
      className={clsx('p-4', props.className)}
      style={{ minWidth: isMobile ? 290 : 420, ...props.style }}
    >
      {title}
      {props.children}
    </div>
  );
});
ModalWrapper.displayName = 'ModalWrapper';
