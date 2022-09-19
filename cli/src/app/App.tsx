import React, { useLayoutEffect, useState } from 'react';
import { Box, Text, useStdout } from 'ink';
import { Tabs, Tab } from 'ink-tab';
import TextInput from 'ink-text-input';
import { useScreenSize } from './hooks/useScreenSize';

export const App: React.FC = React.memo(() => {
  const [text, setText] = useState('');
  const { height, width } = useScreenSize();
  const { stdout } = useStdout();

  useLayoutEffect(() => {
    stdout?.write('\x1b[?1049h');

    return () => {
      stdout?.write('\x1b[?1049l');
    };
  }, [stdout]);

  return (
    <Box
      height={height}
      width={width}
      borderStyle="round"
      borderColor="green"
      flexDirection="column"
    >
      <Box>
        <TextInput value={text} onChange={setText} />
      </Box>

      <Box>
        <Tabs flexDirection="column" onChange={() => {}}>
          {/* 因为react版本问题暂时注释 */}
          {/* <Tab name="tab1">
            <Text>Foo</Text>
          </Tab>
          <Tab name="tab2">
            <Text>Bar</Text>
          </Tab> */}
        </Tabs>
      </Box>
    </Box>
  );
});
App.displayName = 'App';
