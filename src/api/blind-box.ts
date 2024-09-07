import { Host } from '../constant/host';
import request from '../api/request';

const blindBoxService = {
  getBlindBoxFeeds (data: {
    current: number,
    size: number,
    price?: 0 | 1,
    soldNum?: 0 | 1,
    putawayTime?:  0 | 1,
  }) {
    return request({
      host: Host.API,
      method: 'POST',
      url: '/p/luckyDrawInfo/user-lucky-draw-info/drawCardsPage',
      data,
    });
  },
  getBlindBoxDetail (gameItemId: string) {
    return request({
      host: Host.API,
      method: 'POST',
      url: '/p/luckyDrawInfo/user-lucky-draw-info/drawCardsDetails',
      data: {
        gameItemId,
      },
    });
  },
  executeDraw (data: {
    count: number,
    gameItemId: string,
  }) {
    return request({
      host: Host.API,
      method: 'POST',
      url: '/p/luckyDrawInfo/user-lucky-draw-info/consumeDrawCards',
      data,
    });
  },
  getStorageLocker () {
    return request({
      host: Host.API,
      method: 'POST',
      url: `/p/userasset/query?size=${10}&current=${1}`,
      data: {
        fillUpDetailInfo: true,
      },
    });
  },
};

export default blindBoxService;