import request from '../api/request';
import { Host } from '../constant/host';
import promisify from '../utils/promisify';

export const commonApi = {
  platformConfig (key: string) {
    return request({
      host: Host.API,
      url: `/sys/config/info/${key}`,
    })
  },
};

export const userApi = {
  getUserInfo() {
    return Promise.all([
      this.scoreLevel(0, { ignore401: true }),
      this.getBalanceInfo({}, { ignore401: true }),
    ]).then(([scoreLevel, balance ]) => {
      return {
        ...scoreLevel,
        balance
      }
    });
  },
  login () {
    const wxLogin = promisify(wx.login);
    return wxLogin().then((res: {code: string}) => {
      console.warn(res, '---')
      return request<LoginRes>({
        url: '/social/ma',
        data: res.code,
        method: "POST",
      }).then((result: LoginRes) => {
        wx.setStorageSync('userId', result.userId);
        wx.setStorageSync('Authorization', result.accessToken);
        this.getUserInfo().then(userInfo => {
          const app = getApp();
          app.globalData.userInfo = userInfo;
          app.triggerUpdate();
        });
        return result;
      });
    });
  },
  scoreLevel (levelType: 0|1 = 0, config?: RequestConfig) { // 会员等级类型0为根据会员自身情况 1为付费
    return request({
      url: `/p/score/scoreLevel/page?levelType=${levelType}`
    }, config)
  },
  getBalanceInfo (_:any, config?: RequestConfig) {
    return request({
      url: '/p/userBalance/getBalanceInfo'
    }, config)
  },
  scoreInfo (_:any, config?: RequestConfig) {
    return request({
      url: '/p/score/scoreInfo'
    }, config)
  },
  userEdit(data: {
    avatar: string,
    nickName: string,
    sex: '0' | '1' | '',
    idNo: string,
  }) {
    return request({
      url: "/p/user/edit",
      method: "POST",
      data,
    })
  },
  bindMobile(code: string) {
    return request({
      url: "/p/user/bindMobile",
      method: "POST",
      data: code,
    })
  },
  addrInfo (addrId: number) {
    return request({
      url: `/p/address/addrInfo/${addrId}`
    })
  },
  addressList () {
    return request({
      url: '/p/address/list'
    })
  },
  setDefaultAddr(id: number) {
    return request({
      method: 'PUT',
      url: `/p/address/defaultAddr/${id}`
    })
  },
  delAddr(id: number) {
    return request({
      method: 'DELETE',
      url: `/p/address/deleteAddr/${id}`
    })
  },
  addAddr(data: Address) {
    return request({
      method: 'POST',
      data,
      url: '/p/address/addAddr'
    })
  },
  updateAddr(data: Address) {
    return request({
      method: 'PUT',
      data,
      url: '/p/address/updateAddr'
    })
  },
  collectionGoods (prodId: number) {
    return request({
      method: 'POST',
      data: prodId,
      url: '/p/user/collection/addOrCancel'
    })
  },
  collectionShop (shopId: number) {
    return request({
      method: 'POST',
      data: shopId,
      url: '/p/shop/collection/addOrCancel'
    })
  },
  isCollectionGoods (prodId: number) {
    return request({
      method: 'GET',
      url: `/p/user/collection/isCollection?prodId=${prodId}`
    })
  },
  isCollectionShop (shopId: number) {
    return request({
      method: 'GET',
      url: `/p/shop/collection/isCollection?shopId=${shopId}`
    })
  },
};

export const mallApi = {
  areaList (pid?: number) {
    return request<Array<Area>>({
      url: `/p/area/listByPid?pid=${pid||0}`,
    })
  },
  goodsFeedsScore(data: any) {
    return request({
      url: '/p/score/mallClassification',
      data,
    }).then((data) => ({
      pages: data.pages,
      records: [{
        products: data.records,
      }]
    }));
  },
  goodsFeeds (data: {
    keyword?: string, // 搜索词
    categoryId?: number, // 类目id
    prodType?:number, // 商品类型(0普通商品 1拼团 2秒杀 3积分 4套餐 5活动)
    sort?: number, // 排序：0创建时间正序 1创建时间倒序,2销量倒序,3销量正序,4商品价格倒序,5商品价格正序,7市场价倒序,8市场价正序,10商品库存倒序,11商品库存正序,12商品序号倒序,13商品序号正序,14评论数量倒序,15评论数量正序,16根据置顶状态排序,17实际销量倒序,18实际销量正序,19注水销量倒序,20注水销量正序
    isActive?: number, // 是否筛选掉活动商品
    // orderBy: number,
    current?: number,
    size?: number,
    hasStock?: boolean,
  }) {
    return request({
      url: '/search/page',
      data,
    })
  },
  goodsInfo (prodId: number) {
    return request({
      url: `/prod/prodInfo?prodId=${prodId}`
    })
  },
  goodsScoreInfo (prodId: number) {
    return request({
      url: `/p/score/prod/prodInfo?prodId=${prodId}`
    })
  },
  confirm (data: any, isScoreType?: boolean) {
    return request({
      method: 'POST',
      url: `/p/${isScoreType ? 'score':'order'}/confirm`,
      data
    })
  },
  submit (data: any, isScoreType?: boolean) {
    return request({
      method: 'POST',
      url: `/p/${isScoreType ? 'score':'order'}/submit`,
      data
    })
  },
  cancel (orderNumber: string) {
    return request({
      method: 'PUT',
      url: `/p/myOrder/cancel/${orderNumber}`,
    })
  },
  pay(data: {
    payType?: 1,
    orderNumbers: number,
    returnUrl?: string,
  }) {
    data.payType = 1;
    return request({
      method: 'POST',
      url: '/p/order/pay',
      data,
    });
  },
  receipt(orderNumber: number) {
    return request({
      url: `/p/myOrder/receipt/${orderNumber}`,
      method: "PUT",
    })
  },
  myOrderList(data: {
    current: number,
    size: number,
    status: number, // 0: 全部 1:待付款 2:待发货 3:待收货 4:待评价 5:成功 6:失败 7:待成团
  }) {
    return request({
      url: '/p/myOrder/myOrder',
      data,
    })
  },
  orderDetail (orderNumber: number) {
    return request({
      url: `/p/myOrder/orderDetail?orderNumber=${orderNumber}`,
    })
  }
};

export const groupApi = {
  createActivity (data : {
    cgpActivity: {
      activityName: string,
      rotateImgs: string,
      content: string,
      media: string,
      startTime: string,
      endTime: string,
      ipId: number, // 类别
      targetAmount: number,
      shopId: number,
    },
    groupProd: {
      groupSkuList: Array<{
        actPrice: 0,
				skuId: number,
				limitNum: number,
				// "leaderPrice": 0,
				// "price": 0,
				// "sellNum": 0,
				// "stocks": 0
      }>,
      shopId: number,
      prodId: number,
    }
  }) {
    return request<any>({
      method: 'POST',
      url: '/p/cgp/activity',
      data,
    })
  },
  enableSkuList () {
    return request<any>({
      url: '/cgp/sku/enableSkuList',
    })
  },
  activityPage (data: {
    current: number,
    size: number,
  }) {
    return request<any>({
      url: '/p/cgp/activity/page',
      data,
    })
  }
}