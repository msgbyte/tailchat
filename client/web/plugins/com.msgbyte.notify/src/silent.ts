/**
 * 免打扰
 */

const KEY = 'plugin:com.msgbyte.notify/slientStorage';

const silentSet = new Set<string>(loadFromLocalstorage());

export function appendSilent(converseId: string) {
  silentSet.add(converseId);
  saveToLocalstorage();
}

export function removeSilent(converseId: string) {
  silentSet.delete(converseId);
  saveToLocalstorage();
}

export function hasSilent(converseId: string): boolean {
  return silentSet.has(converseId);
}

function saveToLocalstorage() {
  localStorage.setItem(KEY, JSON.stringify(Array.from(silentSet)));
}

function loadFromLocalstorage(): string[] {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(arr)) {
      return arr;
    } else {
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
}
