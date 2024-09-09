// pages/blind-box/blind-box.ts

import blindBoxService from "../../api/blind-box";
import { tryJsonParse } from "../../utils/index";
import WXToast from "../../utils/WXToast";

interface BlindBoxFeeds {
  loading: boolean;
  hasMore: boolean;
  activeSort: string;
  sort: any[];
  blindBoxList: any[];
  refresherTriggered: boolean;
  validAsset: any[];
}

const sort = [
  { name: '默认', key: 'default' },
  { name: '销量', key: 'sales', params: { soldNum: 1 } },
  { name: '新品', key: 'new', params: { putawayTime: 0 } },
];

Page<BlindBoxFeeds, Record<string, any>>({
  _current: 1,
  _loadingMore: false,
  _queryParams: undefined,
  data: {
    loading: true,
    hasMore: false,
    refresherTriggered: false,
    activeSort: 'default',
    sort,
    blindBoxList: [],
    validAsset: [],
  },
  onLoad() {
    this.getBlindBoxFeeds();
  },
  onShow() {
    this.checkAsset();
  },
  async getBlindBoxFeeds() {
    try {
      const res = await blindBoxService.getBlindBoxFeeds({
        current: this._current,
        size: 20,
        ...this._queryParams,
      });
  
      const { records = [] } = res || {};
      let blindBoxList = records.map((item: any) => {
        return {
          ...item,
          ipInfo: tryJsonParse(item.remark),
        }
      });
      
      if (this._current > 1) {
        blindBoxList = [...this.data.blindBoxList, ...blindBoxList];
      }
  
      this.setData({
        blindBoxList,
        loading: false,
        refresherTriggered: false,
        hasMore: res.current < res.pages,
      });
    } catch(e) {
      WXToast(e?.data || e?.errMsg);
      this.setData({
        loading: false,
        refresherTriggered: false,
      });
    }

    this._loadingMore = false;
  },
  async checkAsset() {
    const blindBoxAsset = await blindBoxService.getUserAsset({
      size: 100,
      assetTypes: [1],
      statusList: [0],
    });
    const records = blindBoxAsset?.records || [];
    const validAssetMap = records.reduce((acc: any, current: any) => {
      if (current.assetId) {
        if (!acc[current.assetId]) {
          acc[current.assetId] = [];
        }

        acc[current.assetId].push(current);
      }

      return acc;
    }, {});
    const validAsset = Object.values(validAssetMap);

    this.setData({
      validAsset,
    });
  },
  onRefresherRefresh() {
    this.setData({
      refresherTriggered: true,
    });

    this._current = 1;
    this.getBlindBoxFeeds();
  },
  handleLoadMore() {
    if (this.data.hasMore && !this._loadingMore) {
      this._loadingMore = true;
      this._current += 1;
      this.getBlindBoxFeeds();
    }
  },
  handleSwitchSort(event: WechatMiniprogram.BaseEvent) {
    const activeSort = event?.currentTarget?.dataset?.key;
    this.setData({
      activeSort,
    });
    const params = this.data.sort.find(item => item.key === activeSort)?.params;
    this._queryParams = params;
    this._current = 1;
    this.getBlindBoxFeeds();
  },
  handleJumpToDetail(event: WechatMiniprogram.BaseEvent) {
    const item = event?.currentTarget?.dataset?.item;

    wx.navigateTo({
      url: `../blind-box/index?gameItemId=${item.gameItemId}`,
    });
  },
  handleDealAsset() {
    const assetId = this.data.validAsset?.[0]?.[0]?.assetId;

    if (assetId) {
      wx.navigateTo({
        url: `../blind-box/index?gameItemId=${assetId}&dealAsset=true`,
      })
    }
  }
})