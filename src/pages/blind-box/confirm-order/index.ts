// pages/blind-box/confirm-order/index.ts

import blindBoxService from "../../../api/blind-box";
import { mallApi, userApi } from "../../../api/index";
import { genUUID } from "../../../utils/index";
import WXToast from "../../../utils/WXToast";

const SRG_KEY = 'agreed-blind-box-agreement';

Component<{
  agreed: boolean;
  orderData: any;
}, Record<string, any>, Record<string, Function>, Record<string, any>, false>({
  properties: {
    count: {
      type: Number,
    },
    blindBox: {
      type: Object,
    },
  },
  data: {
    agreed: false,
    orderData: undefined,
  },
  lifetimes: {
    attached() {
      const agreed = wx.getStorageSync(SRG_KEY);
      this.setData({
        agreed: !!agreed,
      });

      this._createOrder().catch(async (e: any) => {
        await WXToast(e?.data);
        this.triggerEvent('close');
      });
    },
  },
  methods: {
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
    async _createOrder() {
      const { prodId, shopId, skuList = [] } = this.properties.blindBox || {};
      const defaultAddressId = await this._getDefaultAddress();
      
      this._uuid = genUUID();

      try {
        const res = await mallApi.confirm({
          uuid: this._uuid,
          addrId: defaultAddressId,
          isScorePay: 0,
          couponIds: [],
          couponUserIds: [],
          userChangeCoupon: 0,
          userUseScore: 0,
          orderItem: {
            prodCount: this.properties.count,
            prodId,
            shopId,
            skuId: skuList[0]?.skuId,
          },
          orderType: 6,
        });

        this.setData({
          orderData: res,
        });

        return res;
      } catch(error) {
        throw error;
      }
    },
    handleAcceptAgreement() {
      const agreed = !this.data.agreed;
      this.setData({
        agreed,
      });

      wx.setStorageSync(SRG_KEY, agreed);
    },
    handleJumpToAgreement() {
    },
    async handleSubmit() {
      if (!this.data.orderData) return;

      if (!this.data.agreed) {
        WXToast('请先阅读并同意《抽卡机商品购买协议》');
        return;
      }

      wx.showLoading({
        title: '支付中...'
      });

      try {
        if (!this._orderNumbers) {
          const { shopId } = this.properties.blindBox || {};
          const orderRes = await mallApi.submit({
            orderShopParam: [{
              remarks: '',
              shopId,
            }],
            uuid: this._uuid,
            orderInvoiceList: null,
            virtualRemarkList: []
          });
  
          this._orderNumbers = orderRes.orderNumbers;
        }

        const payRes = await mallApi.pay({
          orderNumbers: this._orderNumbers,
        });
  
        if (this.data.orderData?.actualTotal == 0) {
          this.checkAsset();
          return;
        }
  
        this.handlePay(payRes);
      } catch(e) {
        console.warn(e, '3212')
        WXToast(e?.data);
      }
    },
    handlePay(payData: any) {
      wx.requestPayment({
        timeStamp: payData.timeStamp,
        nonceStr: payData.nonceStr,
        package: payData.packageValue,
        signType: payData.signType,
        paySign: payData.paySign,
        success: () => {
          this.checkAsset();
        },
        fail: (error) => {
          const isCancel = error.errMsg?.includes('cancel');
          WXToast(isCancel ? '交易取消' : '支付失败', 'error');
        },
      });
    },
    handleClose() {
      this.triggerEvent('close');
    },
    async checkAsset() {
      try {
        const { gameItemId } = this.properties.blindBox || {};
        const blindBoxAsset = await blindBoxService.getUserAsset({
          size: this.properties.count,
          assetIds: [gameItemId],
          statusList: [0],
        });

        const blindBoxAssetIds = (blindBoxAsset?.records || []).map((item: any) => item.userAssetId);

        if (!blindBoxAssetIds.length) {
          WXToast('交易异常', 'error');
          return;
        }

        this.triggerEvent('success', {
          assetIds: blindBoxAssetIds,
        });

        wx.hideLoading();
      } catch(e) {
        WXToast(e?.data);
      }
    },
  }
})