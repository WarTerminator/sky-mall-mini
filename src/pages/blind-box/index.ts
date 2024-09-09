import { userApi } from "../../api/index";
import blindBoxService from "../../api/blind-box";
import { tryJsonParse } from "../../utils/index";
import WXToast from "../../utils/WXToast";

const TRIAL_SRG_KEY = 'trial-unbox-count';

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
  async onLoad(params) {
    this.setData({
      gameItemId: params.gameItemId,
    });

    await this.getBlindBoxDetail(params.gameItemId);

    if (params.dealAsset) {
      this.checkAsset(params.gameItemId);
    }
  },
  onReady() {
    // 获取弹窗组件
    this.popAdapter = this.selectComponent('#pop-adapter');
  },
  async _getDefaultAddress() {
    if (this._defaultAddressId) {
      return this._defaultAddressId;
    }

    try {
      const addressList = await userApi.addressList();
      const defaultAddress = (addressList || []).find((item: any) => item.commonAddr === 1);

      this._defaultAddressId = defaultAddress?.addrId;
      return this._defaultAddressId;
    } catch {
      return null;
    }
  },
  async getBlindBoxDetail (gameItemId: string) {
    const res = await blindBoxService.getBlindBoxDetail(gameItemId);

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
  },
  async checkAsset(assetId: number) {
    const blindBoxAsset = await blindBoxService.getUserAsset({
      size: 100,
      assetIds: [assetId],
      statusList: [0],
    });
    const assetIds = (blindBoxAsset?.records || []).map((item: any) => item.userAssetId);

    if (assetIds.length) {
      this.popAdapter?.handleShowPop('unboxing', { assetIds });
    }
  },
  async handleCreateOrder(event: WechatMiniprogram.BaseEvent) {
    const count = event?.currentTarget?.dataset?.count || 0;
    if (!count) return;

    const defaultAddressId = await this._getDefaultAddress();

    if (!defaultAddressId) {
      wx.showModal({
        content: '您还未设置默认收货地址，暂不能使用抽卡功能',
        confirmText: '去设置',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../address/index',
            });
          }
        }
      });      

      return;
    }

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
    const date = new Date().toLocaleDateString();
    const srgKey = `${TRIAL_SRG_KEY}-${date}`;
    const count = Number(wx.getStorageSync(srgKey) || 0);

    if (count >= 3) {
      WXToast('今日3次试玩机会已用完，请明日再试吧~');
      return;
    }

    this.popAdapter?.handleShowPop('unboxing', { isTrial: true });
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