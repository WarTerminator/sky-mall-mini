// pages/blind-box/detail-pop/index.ts
Component({
  properties: {
    blindBox: {
      type: Object,
    },
  },
  data: {

  },
  methods: {
    handleClose() {
      this.triggerEvent('close');
    },
  }
})