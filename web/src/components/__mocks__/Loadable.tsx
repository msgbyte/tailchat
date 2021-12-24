import React from 'react';

// Reference: https://medium.com/pixel-and-ink/testing-loadable-components-with-jest-97bfeaa6da0b

// Loadable components is tied to webpack, seems most people use webpack in their tests.
// Rather than that, we mock the loadable function to load the module eagarly and expose a load() function to be able to await the load
export function Loadable(load: any) {
  let Component: any;
  // Capture the component from the module load function
  const loadPromise = load().then((val: any) => (Component = val.default));
  // Create a react component which renders the loaded component
  const Loadable = (props: any) => {
    if (!Component) {
      throw new Error(
        'Bundle split module not loaded yet, ensure you beforeAll(() => MyLazyComponent.load()) in your test, import statement: ' +
          load.toString()
      );
    }
    return <Component {...props} />;
  };
  Loadable.load = () => loadPromise;
  return Loadable;
}
