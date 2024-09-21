import { mallApi } from '../../api/index';
import { IMG_HOST } from '../../constant/host';
const app = getApp();

Page<any,any>({
  data: {
    goods: [],
    pageIndex: 1,
    isEnd: false,
    IMG_HOST,
    init: true,
  },
  onLoad() {
    this.getFeeds();
  },
  getFeeds () {
    return mallApi.goodsFeeds({
      sort: 1,
      current: this.data.pageIndex,
      categoryId: app.globalData.categoryCurrent || '',
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
  handleScrollEnd() {
    if (this.data.isEnd) return false;
    return this.getFeeds();
  },
  handleToHome() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  handleToOrder() {
    wx.navigateTo({
      url: '../orderList/index?status=2'
    })
  },
})
