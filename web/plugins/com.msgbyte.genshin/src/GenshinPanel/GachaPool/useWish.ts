import { showToasts } from '@capital/common';
import {
  AppWishResult,
  GenshinGachaKit,
  OfficialGachaPool,
  util,
} from 'genshin-gacha-kit';
import { useCallback, useMemo, useState } from 'react';
import { openFullScreenVideo } from '../../utils/openFullScreenVideo';
import { wishVideoUrl } from '../consts';
import { parseResultType } from '../utils';

/**
 * 祈愿
 * @param poolData 卡池信息
 */
export function useWish(poolData: OfficialGachaPool) {
  const [gachaResult, setGachaResult] = useState<AppWishResult>({
    ssr: [],
    sr: [],
    r: [],
  });
  const [gachaCount, setGachaCount] = useState<number>(0);

  const gachaKit = useMemo(() => {
    return poolData
      ? new GenshinGachaKit(util.poolStructureConverter(poolData))
      : null;
  }, [poolData]);
  const handleGacha = useCallback(
    (num) => {
      if (!gachaKit) {
        return;
      }

      const res = gachaKit.multiWish(num);

      openFullScreenVideo(wishVideoUrl[parseResultType(res)]).then(() => {
        showToasts('抽卡结果: ' + res.map((item) => item.name).join(','));

        setGachaCount(gachaKit.getCounter('total') as number);
        setGachaResult(JSON.parse(JSON.stringify(gachaKit.getResult())));
      });
    },
    [gachaKit]
  );

  return { handleGacha, gachaResult, gachaCount };
}
