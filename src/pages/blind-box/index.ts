import blindBoxService from "../../api/blind-box";
import { tryJsonParse } from "../../utils/index";

const extraBtns: any[] = [
  { title: '详情', key: 'detailPop' },
  { title: '概率规则', key: 'probabilityInfo' },
  { title: '抽卡记录', key: 'unboxRecord' },
];

Page<{
  gameItemId?: string;
  swiperLength: number;
  swiperIndex: number;
  extraBtns: any[];
  blindBoxList: any[];
}, Record<string, any>>({
  swiperLock: false,
  data: {
    swiperLength: 3,
    swiperIndex: 0,
    extraBtns,
    blindBoxList: [],
  },
  onLoad(params) {
    this.setData({
      gameItemId: params.gameItemId,
    });

    this.getBlindBoxDetail(params.gameItemId);
  },
  onReady: function () {
    // 获取弹窗组件
    this.popAdapter = this.selectComponent('#pop-adapter');
  },
  getBlindBoxDetail: function (gameItemId: string) {
    blindBoxService.getBlindBoxDetail(gameItemId).then(res => {
      const blindBoxList = (res || []).map((item: any) => {
        const ipInfo = tryJsonParse(item.remark);
        const extra = tryJsonParse(item.params);
        const { rule = [], items = [] } = extra;
        const cards = items.reduce((acc: any[], current: any) => {
          acc = acc.concat(current.children || []);
          return acc;
        }, []).slice(0, 4);

        return {
          ...item,
          rule,
          categories: items,
          cards,
          ipInfo,
        };
      });

      this.setData({ blindBoxList });
    });
  },
  handleCreateOrder(event: WechatMiniprogram.BaseEvent) {
    const count = event?.currentTarget?.dataset?.count || 0;

    if (!count) return;

    this.popAdapter?.handleShowConfirmOrder?.({
      count,
    });
  },
  jumpToStorageLocker() {
    wx.navigateTo({
      url: `../storage-locker/index`
    })
  },
  handleTrial() {
    this.popAdapter?.handleShowPop('unboxing', { count: 1 });
  },
  handleShowExtraPop(event: WechatMiniprogram.BaseEvent) {
    const key = event?.currentTarget?.dataset?.key;
    key && this.popAdapter?.handleShowPop(key);
  },
  handleSwiperChange(event: WechatMiniprogram.BaseEvent) {
    if (this.swiperLock) return;

    const change = event?.currentTarget?.dataset?.change || 0;
    const swiperLength = this.data.swiperLength;
    let next = this.data.swiperIndex + change;

    if (next >= swiperLength) {
      next = 0;
    } else if (next < 0) {
      next = swiperLength - 1;
    }

    this.setData({
      swiperIndex: next,
    });
  },
  onSwiperChange(event: any) {
    this.swiperLock = true;
    setTimeout(() => {
      this.swiperLock = false;
    }, 500);

    const swiperIndex: number = event?.detail?.current;

    if (swiperIndex !== undefined) {
      this.setData({
        swiperIndex,
      });
    }
  },
  onConifrmOrderClose() {
    this.setData({
      conifrmOrder: {
        show: false,
      },
    });
  },
})