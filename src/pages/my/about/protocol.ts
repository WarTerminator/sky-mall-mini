import { commonApi } from "../../../api/index"

Page({
  data: {
    title: '',
    content: '',
    navBar: {}
  },
  onLoad(params: any) {
    const app = getApp();
    this.setData({
      navBar: app.globalData.navBar
    });
    commonApi.serviceProtocol(params.type).then(({content}) => {
      this.setData({
        content,
        title: decodeURIComponent(params.title)
      })
    });
  }
})
