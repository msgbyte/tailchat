import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

function isBrowserSafari() {
  const userAgent = window.navigator.userAgent;
  return (
    userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1
  );
}

const isSafari = isBrowserSafari();

const scrollBarWidth = 8;
const scrollableContainerStyles: React.CSSProperties = {
  display: 'inline',
  width: '0px',
  height: '0px',
  zIndex: -1,
  overflow: 'hidden',
  margin: '0px',
  padding: '0px',
};

const scrollableWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  flex: '0 0 auto',
  overflow: 'hidden',
  visibility: 'hidden',
  zIndex: -1,
  width: '100%',
  height: '100%',
  left: '0px',
  top: '0px',
};

const expandShrinkContainerStyles: React.CSSProperties = {
  flex: '0 0 auto',
  overflow: 'hidden',
  zIndex: -1,
  visibility: 'hidden',
  left: `-${scrollBarWidth + 1}px`, //8px(scrollbar width) + 1px
  bottom: `-${scrollBarWidth}px`, //8px because of scrollbar width
  right: `-${scrollBarWidth}px`, //8px because of scrollbar width
  top: `-${scrollBarWidth + 1}px`, //8px(scrollbar width) + 1px
};

const expandShrinkStyles: React.CSSProperties = {
  position: 'absolute',
  flex: '0 0 auto',
  visibility: 'hidden',
  overflow: 'scroll',
  zIndex: -1,
  width: '100%',
  height: '100%',
};

const shrinkChildStyle: React.CSSProperties = {
  position: 'absolute',
  height: '200%',
  width: '200%',
};

//values below need to be changed when scrollbar width changes
//TODO: change these to be dynamic

const shrinkScrollDelta = 2 * scrollBarWidth + 1; // 17 = 2* scrollbar width(8px) + 1px as buffer

// 27 = 2* scrollbar width(8px) + 1px as buffer + 10px(this value is based of off lib(Link below). Probably not needed but doesnt hurt to leave)
//https://github.com/wnr/element-resize-detector/blob/27983e59dce9d8f1296d8f555dc2340840fb0804/src/detection-strategy/scroll.js#L246
const expandScrollDelta = shrinkScrollDelta + 10;

interface ItemMeasurerProps {
  size: number;
  handleNewMeasurements: (
    key: string,
    newSize: number,
    forceScrollCorrection: boolean
  ) => void;
  itemId: string;
  item: React.ReactElement;
  width: number;
  onUnmount: (itemId: string, index: number) => void;
  index: number;
}

export class ItemMeasurer extends Component<ItemMeasurerProps> {
  _node: Element | Text | null = null;
  _resizeSensorExpand = React.createRef<any>();
  _resizeSensorShrink = React.createRef<any>();
  _positionScrollbarsRef: number | null = null;
  _measureItemAnimFrame: number | null = null;

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    this._node = findDOMNode(this);
    // Force sync measure for the initial mount.
    // This is necessary to support the DynamicSizeList layout logic.
    if (isSafari && this.props.size) {
      this._measureItemAnimFrame = window.requestAnimationFrame(() => {
        this._measureItem(false);
      });
    } else {
      this._measureItem(false);
    }

    if (this.props.size) {
      // Don't wait for positioning scrollbars when we have size
      // This is needed triggering an event for remounting a post
      this.positionScrollBars();
    }
  }

  componentDidUpdate(prevProps: ItemMeasurerProps) {
    if (
      (prevProps.size === 0 && this.props.size !== 0) ||
      prevProps.size !== this.props.size
    ) {
      this.positionScrollBars();
    }
  }

  positionScrollBars = (height = this.props.size, width = this.props.width) => {
    //we are position these hiiden div scroll bars to the end so they can emit
    //scroll event when height in the div changes
    //Heavily inspired from https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
    //and https://github.com/wnr/element-resize-detector/blob/master/src/detection-strategy/scroll.js
    //For more info http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/#comment-244
    if (this._positionScrollbarsRef) {
      window.cancelAnimationFrame(this._positionScrollbarsRef);
    }
    this._positionScrollbarsRef = window.requestAnimationFrame(() => {
      this._resizeSensorExpand.current.scrollTop = height + expandScrollDelta;
      this._resizeSensorShrink.current.scrollTop =
        2 * height + shrinkScrollDelta;
    });
  };

  componentWillUnmount() {
    if (this._positionScrollbarsRef) {
      window.cancelAnimationFrame(this._positionScrollbarsRef);
    }

    if (this._measureItemAnimFrame) {
      window.cancelAnimationFrame(this._measureItemAnimFrame);
    }

    const { onUnmount, itemId, index } = this.props;
    typeof onUnmount === 'function' && onUnmount(itemId, index);
  }

  scrollingDiv = (event: any) => {
    if (event.target.offsetHeight !== this.props.size) {
      this._measureItem(event.target.offsetWidth !== this.props.width);
    }
  };

  renderItems = () => {
    const item = this.props.item;

    const expandChildStyle: React.CSSProperties = {
      position: 'absolute',
      left: '0',
      top: '0',
      height: `${this.props.size + expandScrollDelta}px`,
      width: '100%',
    };

    const renderItem = (
      <div className="relative">
        {item}
        <div style={scrollableContainerStyles}>
          <div dir="ltr" style={scrollableWrapperStyle}>
            <div style={expandShrinkContainerStyles}>
              <div
                style={expandShrinkStyles}
                ref={this._resizeSensorExpand}
                onScroll={this.scrollingDiv}
              >
                <div style={expandChildStyle} />
              </div>
              <div
                style={expandShrinkStyles}
                ref={this._resizeSensorShrink}
                onScroll={this.scrollingDiv}
              >
                <div style={shrinkChildStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return renderItem;
  };

  render() {
    return this.renderItems();
  }

  _measureItem = (forceScrollCorrection: boolean) => {
    const { handleNewMeasurements, size: oldSize, itemId } = this.props;

    const node = this._node;

    if (
      node &&
      node.ownerDocument &&
      node.ownerDocument.defaultView &&
      node instanceof node.ownerDocument.defaultView.HTMLElement
    ) {
      const newSize = Math.ceil(node.offsetHeight);

      if (oldSize !== newSize) {
        handleNewMeasurements(itemId, newSize, forceScrollCorrection);
      }
    }
  };
}
