import got from 'got';
import _ from 'lodash';

/**
 * 获取特定页面的信息
 */

//  <iframe src="//player.bilibili.com/player.html?aid=938355060&bvid=BV1bT4y1a7RH&cid=577883291&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

const specialWebsiteMetaFetchers = [
  {
    // bilibili
    match: (url: string) => url.startsWith('https://www.bilibili.com/video/BV'),
    overwrite: async (url: string) => {
      // from https://github.com/simon300000/bili-api/blob/master/src/api/api.bilibili.com.js
      const bvid = _.last(url.split('?')[0].split('/').filter(Boolean));

      const { data } = await got(
        `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`
      ).json<any>();

      const aid = _.get(data, 'aid');
      const cid = _.get(data, 'cid');
      if (aid && bvid && cid) {
        return {
          videos: [
            `https://player.bilibili.com/player.html?aid=${aid}&bvid=${bvid}&cid=${cid}&page=1&autoplay=0`,
          ],
        };
      }
    },
  },
];

/**
 * 获取更多的信息
 * @param url 请求数据的地址
 */
export async function fetchSpecialWebsiteMeta(url: string) {
  const matched = specialWebsiteMetaFetchers.find((f) => f.match(url));

  if (matched) {
    const overwrite = await matched.overwrite(url);

    return overwrite ?? {};
  }

  return {};
}
