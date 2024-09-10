import {
  commonApi,
  mallApi,
  userApi,
} from '../../api/index'
import {
  IMG_HOST,
} from '../../constant/host';
import {
  officialShopLogo,
  LOGO
} from '../../constant/index';

const systemInfo = wx.getSystemInfoSync()

const lerp = (begin: number, end: number, t: number) => {
  'worklet'
  return begin + (end - begin) * t
}

const clamp = (cur: number, lowerBound: number, upperBound: number) => {
  'worklet'
  if (cur > upperBound) return upperBound
  if (cur < lowerBound) return lowerBound
  return cur
}

const app = getApp();
/*
  Document
  - https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html
  - https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html
  - https://developers.weixin.qq.com/miniprogram/dev/reference/wxml
*/
Page<any, any>({
  data: {
    officialShopLogo,
    IMG_HOST,
    isEnd: false,
    goods: [],
    pageIndex: 1,
    banners: [],
    hots: [],
    entrances: [],
    // // categoryCurrent: '2147',
    // categoryCurrent: '388',
    categorySet: [],
    intoView: '',
    userInfo: null,
    init: true,
    navBarOpacity: 0,
    navBar: {
      scrollViewHeight: 0
    },
    LOGO,
    scrollTop: null,
    categoryWrapTop: '',
    fixTab: false,
  },
  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar((tabBar: any) => {
        tabBar.setData({
          selected: 0
        })
      })
    }
  },
  onLoad() {
    // let query = wx.createSelectorQuery();
    // query.select('#categoryWrap').boundingClientRect((rect) => {
    //   this.setData({
    //     categoryWrapTop: rect.top
    //   })
    // }).exec();
    this.setData({
      paddingHeight: wx.getMenuButtonBoundingClientRect().top,
    })
    
    this.setData({
      userInfo: app.globalData.userInfo,
      navBar: app.globalData.navBar
    });
    // 首页配置
    commonApi.platformConfig('MINI_HOME').then((data) => {
      this.setData({
        banners: data.banners || [],
        hots: (data.hots || []).slice(0, 5) || [],
        entrances: data.entrances || [],
        categorySet: [{
          page: 0,
          categorys: data.categories.slice(0, 5) || []
        }]
      });
    });
    // 首页feeds
    if (!wx.getStorageSync('Authorization')) {
      userApi.login().then(() => {
        this.getFeeds();
      })
    } else {
      this.getFeeds();
    }
  },
  
  getFeeds() {
    return mallApi.goodsFeedsScore({
      sort: 1,
      categoryId: app.globalData.categoryCurrent || '',
      current: this.data.pageIndex,
      size: 20,
      hasStock: true,
    }).then((result) => {
      const isEnd = result.pages == this.data.pageIndex;
      this.setData({
        goods: [...this.data.goods, ...(result?.records[0].products || [])],
        pageIndex: this.data.pageIndex + 1,
        isEnd,
        init: false,
      })
    });
  },
  // globalData更新
  onGlobalDataUpdate() {
    const app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },
  // 滚动加载
  handleScrollEnd() {
    if (this.data.isEnd) return false;
    return this.getFeeds();
  },
  // 滚动导航渐现
  handleScrollUpdate(evt: any) {
    const maxDistance = 60
    const scrollTop = clamp(evt.detail.scrollTop, 0, maxDistance)
    const progress = scrollTop / maxDistance;
    this.setData({
      navBarOpacity: lerp(0, 1, progress),
      scrollTop: evt.detail.scrollTop,
      // fixTab: evt.detail.scrollTop > this.data.categoryWrapTop - this.data.navBar.navBarHeight
    });
  },
  // handleCategory(e: any) {
  //   const item = e.currentTarget.dataset.item;
  //   // wx.navigateTo({
  //   //   url: `../category/index?id=${item.id}`
  //   // })
  //   this.setData({
  //     pageIndex: 1,
  //     categoryCurrent: item.id,
  //   })
  //   this.getFeeds();
  // },
  handleHot(e: any) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `../product/index?prodId=${item.id}`
    })
  },
  handleEntry(e: any) {
    const item = e.currentTarget.dataset.item;

    if (item.navigate) {
      return wx.navigateTo({
        url: `../${item.page}/index`
      })
    }

    wx.switchTab({
      url: `../${item.page}/index`
    })
  },
  handleDebug() {
    wx.navigateTo({
      url: '../debug/index'
    })
  }
})
