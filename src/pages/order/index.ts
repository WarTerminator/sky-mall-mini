import {
  mallApi,
} from '../../api/index';
import {
  IMG_PRE,
} from '../../constant/host';
import WXToast from '../../utils/WXToast';


Page({
  data: {
    loading: true,
    isEnd: false,
    pageIndex: 0,
    currentTabStatus: 0, // 0: 全部 1:待付款 2:待发货 3:待收货 4:待评价 5:成功 6:失败
    tabs: [
      {
        label: '全部',
        status: 0,
      },
      {
        label: '待付款',
        status: 1,
      },
      {
        label: '待发货',
        status: 2,
      },
      {
        label: '待收货',
        status: 3,
      },
      {
        label: '评价',
        status: 4,
      },
    ],
    orderList: [],
    IMG_PRE,
    navBar: {}
  },
  onLoad(params: any) {
    const app = getApp();
    this.setData({
      currentTabStatus: params.status || 0,
      navBar: app.globalData.navBar
    });
    this.getOrderList();
  },
  getOrderList() {
    return mallApi.myOrderList({
      current: this.data.pageIndex + 1,
      size: 10,
      status: this.data.currentTabStatus,
    }).then((data) => {
      const list = data.records.filter((item: any) => item.status);
      this.setData({
        // @ts-ignore
        orderList: [...this.data.orderList, ...list],
        pageIndex: data.current,
        isEnd: data.current == data.pages,
        loading: false,
      })
    });
  },
  handleScrollEnd () {
    if (this.data.isEnd) return;
    this.getOrderList();
  },
  handleTab(e: any) {
    const currentTabStatus = e.currentTarget.dataset.status;
    if (this.data.currentTabStatus === currentTabStatus) return;
    this.setData({
      loading: true,
      currentTabStatus,
      pageIndex: 0,
      orderList: [],
      isEnd: false,
    });
    this.getOrderList();
  },
  handleToDetail(e: any) {
    const {
      orderNumber,
    } = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/order/detail?orderId=${orderNumber}`
    })
  },
  async handleCancel(e: any) {
    const { item, index } = e.currentTarget.dataset;

    try {
      await mallApi.cancel(item.orderNumber);
      const _orderList: any[] = [...this.data.orderList];
      _orderList[index].status = 6;

      this.setData({
        // @ts-ignore
        orderList: _orderList,
      });

      WXToast('取消订单成功', 'success');
    } catch(e) {
      WXToast(e?.data);
    }
  },
  handlePay(e: any) {
    const { orderNumber, index } = e.currentTarget.dataset.item;
    return mallApi.pay({
      orderNumbers: orderNumber,
    }).then((res: any) => {
      const _this = this;
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.packageValue,
        signType: res.signType,
        paySign: res.paySign,
        success () {
          _this.data.orderList.splice(index, 1);
          _this.setData({
            orderList: _this.data.orderList
          })
          wx.redirectTo({
            url: `../pay/result?orderNumber=${orderNumber}`
          })
        },
        fail (res) {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
          })
        }
      });
      return;
    }).catch((err) => {
      wx.showToast({
        title: err.data,
        icon: 'none',
      })
    });
  },
  handleGot(e: any) {
    const { orderNumber, index } = e.currentTarget.dataset.item;
    const _this = this;
    wx.showModal({
      title: '确定已收到货吗？',
      content: '确认收货后订单状态将发生改变，请您谨慎考虑',
      success (res) {
        if (res.confirm) {
          mallApi.receipt(orderNumber).then(() => {
            _this.data.orderList.splice(index, 1);
            _this.setData({
              orderList: _this.data.orderList
            });
            wx.navigateTo({
              url: `/pages/order/detail?orderId=${orderNumber}`
            })
          })
        }
      }
    })
  }
})
