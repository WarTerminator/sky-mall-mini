// pages/blind-box/confirm-order/index.ts

const SRG_KEY = 'agreed-blind-box-agreement';

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
    agreed: false,
  },
  lifetimes: {
    attached() {
      try {
        const agreed = wx.getStorageSync(SRG_KEY);
        
        this.setData({
          agreed: !!agreed,
        })
      } catch {

      }
    },
  },
  methods: {
    handleAcceptAgreement() {
      const agreed = !this.data.agreed;
      this.setData({
        agreed,
      });

      wx.setStorageSync(SRG_KEY, agreed);
    },
    handleJumpToAgreement() {
    },
    handleSubmit() {
      if (!this.data.agreed) {
        wx.showToast({
          title: '请先阅读且同意《抽卡机商品购买协议》',
          icon: 'none',
          duration: 2000,
        });    

        return;
      }

      const detail = {
        totalPrice: this.properties.count * this.properties.blindBox.price,
        count: this.properties.count,
      }
      
      this.triggerEvent('submit', detail);
    },
    handleClose() {
      this.triggerEvent('close');
    },
  }
})