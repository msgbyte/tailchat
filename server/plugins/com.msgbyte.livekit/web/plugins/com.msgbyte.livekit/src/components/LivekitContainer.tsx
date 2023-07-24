import styled from 'styled-components';
import '@livekit/components-styles';

export const LivekitContainer = styled.div.attrs({
  'data-lk-theme': 'default',
})`
  height: 100%;
  background-color: var(--lk-bg);

  .lk-message-body {
    user-select: text;
  }
`;
