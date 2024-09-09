// pages/card-album/index.ts

import blindBoxService from "../../api/blind-box";

const tabs = [
  { label: '全部', key: 'all' },
  { label: '拥有', key: 'owned' },
  { label: '未拥有', key: 'unowned' },
];

Page({
  data: {
    tabs,
    activeTab: 'all',
  },
  onLoad(params) {
    console.log('##', params);
    this.getStorageLocker();
  },
  async getStorageLocker() {
    try {
      const res = await blindBoxService.getCardAlbum(17);
      const { children = '[]', img, name } = res || {};
      const _children = JSON.parse(children);
      const levelList: any[] = [];
      const cards = _children.reduce((acc: any[], current: any) => {
        const levelInfo = {
          levelKey: current.level_key,
          levelName: current.level_name,
        };

        if (current.items?.length) {
          levelList.push(levelInfo);
        }

        const levelCards = (current.items || []).map((item: any) => ({
          ...item,
          owned: !!item.status,
          levelKey: current.level_key,
          levelName: current.level_name,
        }));

        acc = [...acc, ...levelCards];

        return acc;
      }, []);

      const ownedCount = cards.filter((item: any) => item.owned).length;
    
      this.setData({
        cards,
        levelList,
        ownedCount,
        packetName: name,
        packetBgImg: 'https://objects.buff-box.com/' + img,
      });
    } catch(e) {
      console.log('##', e);
    }
  },
  handleChangeTab(event: WechatMiniprogram.BaseEvent) {
    const key = event?.currentTarget?.dataset?.key;

    this.setData({
      activeTab: key,
    });
  },
  jumpToDetail(event: WechatMiniprogram.BaseEvent) {
    const item = event?.currentTarget?.dataset?.item;

    wx.navigateTo({
      url: `./detail/index?id=${item.id}`,
    });
  }
})