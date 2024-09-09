// pages/blind-box/probability-info/index.ts
Component({
  properties: {
    blindBox: {
      type: Object,
    }
  },
  data: {

  },
  lifetimes: {
    attached() {
    }
  },
  methods: {
    handleClose() {
      this.triggerEvent('close');
    },
    jumpToCardAlbum() {
      wx.navigateTo({
        url: `../card-album/index?gameItemId=${this.properties.blindBox.gameItemId}`,
      });
    }
  }
})