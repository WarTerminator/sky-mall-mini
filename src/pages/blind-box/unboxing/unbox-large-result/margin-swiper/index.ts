
Component<{
  items: any[];
  current: number;
  allFlipped: boolean;
  autoSwipe: boolean;
}, {}, {}, {}, false>({
  properties: {
    items: Array,
  },
  data: {
    items: [],
    current: 0,
    allFlipped: false,
    autoSwipe: false,
  },
  lifetimes: {
    attached() {
      const items = this.properties.items.map(item => ({
        ...item,
        flip: false,
      }));

      this.setData({
        items,
      })
    }
  },
  methods: {
    onSwiperChange(event: any) {
      const current: number = event?.detail?.current;

      if (current !== undefined) {
        this.setData({
          current,
        });
      }
    },
    onSwiperFinish(event: any) {
      const current: number = event?.detail?.current;
      const items = [...this.data.items];
      items[current].flip = true;
      this.setData({ items });
    },
    onAnimationEnd() {
      const items = [...this.data.items];
      items[0].flip = true;
      this.setData({ items });
    },
    onFlipEnd() {
      if (this.data.current < this.data.items.length - 1 && this.data.autoSwipe) {
        setTimeout(() => {
          this.setData({
            current: this.data.current + 1,
          });
        }, 300);

        return;
      }

      const allFlipped = this.data.items.every(item => item.flip);

      if (allFlipped) {
        this.setData({
          allFlipped,
          autoSwipe: false,
        });
      }
    },
    handleChangeCurrent(event: WechatMiniprogram.BaseEvent) {
      const index = event?.currentTarget?.dataset?.index;
      this.setData({
        current: index,
      });
    },
    handleAction() {
      if (this.data.allFlipped) {
        this.triggerEvent('finished');
      } else {
        const index = this.data.items.findIndex(item => !item.flip);

        if (index >= 0) {
          this.setData({
            autoSwipe: true,
            current: index,
          });
        }
      }
    },
  },
})