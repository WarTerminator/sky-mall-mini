// components/flip-card/index.ts
Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    width: {
      type: String,
      value: '100%',
    },
    height: {
      type: String,
      value: '100%',
    },
    flip: {
      type: Boolean,
      value: false,
      observer(newValue, prevValue) {
        if (!prevValue && newValue) {
          this.handleFlip();
        }
      },
    },
    clickFlip: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    status: 'init',
  },
  methods: {
    handleFlip() {
      if (this.data.status === 'init') {
        this.setData({
          status: 'flipping',
        });
      }
    },
    handleFlipByClick() {
      if (!this.properties.clickFlip) return;

      this.handleFlip();
    },
    onAnimationStart() {
      this.triggerEvent('flipStart');
    },
    onAnimationEnd() {
      this.setData({
        status: 'flipped',
      });
      this.triggerEvent('flipEnd');
    },
  }
})