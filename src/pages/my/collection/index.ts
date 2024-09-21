import { userApi } from '../../../api/index';
import { IMG_HOST } from '../../../constant/host';

Page<any,any>({
  data: {
    goods: [],
    pageIndex: 1,
    isEnd: false,
    IMG_HOST,
    init: true,
    navBar: {}
  },
  onLoad() {
    const app = getApp();
    this.setData({
      navBar: app.globalData.navBar
    });
    this.getFeeds();
  },
  getFeeds () {
    return userApi.collectionProds({
      current: this.data.pageIndex,
      size: 20,
    }).then((result) => {
      const isEnd = result.pages == this.data.pageIndex;
      this.setData({
        goods: [...this.data.goods, ...(result?.records || [])],
        pageIndex: result.current + 1,
        isEnd,
        init: false,
      })
    });
  },
  handleScrollEnd() {
    if (this.data.isEnd) return false;
    return this.getFeeds();
  },
})
