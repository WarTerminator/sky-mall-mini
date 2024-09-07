// pages/submit-dispatch/index.ts
import { userApi } from "../../api/index";
import eventBus from '../../utils/event-bus';

Page<Record<string, any>, Record<string, any>>({
  data: {
    selectedAddress: {},
  },
  onLoad() {
    this.queryAddressList();
    eventBus.on('onBack', (data: Address | any) => {
      this.setData({
        selectedAddress: data,
      });
    })
  },
  queryAddressList() {
    userApi.addressList().then((res) => {
      const selectedAddress = (res || []).find((item: any) => item.commonAddr === 1);
      if (selectedAddress) {
        this.setData(({ selectedAddress }));
      }
    });
  },
  handleSelectAddress() {
    if (this.data.selectedAddress.addrId) {
      wx.navigateTo({
        url: `../address/index?from=submit-dispatch&addrId=${this.data.selectedAddress.addrId}`
      })
    } else {
      wx.navigateTo({
        url: '../addressAdd/index?from=submit-dispatch'
      })
    }
  },
})