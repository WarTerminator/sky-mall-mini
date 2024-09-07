import { IMG_HOST } from "../../constant/host"

Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },
  data: {
    IMG_HOST,
  },
  methods: {
    handleDetail() {
      wx.navigateTo({
        url: `/pages/product/index?prodId=${this.data.item.prodId}`
      })
    },
  }
})

