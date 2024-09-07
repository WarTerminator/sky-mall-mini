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
} from '../../constant/index';

const systemInfo = wx.getSystemInfoSync()

const { shared } = wx.worklet

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
    categoryCurrent: '',
    categorySet: [],
    categoryItemWidth: 0,
    intoView: '',
    userInfo: null,
    init: true,
  },
  onShow() {
    if (typeof this.getTabBar === 'function' ) {
      this.getTabBar((tabBar:any) => {
        tabBar.setData({
          selected: 0
        })
      })
    }
  },
  onLoad() {
    const app = getApp();
    this.navBarOpacity = shared(0)
    // const padding = 10 * 2
    this.setData({
      // categoryItemWidth: (systemInfo.windowWidth - padding) / 5,
      userInfo: app.globalData.userInfo
    })

    // 导航头透明度
    this.applyAnimatedStyle('.nav-bar', () => {
      'worklet'
      return {
        background: `rgba(255, 255, 255, ${this.navBarOpacity.value})`,
      }
    });
    // 首页配置
    commonApi.platformConfig('MINI_HOME').then((data) => {
      this.setData({
        banners: data.banners || [],
        hots: (data.hots || []).slice(0,5) || [],
        entrances: data.entrances || [],
        categorySet: [{
          page: 0,
          categorys: data.categories.slice(0,8) || []
        },
        {
          page: 1,
          categorys: data.categories.slice(8,16) || []
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
  getFeeds () {
    return mallApi.goodsFeeds({
      sort: 1,
      categoryId: this.data.categoryCurrent || '',
      current: this.data.pageIndex,
      size: 20,
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
    'worklet'
    const maxDistance = 60
    const scrollTop = clamp(evt.detail.scrollTop, 0, maxDistance)
    const progress = scrollTop / maxDistance
    this.navBarOpacity.value = lerp(0, 1, progress)
  },
  handleCategory(e:any) {
    const item = e.currentTarget.dataset.item;
    // wx.navigateTo({
    //   url: `../category/index?id=${item.id}`
    // })
    // this.setData({
    //   pageIndex: 1,
    //   categoryCurrent: item.id,
    // })
    // this.getFeeds();
  },
  handleHot (e:any) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `../product/index?prodId=${item.id}`
    })
  },
  handleEntry (e:any) {
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
  handleDebug () {
    wx.navigateTo({
      url: '../debug/index'
    })
  }
})
