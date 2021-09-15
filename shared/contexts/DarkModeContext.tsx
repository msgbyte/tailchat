import React, { useContext } from 'react';
import { useStorage } from 'tailchat-shared';

const DarkModeContext = React.createContext<{
  darkMode: boolean;
  setDarkMode: (isDarkMode: boolean) => void;
}>({
  darkMode: true,
  setDarkMode: () => {},
});
DarkModeContext.displayName = 'DarkModeContext';

export const DarkModeContextProvider: React.FC = React.memo((props) => {
  const [darkMode = true, { save: setDarkMode }] = useStorage('darkMode', true);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {props.children}
    </DarkModeContext.Provider>
  );
});
DarkModeContextProvider.displayName = 'DarkModeContextProvider';

export function useDarkMode() {
  return useContext(DarkModeContext);
}
