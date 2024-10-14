import {
  mallApi,
  userApi,
} from '../../api/index';
import { VIPConfigMap } from '../../constant/index';
import { getMyElement } from '../../utils/util';

const formatRichText = (html: any) => {
  let newContent = html.replace(/<img[^>]*>/gi, function(match: any, capture: any) {
    match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
    match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
    match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
    return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi, function(match: any, capture: any) {
    match = match
      .replace(/<p>/gi, '<p class="p_class">')
      .replace(/width:[^;]+;/gi, 'max-width:100%;')
      .replace(/width:[^;]+;/gi, 'max-width:100%;');
    return match;
  });
  newContent = newContent.replace(/<br[^>]*\/>/gi, "");
  newContent = newContent.replace(/<a>/gi, '<a class="p_class "');
  newContent = newContent.replace(/<li>/gi, '<li class="p_class "');
  newContent = newContent.replace(/\<p/gi, '<p class="p_class "');
  newContent = newContent.replace(/\<span/gi, '<span class="p_class "');
  newContent = newContent.replace(/\<img/gi,
    '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
  return newContent;
}

let interval = 1000;
Page<any, any>({
  data: {
    isShared: false, // 是否分享场景
    isCollection: false, // 是否关注
    prodId: '',
    toggleTip: true,
    userInfo: {},
    vipOption: {},
    currentCount: 1,
    timeLeft: 0,
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
    content: '',
    intoView: '',
    tabSelected: 0,
    params: {},
    navBar: {},
    actionHeight: 65,
    d: 0, //天
		h: 0, //时
		m: 0, //分
		s: 0, //秒
		lastTime: '', //倒计时的时间戳
		isCountOver: false, // 倒计时是否完成
  },
  onLoad(params: any) {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    this.setData({
      navBar: app.globalData.navBar,
      userInfo,
      params,
      prodId: params.prodId,
      isShared: app.globalData?.scene == 1007 || app.globalData?.scene == 1008,
      vipOption: userInfo?.levelType == 1 ? VIPConfigMap[userInfo?.userLevel.termType || 0] : {},
    });
    getMyElement('#J_Action').then(res => {
      this.setData({
        actionHeight: res.height
      });
    });

    this.queryDetail(params);
    
    // 收藏
    params.prodId && userApi.isCollectionGoods(+params.prodId).then((result: boolean) => {
      this.setData({
        isCollection: result,
      });
    });
  },

  queryDetail (params: any) {
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
        content: formatRichText(data?.content)
      });

      if (data?.limitedStatus === 1 && this.initTime(data) > 0) {
        this.startCountdown(data);
      }
    }));
  },

  //初始化时间
  initTime(data: any) {
    let lastTime = Number(new Date(data.rushTime)) - Number(new Date(data.currentTime));
    return Math.max(lastTime, 0);
  },

  // 格式化时间加0
  fixedZero(val: number) {
    return val < 10 ? `0${val}` : val;
  },

  //默认处理时间格式
  defaultFormat(time: number) {
    const days = 60 * 60 * 1000 * 24;
    const hours = 60 * 60 * 1000;
    const minutes = 60 * 1000;
    const d = Math.floor(time / days);
    const h = Math.floor((time % days) / hours);

    const m = Math.floor((time % hours) / minutes);
    const s = Math.floor((time % minutes) / 1000);

    this.setData({
      d: this.fixedZero(d),
      h: this.fixedZero(h),
      m: this.fixedZero(m),
      s: this.fixedZero(s),
    });
  },

  //定时事件
  tick() {
    let { lastTime } = this.data;
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      if (lastTime <= interval) {
        this.setData({
          lastTime: 0,
          isCountOver: false,
        }, () => {
          this.queryDetail();
        });
      } else {
        lastTime -= 1000;
        this.setData(
          {
            lastTime,
          },
          () => {
            this.defaultFormat(lastTime);
            this.tick();
          },
        );
      }
    }, interval);
  },

  startCountdown(data: any) {
    const lastTime = this.initTime(data);
    if (lastTime > interval) {
      this.defaultFormat(lastTime);
      this.setData({
        isCountOver: true,
        lastTime,
      });
    }

    this.tick();
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
    if (!this.data.currentSkuItem.stocks) {
      return wx.showToast({
        title: '库存不足',
        icon: 'error',
        duration: 2000
      })
    }
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
    wx.navigateTo({
      url: '/pages/pay/index'
    });
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
    const targetSkuItem = e.currentTarget.dataset.item;
    if (!targetSkuItem.stocks) {
      return wx.showToast({
        title: '库存不足',
        icon: 'error',
        duration: 2000
      })
    }
    return this.setData({
      currentCount: 1,
      currentSkuItem: targetSkuItem,
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
    // 限购的逻辑
    const { hasMaxNum, maxNum } = this.data.goodsInfo || {};
    if (hasMaxNum && this.data.currentCount >= maxNum) return;
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
