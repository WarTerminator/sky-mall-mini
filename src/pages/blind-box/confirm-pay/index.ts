// pages/blind-box/confirm-order/index.ts
Component({
  properties: {
    count: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    }
  },
  data: {
  },
  methods: {
    handleSubmit() {
      this.triggerEvent('success', { count: this.properties.count });
    },
    handleClose() {
      this.triggerEvent('close');
    },
  }
})