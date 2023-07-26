import { Icon } from '@capital/component';
import React from 'react';
import styled from 'styled-components';

const Root = styled.div.attrs({
  className: 'lk-button',
})`
  position: absolute;
  top: 0.25rem;
  right: 2.25rem;
  padding: 0.125rem;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: calc(var(--lk-border-radius) / 2);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  transition-delay: 0.2s;

  .lk-participant-tile:hover & {
    opacity: 1;
  }
`;

export const FullScreenBtn: React.FC<React.HTMLAttributes<HTMLDivElement>> =
  React.memo((props) => {
    return (
      <Root {...props}>
        <Icon icon="mdi:fullscreen" />
      </Root>
    );
  });
FullScreenBtn.displayName = 'FullScreenBtn';
