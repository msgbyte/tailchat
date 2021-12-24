import React, { useContext, useEffect } from 'react';
import { parseColorScheme } from '../utils/color-scheme-helper';
import { sharedEvent } from '../event';
import { useStorage } from '../manager/storage';

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
  const [colorScheme = 'dark', { save: setColorScheme }] = useStorage(
    'colorScheme',
    'dark'
  );

  useEffect(() => {
    sharedEvent.emit('loadColorScheme', colorScheme);
  }, [colorScheme]);

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
