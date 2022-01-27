import type { AppGachaItem } from 'genshin-gacha-kit';
import { wishVideoUrl } from './consts';

export function getAppGachaItemText(item: AppGachaItem) {
  if (item.count >= 2) {
    return `${item.name}(${item.count})`;
  } else {
    return item.name;
  }
}

export function parseResultType(
  items: AppGachaItem[]
): keyof typeof wishVideoUrl {
  if (items.length === 1) {
    // single
    const rarity = items[0].rarity;
    if (rarity === 3) {
      return '3star-single';
    } else if (rarity === 4) {
      return '4star-single';
    } else if (rarity === 5) {
      return '5star-single';
    }
  } else {
    if (items.some((i) => i.rarity === 5)) {
      return '5star';
    } else if (items.some((i) => i.rarity === 4)) {
      return '4star';
    }
  }

  return '3star-single';
}
