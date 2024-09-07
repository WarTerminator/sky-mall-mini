import { commonApi, userApi } from "./api/index"
/*
  Document
  - https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html
  - https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html
*/
App<IAppOption>({
  globalData: {
    scene: 1000,
    orderProduct: null,
    userInfo: null,
    addressList: [],
    addressSelected: null,
    config: {
      editorWebUrl: ''
    }
  },
  onLaunch() {
    this.getUserInfo();
    this.getGlobalConfigAsync();
  },
  onShow(params) {
    this.globalData.scene = params?.scene || 1000;
  },
   // 触发页面回调以更新数据
  triggerUpdate () {
    const pages = getCurrentPages();
    pages.forEach(page => {
      if (page.onGlobalDataUpdate) page.onGlobalDataUpdate();
    });
  },
  getGlobalConfigAsync () {
    commonApi.platformConfig('MINI_GLOBAL').then((data) => {
      this.globalData.config = data;
    });
  },
  getUserInfo() {
    const token = wx.getStorageSync('Authorization');
    if (!token) return;
    return userApi.getUserInfo().then((userInfo) => {
      this.globalData.userInfo = userInfo;
      this.triggerUpdate();
    });
  },
})