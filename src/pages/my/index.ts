import { IMG_PRE } from '../../constant/host';

Page<any,any>({
  data: {
    IMG_PRE,
    account: [
      {
        label: '会员',
        value: 'Lv1',
      },
      {
        label: '能量值',
        value: '*',
      },
      {
        label: '钱包',
        value: '*',
      },
    ],
    entries: [
      {
        label: '我的订单',
        icon: 'order',
        path: '../order/index'
      },
      // {
      //   label: '我的收藏',
      //   icon: 'collection'
      // },
      // {
      //   label: '兑换中心',
      //   icon: 'exchange'
      // },
      // {
      //   label: '我的集册',
      //   icon: 'books'
      // },
      {
        label: '地址管理',
        icon: 'location',
        path: '../address/index'
      }
    ],
    userInfo: {},
  },
  onShow() {
    if (typeof this.getTabBar === 'function' ) {
      this.getTabBar((tabBar:any) => {
        tabBar.setData({
          selected: 4
        })
      })
    }
  },
  onLoad() {
    const { userInfo } = getApp().globalData;
    this.setData({
      userInfo,
      account: [
        {
          label: '会员',
          value: `Lv${userInfo?.userLevel?.level || 1}`,
        },
        {
          label: '能量值',
          value: userInfo.score || 0,
        },
        {
          label: '钱包',
          value: `¥${userInfo.balance || 0}`,
        },
      ]
    });
  },
  onGlobalDataUpdate () {
    const { userInfo } = getApp().globalData;
    this.setData({
      userInfo,
    });
  },
  handleToAddress() {
    wx.navigateTo({
      url: '../address/index?from=my'
    })
  },
  handleToLogin () {
    wx.navigateTo({
      url: '../login/index'
    })
  },
  handleToOrder() {
    wx.navigateTo({
      url: '../order/index'
    })
  },
  handleToPath(e:any) {
    const {
      path,
    } = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: path,
    })
  },
  handleEditUserInfo() {
    wx.navigateTo({
      url: '/pages/my/userInfo'
    })
  }
})
