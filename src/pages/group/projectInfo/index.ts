import { mallApi } from '../../../api/index';
import { IMG_PRE } from '../../../constant/host';

Page<any,any>({
  data: {
    IMG_PRE,
    trans: [],
    orderId: '',
    orderInfo: {},
  },
  onLoad(params: any) {
    this.setData({
      orderId: params.orderId,
    });
    this.getOrderDetail(params.orderId);
  },
  getOrderDetail (orderId: number) {
    return mallApi.orderDetail(orderId || this.data.orderId).then((res) => {
      this.setData({
        orderInfo: res,
        trans: [
          {
            status: '提交订单',
            date: res.createTime,
            active: true,
          },
          {
            status: '买家付款',
            date: res.payTime || '',
            active: [2, 3, 4, 5].includes(res.status),
          },
          {
            status: '商品出库',
            date: res.dvyTime || '',
            active: ![1,2,6].includes(res.status),
          },
          {
            status: '等待收货',
            date: '',
            active: [3, 4, 5].includes(res.status),
          },
          {
            status: '订单完成',
            date: res.fianllyTime || '',
            active: res.status === 5
          }
        ]
      });
    });
  },
  handlePay() {
    return mallApi.pay({
      orderNumbers: this.data.orderId,
    }).then((res: any) => {
      wx.requestPayment({
        ...res,
        package: res.packageValue,
        success: this.getOrderDetail,
        fail (result: any) {
          wx.showToast({
            title: result.errMsg,
            icon: 'error',
          })
        }
      });
      return;
    }).catch((err) => {
      wx.showToast({
        title: err.data,
        icon: 'error',
      })
    });
  },
  handleGot() {
    wx.showModal({
      title: '确定已收到货吗？',
      content: '确认收货后订单状态将发生改变，请您谨慎考虑',
      success: (res) => {
        res.confirm && mallApi.receipt(this.data.orderId).then(this.getOrderDetail)
      }
    })
  }
})
