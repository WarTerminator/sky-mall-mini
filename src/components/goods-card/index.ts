import { IMG_HOST } from "../../constant/host"

Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    type: {
      type: String,
      value: ''
    }
  },
  data: {
    IMG_HOST,
  },
  methods: {
    handleDetail() {
      const item = this.data.item;
      if (this.data.type === 'group') {
        // TODO
        wx.navigateTo({
          url: ``
        })
      } else {
        wx.navigateTo({
          url: `/pages/product/index?prodId=${item.prodId || item.cgpActivityId}&shopId=${item.shopId}&from=${this.data.type}`
        })
      }
    },
  }
})

