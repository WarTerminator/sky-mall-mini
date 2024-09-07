// pages/blind-box/unboxing-pop/index.ts

Component({
  properties: {
    count: {
      type: Number,
    },
    blindBox: {
      type: Object,
    },
  },
  data: {
    showResult: false,
  },
  methods: {
    onDrawSuccess(event: any) {
      const cards = event?.detail?.cards || [];
      this.setData({ cards });
    },
    onCanvasUnboxed() {
      this.setData({
        showResult: true,
      })
    },
    onFlipAllFinished() {
      this.triggerEvent('finished');
    }
  },
})
