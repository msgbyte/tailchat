import React, { useContext } from 'react';
import { useStorage } from 'tailchat-shared';

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

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {props.children}
    </ColorSchemeContext.Provider>
  );
});
ColorSchemeContextProvider.displayName = 'ColorSchemeContextProvider';

export function useColorScheme() {
  return useContext(ColorSchemeContext);
}
