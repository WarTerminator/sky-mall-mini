// pages/blind-box/blind-box.ts

import blindBoxService from "../../api/blind-box";
import { tryJsonParse } from "../../utils/index";

interface BlindBoxFeeds {
  activeSort: string;
  sort: any[];
  blindBoxList: any[];
  refresherTriggered: boolean;
}

const sort = [
  { name: '默认', key: 'default' },
  { name: '销量', key: 'sales' },
  { name: '新品', key: 'new' },
];

Page<BlindBoxFeeds, Record<string, any>>({
  data: {
    activeSort: 'default',
    sort,
    blindBoxList: [],
    refresherTriggered: false,
  },
  onLoad() {
    blindBoxService.getBlindBoxFeeds({
      current: 1,
      size: 10,
    }).then(res => {
      const records = (res?.records || []).map((item: any) => {
        return {
          ...item,
          ipInfo: tryJsonParse(item.remark),
        }
      });

      console.log('##', records);

      this.setData({
        blindBoxList: records,
      });
    });
  },
  onRefresherRefresh() {
    this.setData({
      refresherTriggered: true,
    });

    setTimeout(() => {
      this.setData({
        refresherTriggered: false,
      });
    }, 1000);
  },
  handleSwitchSort(event: WechatMiniprogram.BaseEvent) {
    const activeSort = event?.currentTarget?.dataset?.key;
    this.setData({
      activeSort,
    });
  },
  handleJumpToDetail(event: WechatMiniprogram.BaseEvent) {
    const item = event?.currentTarget?.dataset?.item;

    wx.navigateTo({
      url: `../blind-box/index?gameItemId=${item.gameItemId}`,
    })
  },
})