// pages/blind-box/unboxing/unbox-large-result/index.ts
Component({
  properties: {
    cards: {
      type: Array,
    },
  },
  data: {
    showFlipSwiper: false,
    allFlipped: false,
  },
  lifetimes: {
    attached() {
      const cards = [...this.properties.cards].sort((a, b) => {
        if (a.special === b.special) return 0;
        return a.special ? -1 : 1;
      });
      const allFlipped = cards.every(item => !item.special);

      this.setData({
        cards,
        allFlipped,
      });
    },
  },
  methods: {
    onCardBackClick(event: WechatMiniprogram.BaseEvent) {
      const item = event?.currentTarget?.dataset?.item;

      if (item.special && !this.data.allFlipped) {
        this.handleFlip();
      }
    },
    onFlipFinished() {
      this.setData({
        showFlipSwiper: false,
        allFlipped: true,
      });
    },
    handleFlip() {
      const specialCards = this.data.cards.filter(item => item.special);

      this.setData({
        specialCards,
        showFlipSwiper: true,
      });
    },
    // 关闭
    handleClose() {
      this.triggerEvent('finished');
    },
    jumpToStorageLocker() {
      this.handleClose();
      wx.navigateTo({
        url: `../storage-locker/index`
      });
    },
  }
})