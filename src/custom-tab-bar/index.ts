Component({
  data: {
    selected: 0,
    color: "#000000",
    selectedColor: "#000000",
    list: [
      {
        pagePath: "/pages/index/index",
        iconPath: "/images/home.png",
        selectedIconPath: "/images/home.png",
        text: "首页"
      },
      {
        pagePath: "/pages/group/index",
        iconPath: "/images/create.png",
        selectedIconPath: "/images/create.png",
        text: "创意"
      },
      {
        pagePath: "/pages/customized/index",
        iconPath: "/images/custom.png",
        selectedIconPath: "/images/custom.png",
        text: "定制"
      },
      {
        pagePath: "/pages/message/index",
        iconPath: "/images/message.png",
        selectedIconPath: "/images/message.png",
        text: "消息"
      },
      {
        pagePath: "/pages/my/index",
        iconPath: "/images/mine.png",
        selectedIconPath: "/images/mine.png",
        text: "我的"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e:any) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})