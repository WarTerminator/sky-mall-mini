import {
  mallApi,
  userApi,
} from '../../api/index';
import { VIPConfigMap } from '../../constant/index';

Page<any, any>({
  data: {
    isShared: false, // 是否分享场景
    isCollection: false, // 是否关注
    prodId: '',
    toggleTip: true,
    userInfo: {},
    vipOption: {},
    currentCount: 1,
    currentSkuItem: {
      skuId: 0,
      stocks: 0,
    },
    previewShow: false,
    showSkuPop: false,
    swiperImgs: [],
    swiperCurrent: 0,
    previewCurrent: 0,
    goodsInfo: {
      skuList: [{
        skuId: 0,
      }],
      imgs: '',
      video: '',
    },
    isDesign: false,
    tabs: [
      {
        name: '商品详情'
      },
      {
        name: '传图规范'
      },
      {
        name: '售后详情'
      }
    ],
    intoView: '',
    tabSelected: 0
  },
  onLoad(params: any) {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    this.setData({
      userInfo,
      prodId: params.prodId,
      isShared: app.globalData?.scene == 1007 || app.globalData?.scene == 1008,
      vipOption: userInfo?.levelType == 1 ? VIPConfigMap[userInfo?.userLevel.termType || 0] : {}
    });
    // 商品详情
    mallApi.goodsInfo(+(params?.prodId || 0)).then((data => {
      const skuIms = data?.skuList.filter((i: any, index: number) => {
        i.index = index;
        return i.pic;
      }).map((i: any) => i.pic) || [];

      const imgs = data?.imgs.split(',') || [];
      const swiperImgs: any = [ ...[], ...skuIms, ...imgs];
      this.setData({
        goodsInfo: data,
        swiperImgs,
        currentSkuItem: data.skuList?.[0],
        isDesign: !!data.skuList[0].customCenterSkuEditTempId
      });
    }));
    // 收藏
    params.prodId && userApi.isCollectionGoods(+params.prodId).then((result: boolean) => {
      this.setData({
        isCollection: result,
      });
    });
  },
  onUnload () {
    const app = getApp();
    app.globalData.scene = '';
  },
  onShareAppMessage () {
    const {
      prodName,
      pic,
    } = this.data.goodsInfo as any;
    return {
      title: prodName,
      path: `/pages/product/index?prodId=${this.data.prodId}`,
      imageUrl: pic,
    }
  },
  handleHome () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 收藏
  handleCollection () {
    return userApi.collectionGoods(+this.data.prodId).then((result:boolean) => {
      this.setData({
        isCollection: result
      });
      wx.showToast({
        title: result ? '收藏成功' : '取消收藏',
        icon: 'success',
      });
    });
  },
  // 立即购买
  handleBuy () {
    // 数量选择
    return this.setData({
      showSkuPop: true,
    })
    if (this.data.goodsInfo?.skuList?.length) {
      return this.setData({
        showSkuPop: true,
      })
    }
    const app = getApp();
    app.globalData.orderProduct = {
      ...this.data.goodsInfo,
      $selectItemCount: this.data.currentCount,
      $selectSkuItem: this.data.goodsInfo?.skuList?.[0],
    };
    wx.navigateTo({
      url: '../pay/index'
    })
  },
  // skuPop确认
  handleEnsure () {
    if (!this.data.currentSkuItem?.skuId) {
      return wx.showToast({
        title: '请选择规格',
        icon: 'error',
        duration: 2000
      });
    }
    const app = getApp();
    app.globalData.orderProduct = {
      ...this.data.goodsInfo,
      $selectItemCount: this.data.currentCount,
      $selectSkuItem: this.data.currentSkuItem,
    };
    if (this.data.isDesign) {
      wx.navigateTo({
        url: '../design/index'
      });
    } else {
      wx.navigateTo({
        url: '/pages/pay/index'
      });
    }
    return this.setData({
      showSkuPop: false,
    })
  },
  handleTab (evt: any) {
    const id = evt.currentTarget.dataset.id
      this.setData({
        intoView: `tab-${id}`,
        tabSelected: parseInt(id, 10)
      })
  },
  // swiper主图切换
  handleSwiperChange (event: any) {
    const { current } = event.detail;
    this.setData({
      swiperCurrent: current,
    });
  },
  // 预览图切换
  handlePreviewChange(event: any) {
    const { current } = event.detail;
    this.setData({
      previewCurrent: current,
    });
  },
  // 补货提示文案
  handleToggleTip() {
    this.setData({
      toggleTip: !this.data.toggleTip
    });
  },
  // 展示预览
  handlePreviewShow () {
    this.setData({
      previewShow: true,
    })
  },
  // 关闭预览
  handlePreviewClose () {
    this.setData({
      previewShow: false,
    })
  },
  // 关闭sku面板
  handleSkuClose () {
    this.setData({
      showSkuPop: false,
    })
  },
  // 切换sku
  handleSelectSku (e: any) {
    this.setData({
      currentCount: 1,
      currentSkuItem: e.currentTarget.dataset.item,
    })
  },
  // 数量减一
  handleSub () {
    if (this.data.currentCount <= 1) return;
    this.setData({
      currentCount: this.data.currentCount - 1,
    })
  },
  // 数量加一
  handleAdd () {
    if (!this.data.currentSkuItem?.skuId) {
      return wx.showToast({
        title: '请选择规格',
        icon: 'error',
        duration: 2000
      });
    }
    if (this.data.currentCount >= this.data.currentSkuItem?.stocks) {
      return wx.showToast({
        title: '库存不足',
        icon: 'error',
        duration: 2000
      })
    }
    return this.setData({
      currentCount: this.data.currentCount + 1,
    })
  }
})
