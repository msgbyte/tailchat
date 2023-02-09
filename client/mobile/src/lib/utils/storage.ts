import type { PersistStorage } from 'zustand/middleware/persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const zustandRNStorage: PersistStorage<any> = {
  async getItem(name) {
    const d = await AsyncStorage.getItem(name);
    if (!d) {
      return null;
    }

    return JSON.parse(d);
  },
  setItem(name, value) {
    return AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    AsyncStorage.removeItem(name);
  },
};
