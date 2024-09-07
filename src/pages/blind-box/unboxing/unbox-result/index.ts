// pages/blind-box/unboxing/unbox-result/index.ts

Component({
  properties: {
    cards: {
      type: Array,
    }
  },
  data: {
    _takingBack: false,
  },
  lifetimes: {
    attached() {
      this.setData({
        cards: [...this.properties.cards].sort((a, b) => {
          if (a.special === b.special) return 0;
          return a.special ? -1 : 1;
        }).map(item => ({
          ...item,
          inPosition: false,
          overview: false,
          flipped: false,
          translate: [],
        })),
      });

      let index = 0;
      let timer = setInterval(() => {
        this._handleDealCard(index);
        index ++;
        if (index > this.data.cards.length) {
          clearInterval(timer);
        }
      }, 100);
    }
  },
  methods: {
    // 发卡
    _handleDealCard(index: number) {
      const targetTranslate = [
        ['-110%', '-55%'],
        [0, '-55%'],
        ['110%', '-55%'],
        ['-110%', '55%'],
        [0, '55%'],
        ['110%', '55%'],
      ][index];

      if (targetTranslate !== undefined) {
        this.animate(`.card-wrap-${index}`, [
          { translate: [0, 0] },
          { translate: targetTranslate, ease: 'ease' }
        ], 400, () => {
          const [...cards] = this.data.cards;
          // 卡片就位，记录位移位置
          cards[index].inPosition = true;
          (cards[index].translate as any[]) = targetTranslate;
          this.setData({ cards });
        });
      }
    },
    // 卡片开始翻转
    onFlipStart(event: WechatMiniprogram.BaseEvent) {
      const [...cards] = this.data.cards;
      const index = event?.currentTarget?.dataset?.index;
      const item = cards[index];

      if (item.special) {
        cards[index].overview = true;
        this.setData({ cards });
        this.animate(`.card-wrap-${index}`, [
          { translate: item.translate, scale: [1, 1] },
          { translate: [0, 0], scale: [2, 2], ease: 'ease' }
        ], 400);
      }
    },
    // 卡片结束翻转
    onFlipEnd(event: WechatMiniprogram.BaseEvent) {
      const [...cards] = this.data.cards;
      const index = event?.currentTarget?.dataset?.index;
      cards[index].flipped = true;
      this.setData({ cards });
    },
    // 点击卡面
    onCardFrontClick(event: WechatMiniprogram.BaseEvent) {
      const index = event?.currentTarget?.dataset?.index;
      const item = this.data.cards[index];

      if (!item.overview) return;
      this.handleTakeBackCard();
    },
    // 收回卡片
    handleTakeBackCard() {
      const [...cards] = this.data.cards;
      const index = cards.findIndex(item => item.overview);

      if (index < 0 || this.data._takingBack) return;

      const item = this.data.cards[index];
      this.data._takingBack = true;
      this.animate(`.card-wrap-${index}`, [
        { translate: [0, 0], scale: [2, 2] },
        { translate: item.translate, scale: [1, 1], ease: 'ease' },
      ], 400, () => {
        this.data._takingBack = false;
        cards[index].overview = false;
        this.setData({ cards });
      });
    },
    // 手动翻卡
    handleFlipCard() {
      const index = this.data.cards.findIndex(item => !item.flipped);
      if (index < 0) return;

      const flipCard = this.selectComponent(`#flip-card-${index}`);
      flipCard?.handleFlip?.();
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