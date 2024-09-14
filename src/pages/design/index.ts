import { mallApi } from "../../api/index";
import { IMG_PRE } from "../../constant/host";

const app = getApp();

Page<any,any>({
  data: {
    IMG_PRE,
    recommendGoods: [0,1,2,3,4,5],
    category: [{
      name: '吧唧'
    }, {
      name: '亚克力'
    }, {
      name: '纸制品'
    }, {
      name: '其它'
    }],
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
    navBar: {},
  },
  onShow() {
    if (typeof this.getTabBar === 'function' ) {
      this.getTabBar((tabBar:any) => {
        tabBar.setData({
          selected: 2
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
  },
  getFeeds () {
    return mallApi.goodsFeeds({
      sort: 1,
      categoryId: app.globalData.categoryCurrent || '',
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
  // 滚动加载
  handleScrollEnd() {
    if (this.data.isEnd) return false;
    return this.getFeeds();
  },
  handleToDesign() {
    wx.navigateTo({
      url: '../design/editor'
    })
  },
  handleTab (evt: any) {
    const id = evt.currentTarget.dataset.id
      this.setData({
        intoView: `tab-${id}`,
        tabSelected: parseInt(id, 10)
      })
  },
})