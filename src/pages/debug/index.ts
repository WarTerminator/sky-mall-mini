Page({
  data: {
    logs: [],
  },
  onLoad() {
    //
  },
  handleClearNetCaches() {
    const cacheManager = wx.createCacheManager({});
    cacheManager.addRule(/https:\/\/(?:.*)/ig) // 表示所有 https 请求都匹配
    cacheManager.clearCaches();
    wx.showToast({
      title: '清除网络缓存成功'
    })
  },
  handleClearLocalCaches () {
    wx.clearStorageSync();
    wx.showToast({
      title: '清除本地缓存成功'
    })
  }
})
