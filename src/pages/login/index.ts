import { userApi } from '../../api/index';

Page({
  data: {
    logs: [],
  },
  onLoad() {
    this.login();
  },
  // 静默登陆
  login() {
    const session = wx.getStorageSync('Authorization');
    if (!session) {
      userApi.login().then(() => {
        //...
      });
    } else {
      wx.checkSession({
        success () {
          //session_key 未过期，并且在本生命周期一直有效
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          userApi.login().then(() => {
            //...
          });
        }
      })
    }
  },
  handleToAddress() {
    wx.navigateTo({
      url: '../address/index?from=my'
    })
  },
  // 绑定手机号
  // https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
  getPhoneNumber(e: any) {
    console.log(e.detail.code)  // 动态令牌
    console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
    console.log(e.detail.errno)  // 错误码（失败时返回）
    // 将 动态令牌code传到开发者后台，并在开发者后台调用微信后台提供的 phonenumber.getPhoneNumber 接口，消费code来换取用户手机号。每个code有效期为5分钟，且只能消费一次。
    // 注：getPhoneNumber 返回的 code 与 wx.login 返回的 code 作用是不一样的，不能混用。
  }
})
