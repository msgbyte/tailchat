import React from 'react';
export type State = {
  portals: {
    key: number;
    children: React.ReactNode;
  }[];
};
interface PortalManagerProps {
  renderManagerView: (children: React.ReactNode) => React.ReactElement;
}
export interface PortalManagerState {
  portals: any[];
}
/**
 * Portal host is the component which actually renders all Portals.
 */
export class PortalManager extends React.PureComponent<
  PortalManagerProps,
  PortalManagerState
> {
  state: State = {
    portals: [],
  };

  mount = (key: number, children: React.ReactNode) => {
    this.setState((state) => ({
      portals: [...state.portals, { key, children }],
    }));
  };

  update = (key: number, children: React.ReactNode) => {
    this.setState((state) => ({
      portals: state.portals.map((item) => {
        if (item.key === key) {
          return { ...item, children };
        }
        return item;
      }),
    }));
  };

  unmount = (key: number) => {
    this.setState((state) => ({
      portals: state.portals.filter((item) => item.key !== key),
    }));
  };

  render() {
    const { renderManagerView } = this.props;
    return this.state.portals.map(({ key, children }, i) => (
      <React.Fragment key={key}>{renderManagerView(children)}</React.Fragment>
      // <View
      //   key={key}
      //   collapsable={
      //     false /* Need collapsable=false here to clip the elevations, otherwise they appear above sibling components */
      //   }
      //   pointerEvents="box-none"
      //   style={[StyleSheet.absoluteFill, { zIndex: 1000 + i }]}
      // >
      //   {children}
      // </View>
    ));
  }
}
