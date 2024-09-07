Page<any,any>({
  onShow() {
    if (typeof this.getTabBar === 'function' ) {
      this.getTabBar((tabBar:any) => {
        tabBar.setData({
          selected: 3
        })
      })
    }
  },
})