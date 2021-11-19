import type { Data } from 'emoji-mart';
import data from 'emoji-mart/data/twitter.json';

export const emojiData: Data = {
  compressed: true,
  categories: [
    {
      id: 'people',
      name: 'Smileys & People',
      emojis: data.categories[0].emojis,
    },
    {
      id: 'nature',
      name: 'Animals & Nature',
      emojis: data.categories[1].emojis,
    },
    // {
    //   id: 'foods',
    //   name: 'Food & Drink',
    //   emojis: data.categories[2].emojis,
    // },
    // {
    //   id: 'activity',
    //   name: 'Activities',
    //   emojis: data.categories[3].emojis,
    // },
    // {
    //   id: 'places',
    //   name: 'Travel & Places',
    //   emojis: data.categories[4].emojis,
    // },
    // {
    //   id: 'objects',
    //   name: 'Objects',
    //   emojis: data.categories[5].emojis,
    // },
    // {
    //   id: 'symbols',
    //   name: 'Symbols',
    //   emojis: data.categories[6].emojis,
    // },
    // {
    //   id: 'flags',
    //   name: 'Flags',
    //   emojis: data.categories[7].emojis,
    // },
  ],
  emojis: data.emojis,
  aliases: data.aliases,
};
