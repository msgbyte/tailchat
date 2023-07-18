import { regMessageExtraParser } from '@capital/common';
import React from 'react';
import { getServiceUrl } from '@capital/common';

const PLUGIN_ID = 'cn.ssdcc.tailchat.video';
const PLUGIN_NAME = '视频文件播放器';

console.log(`Plugin ${PLUGIN_NAME}(${PLUGIN_ID}) is loaded`);
regMessageExtraParser({
  name: 'com.msgbyte.linkmeta/urlParser',
  render({ content }) {
    let url = '';
    let mp4 = content.match(/\[card type=file url=.*?\.mp4\]/g);
    if (mp4) {
      mp4 = mp4 + '';
      url = mp4.replace('.mp4]', '.mp4');
    }
    let webm = content.match(/\[card type=file url=.*?\.webm\]/g);
    if (webm) {
      webm = webm + '';
      url = webm.replace('.webm]', '.webm');
    }
    let ogg = content.match(/\[card type=file url=.*?\.ogg\]/g);
    if (ogg) {
      ogg = ogg + '';
      url = ogg.replace('.ogg]', '.ogg');
    }
    if (url !== null && url !== '') {
      url = url.replace('[card type=file url=', '');
      url = String(url).replace('{BACKEND}', getServiceUrl());
      return (
        <div className="max-w-full rounded-md p-2 bg-black bg-opacity-5 dark:bg-black dark:bg-opacity-10 inline-flex overflow-hidden">
          <video
            src={url}
            controls
            autoPlay={false}
            style={{ maxHeight: 300, maxWidth: 300 }}
          ></video>
        </div>
      );
    }
    return;
  },
});
