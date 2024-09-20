import { IMG_PRE } from '../../constant/host';
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page<any,any>({
  data: {
    IMG_PRE,
    entries: [
      {
        label: '我的订单',
        icon: 'order',
        path: '/pages/order/index'
      },
      {
        label: '地址管理',
        icon: 'location',
        path: '/pages/address/index'
      },
      {
        label: '关于',
        icon: 'project',
        path: '/pages/my/about/index'
      },
    ],
    userInfo: {},
    myInfo: {},
    avatarUrl: defaultAvatarUrl,
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
  onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
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
