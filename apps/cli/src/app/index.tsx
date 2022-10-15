import React from 'react';
import { App } from './App';
import { render } from 'ink';

export function run() {
  const ins = render(<App />);

  return ins;
}
