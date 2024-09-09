import { commonApi, groupApi } from "../../api/index";

Page<any,any>({
  data: {
    banners: [],
    hots: [],
    categorySet: [],
    tabs: [
      {
        name: '全部商品'
      }, {
      name: '吧唧徽章'
    }, {
      name: '亚克力'
    }, {
      name: '纸制品'
    }, {
      name: '其它'
    }],
    intoView: '',
    tabSelected: 0,
    isEnd: false,
    goods: [],
    pageIndex: 1,
    init: false,
    navBar: {
      scrollViewHeight: 0
    }
  },
  onShow() {
    if (typeof this.getTabBar === 'function' ) {
      this.getTabBar((tabBar:any) => {
        tabBar.setData({
          selected: 1
        })
      })
    }
  },
  onLoad() {
    const app = getApp();
    this.setData({
      navBar: app.globalData.navBar
    });
    this.getFeeds();
    // 首页配置
    commonApi.platformConfig('MINI_HOME').then((data) => {
      this.setData({
        banners: data.banners || [],
        hots: (data.hots || []).slice(0,4) || [],
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
  },
  handleTab (evt: any) {
    const id = evt.currentTarget.dataset.id
    this.setData({
      intoView: `tab-${id}`,
      tabSelected: parseInt(id, 10)
    })
  },
  getFeeds () {
    return groupApi.activityPage({
      current: this.data.pageIndex,
      size: 20,
    }).then((result) => {
      this.setData({
        goods: [...this.data.goods, ...(result?.records || [])],
        pageIndex: result.current + 1,
        isEnd: result.current == result.pages,
        init: false,
      })
    });
  },
  // 滚动加载
  handleScrollEnd() {
    if (this.data.isEnd) return false;
    return this.getFeeds();
  },
})