import blindBoxService from "../../../api/blind-box";
import { mallApi, userApi } from "../../../api/index";
import eventBus from "../../../utils/event-bus";
import { genUUID } from "../../../utils/index";
import WXToast from "../../../utils/WXToast";

// pages/storage-locker/confirm-order/index.ts
Component<{
  selectedAddress: any;
  orderData: any;
}, Record<string, any>, Record<string, Function>, Record<string, any>, false>({
  properties: {
    orderParams: {
      type: Object,
      observer(newValue: any) {
        if (newValue) {
          this.setData({
            orderData: null,
          });
          this._createOrder();
        }
      },
    },
  },
  data: {
    selectedAddress: null,
    orderData: null,
  },
  lifetimes: {
    attached() {
      this.queryAddressList();
      eventBus.on('onBack', (data: Address | any) => {
        this.setData({
          selectedAddress: data,
        });
        this._createOrder(data.addrId);
      });
    },
  },
  methods: {
    async _createOrder(addressId?: number) {
      addressId = addressId || this.data.selectedAddress?.addrId;
      if (!addressId) return;

      this._uuid = genUUID();

      try {
        const res = await blindBoxService.createDispatchOrder({
          addrId: addressId,
          userAssetIds: this.properties.orderParams.userAssetIds,
          uuid: this._uuid,
        });

        this.setData({
          orderData: res,
        });
      } catch (e) {
        await WXToast(e?.data);
        this.handleClose();
      }
    },
    queryAddressList() {
      userApi.addressList().then((res) => {
        const selectedAddress = (res || []).find((item: any) => item.commonAddr === 1);
        if (selectedAddress) {
          this.setData(({ selectedAddress }));
        }
      });
    },
    handleSelectAddress() {
      if (this.data.selectedAddress.addrId) {
        wx.navigateTo({
          url: `../address/index?from=submit-dispatch&addrId=${this.data.selectedAddress.addrId}`
        })
      } else {
        wx.navigateTo({
          url: '../address/update?from=submit-dispatch'
        })
      }
    },
    async handleSubmit() {
      if (!this.data.orderData) {
        await WXToast('订单生成异常，请重新选择需发货的商品');
        this.handleClose();
        return;
      }

      if (!this.data.selectedAddress?.addrId) {
        WXToast('请先添加收货地址');
        return;
      }

      wx.showLoading({
        title: '支付中...'
      });

      try {
        if (!this._orderNumbers) {
          const orderRes = await mallApi.submit({
            orderShopParam: [{
              remarks: '',
              shopId: this.properties.orderParams.shopId,
            }],
            uuid: this._uuid,
            orderInvoiceList: null,
            virtualRemarkList: []
          });

          this._orderNumbers = orderRes.orderNumbers;
          this.triggerEvent('submitSuccess');
        }

        const payRes = await mallApi.pay({
          orderNumbers: this._orderNumbers,
        });

        if (this.data.orderData?.actualTotal == 0) {
          this.jumpToOrderPage();
          return;
        }

        this.handlePay(payRes);
      } catch (e) {
        WXToast(e?.data);

        if (this._orderNumbers) {
          wx.navigateTo({
            url: '../order/index?status=1'
          });
        }
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
          this.jumpToOrderPage();
        },
        fail: async (e) => {
          const isCancel = e.errMsg?.includes('cancel');
          await WXToast(isCancel ? '支付取消' : '支付失败', 'error');
          this.handleClose();
          wx.navigateTo({
            url: '../order/index?status=1'
          });
        },
      });
    },
    handleClose() {
      this.triggerEvent('close');
    },
    async jumpToOrderPage() {
      this.handleClose();
      // wx.hideLoading();
      await WXToast('订单已提交', 'success');
      wx.navigateTo({
        url: '../order/index?status=2'
      });
    },
  }
})