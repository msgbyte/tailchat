import type { AppGachaItem } from 'genshin-gacha-kit';

export function getAppGachaItemText(item: AppGachaItem) {
  if (item.count >= 2) {
    return `${item.name}(${item.count})`;
  } else {
    return item.name;
  }
}
