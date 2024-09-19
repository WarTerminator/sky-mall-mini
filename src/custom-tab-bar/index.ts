// 引入全局函数
const app = getApp()
Component({
  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    color: "#afafaf",
    selectedColor: "#0099f6",
    backgroundColor: "#F7F8F8",
    list: [
      
      {
        pagePath: "/pages/index/index",
        iconPath: "/images/home1.png",
        selectedIconPath: "/images/home.png",
        text: "商城",
        iconSize: 20
      },
      {
        pagePath: "",
        bulge:true,
        iconPath: "/images/logo.png",
        selectedIconPath: "/images/logo.png",
      },
      {
        pagePath: "/pages/my/index",
        iconPath: "/images/my1.png",
        selectedIconPath: "/images/my.png",
        text: "我的",
        iconSize: 20
      }
    ]
  },
  ready: function() {
    this.setData({
      selected: app.globalData.selected
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e: any) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      if (!url) return;
      app.globalData.selected = data.index;
      wx.switchTab({url})
    }
  }
})