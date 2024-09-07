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
  }
})