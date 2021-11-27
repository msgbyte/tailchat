import React, { useCallback, useContext } from 'react';
import { useStorage } from 'tailchat-shared';
import { parseColorScheme } from '../../web/src/utils/color-scheme-helper';
import { sharedEvent } from '../event';

const ColorSchemeContext = React.createContext<{
  /**
   * 'dark' | 'light' | 'auto' | string
   */
  colorScheme: string;
  setColorScheme: (colorScheme: string) => void;
}>({
  colorScheme: 'dark',
  setColorScheme: () => {},
});
ColorSchemeContext.displayName = 'ColorSchemeContext';

export const ColorSchemeContextProvider: React.FC = React.memo((props) => {
  const [colorScheme = 'dark', { save: saveColorScheme }] = useStorage(
    'colorScheme',
    'dark'
  );

  const setColorScheme = useCallback(
    (colorScheme: string) => {
      sharedEvent.emit('changeColorScheme', colorScheme);
      saveColorScheme(colorScheme);
    },
    [saveColorScheme]
  );

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {props.children}
    </ColorSchemeContext.Provider>
  );
});
ColorSchemeContextProvider.displayName = 'ColorSchemeContextProvider';

export function useColorScheme() {
  const { colorScheme, setColorScheme } = useContext(ColorSchemeContext);
  const { isDarkMode, extraSchemeName } = parseColorScheme(colorScheme);

  return { colorScheme, setColorScheme, isDarkMode, extraSchemeName };
}
