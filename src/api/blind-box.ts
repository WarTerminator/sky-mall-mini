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
  executeTrialDraw (data: {
    assetId: string | number,
  }) {
    return request({
      host: Host.API,
      method: 'POST',
      url: '/p/luckyDrawInfo/user-lucky-draw-info/tryConsumeDrawCards',
      data,
    });
  },
  executeDraw (data: {
    userAssetId: string[],
    assetId: string | number,
  }) {
    return request({
      host: Host.API,
      method: 'POST',
      url: '/p/luckyDrawInfo/user-lucky-draw-info/consumeDrawCards',
      data: {
        assetType: 1,
        status: 0,
        ...data,
      },
    });
  },
  getUserAsset (data: {
    current?: number;
    size?: number;
    fillUpDetailInfo?: boolean;
    assetTypes?: number[];
    statusList?: number[];
    assetIds?: number[];
  }) {
    return request({
      host: Host.API,
      method: 'POST',
      url: `/p/userasset/query`,
      data: {
        ...data,
        page: data.current || 1,
        size: data.size || 20,
      },
    });
  },
  getUnboxRecord (data: {
    current?: number;
    size?: number;
    gameItemId: string | number,
    status: 0 | 1,
  }) {
    return request({
      host: Host.API,
      method: 'POST',
      url: '/p/luckyDrawInfo/user-lucky-draw-info/drawCardsLog',
      data: {
        ...data,
        current: data.current || 1,
        size: data.size || 10,
      },
    });
  },
  createDispatchOrder (data: {
    addrId: number;
    userAssetIds: number[];
    uuid: string;
  }) {
    return request({
      host: Host.API,
      method: 'POST',
      url: '/p/order/assetConfirm',
      data,
    });
  },
  getCardAlbum(guideId: number | string) {
    return request({
      host: Host.API,
      method: 'GET',
      url: `/p/illustrated_guide/getGuideInfo/${guideId}`,
    });
  },
};

export default blindBoxService;