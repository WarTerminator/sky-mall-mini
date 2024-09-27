import {
  commonApi,
  mallApi,
  userApi,
} from '../../api/index';
import {
  genUUID,
} from '../../utils/index';
import {
  ProdType,
} from '../../constant/index';
import eventBus from '../../utils/event-bus';

Page<any,any>({
  data: {
    userInfo: {
      score: 0,
    },
    uuid: genUUID(),
    addressSelected: {
      addrId: 0,
    },
    remark: '',
    enableEnergyDeduction: false,
    orderDetail: {},
    orderProduct: {
      prodId: 0,
      prodType: 0,
      shopId: 0,
      $selectItemCount: 1,
      $selectSkuItem: {},
    },
    noAddress: false,
    shopScoreSwitch: false,
    params: {},
  },
  onLoad(params: any) {
    const { orderProduct, userInfo } = getApp().globalData;
    this.setData(({
      orderProduct,
      userInfo,
      params,
    }));
    this.queryAddList().then(() => this.orderConfirm());
    // 配置
    commonApi.platformConfig('SCORE_CONFIG').then((option) => {
      this.setData({
        shopScoreSwitch: option?.shopScoreSwitch
      });
    });
    eventBus.on('onBack', (data: Address | any) => {
      // 切换地址后
      this.setData({
        addressSelected: data,
        noAddress: false,
      });
      this.orderConfirm();
    });
  },
  // 地址查询
  queryAddList () {
    return userApi.addressList().then((list) => {
      if (!list?.length) return this.setData({ noAddress: true});
      this.setData(({
        addressSelected: list.find((i: any) => i.commonAddr == 1)
      }))
    });
  },
  // 地址选择
  handleAddress() {
    if (this.data.noAddress) {
      wx.navigateTo({
        url: '../address/update?from=pay'
      })
    } else {
      wx.navigateTo({
        url: `../address/index?from=pay&addrId=${this.data.addressSelected.addrId}`
      })
    }
  },
  // 是否能量抵扣
  toggleEnergyDeduction () {
    this.setData({
      enableEnergyDeduction: !this.data.enableEnergyDeduction
    });
    this.orderConfirm();
  },
  // 订单金额计算
  orderConfirm () {
    const orderProduct:any = this.data.orderProduct || {};
    const {
      prodId,
      shopId,
      prodType,
    } = orderProduct;
    const orderItem = {
      prodCount: orderProduct.$selectItemCount,
      prodId,
      shopId,
      skuId: orderProduct.$selectSkuItem?.skuId,
    };
    const addrId = this.data.addressSelected && this.data.addressSelected?.addrId;
    const uuid = this.data.uuid;
    const params:any = prodType == ProdType.score ? {
      addrId,
      orderItem,
      userChangeCoupon: 1,
      uuid,
      isScorePay: orderProduct?.price > 0 ? Number(this.data.enableEnergyDeduction) : 0,
    } : {
      addrId,
      orderItem,
      couponIds: [],
      couponUserIds: [],
      isScorePay: 0,
      userChangeCoupon: 0,
      userUseScore: 0,
      uuid,
    };
    if (this.data.params.customizeNo) { // 定制
      params.customCenterConfirmParam = {
        count: this.data.params.count || 1,
        customizeNo: this.data.params.customizeNo,
        extParams: {}
      }
    }
    return mallApi.confirm(params, prodType == ProdType.score).then((orderDetail: any) => {
      return this.setData({
        orderDetail
      });
    });
  },
 
  // 提交订单
  handleSubmit () {
    if (!this.data.remark || this.data.remark.length !== 18) {
      return wx.showToast({
        title: '身份证号不正确',
        icon: 'error',
      })
    }
    if (this.data.noAddress) return wx.showToast({
      title: '请添加地址'
    })
    wx.showLoading({
      title: '支付中...'
    });
    const params = this.data.orderProduct?.prodType == ProdType.score ? {
      remarks: this.data.remark,
      uuid: this.data.uuid,
    } : {
      orderShopParam: [{
        remarks: this.data.remark,
        shopId: this.data.orderProduct.shopId,
      }],
      uuid: this.data.uuid,
      orderInvoiceList: null,
      virtualRemarkList: [],
    }
    return mallApi.submit(params, this.data.orderProduct?.prodType == ProdType.score).then((data: any) => {
      if (data.duplicateError == 1) {
        wx.showToast({
          title: '订单重复',
          icon: 'error',
        });
        return wx.redirectTo({
          url: '../order/index?state=1'
        });
      }
      return mallApi.pay({
        orderNumbers: data.orderNumbers,
      }).then((res: any) => {
        // @ts-ignore
        if (this.data.orderDetail.actualTotal == 0) {
          return wx.redirectTo({
            url: `../pay/result?orderNumber=${data.orderNumbers}`
          });
        }
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.packageValue,
          signType: res.signType,
          paySign: res.paySign,
          success () {
            wx.redirectTo({
              url: `../pay/result?orderNumber=${data.orderNumbers}`
            })
          },
          fail (res) {
            wx.redirectTo({
              url: '../order/index?state=1'
            });
            // wx.showToast({
            //   title: res.errMsg,
            //   icon: 'error',
            // })
          }
        });
        return;
      }).catch((err) => {
        wx.showToast({
          title: err.data,
          icon: 'error',
        })
      });
    }).catch(err => {
      wx.showToast({
        title: JSON.stringify(err?.data || err),
        icon: 'error',
      })
    }).finally(() => wx.hideLoading());
  },
  handleRemark (e: any) {
    if (e.detail.value.length !== 18) {
      wx.showToast({
        title: '身份证号不正确',
        icon: 'error',
      })
      return;
    }
    this.setData({
      remark: e.detail.value,
    })
  }
})
