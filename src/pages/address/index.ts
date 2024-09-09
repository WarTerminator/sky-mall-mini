import {
  userApi,
} from '../../api/index';
import eventBus from '../../utils/event-bus';

Page({
  data: {
    from: '', // [pay]
    addressList: [],
    selectedAddrId: '',
  },
  onLoad(params) {
    this.setData(({
      from: params.from || '',
      selectedAddrId: params.addrId,
    }))
  },
  onShow() {
    // 后退刷新列表
    userApi.addressList().then((res) => {
      if (!res.length) return;
      this.setData({
        addressList: res,
      })
    });
  },
  // 去添加
  handleToAdd () {
    if (this.data.addressList.length >= 10) {
      return wx.showToast({
        title: '最多添加10条地址'
      })
    }
    return wx.navigateTo({
      url: '../address/update'
    })
  },
  // radio
  handleSelect(e: any) {
    if (this.data.from !== 'pay' && this.data.from !== 'submit-dispatch') return;
    const targetItem = e.currentTarget.dataset.item;
    this.setData(({
      selectedAddrId: targetItem.addrId,
    }));
    // 更新订单地址
    eventBus.emit('onBack', targetItem);
    wx.navigateBack();
  },
  // 删除
  handleDel (e:any) {
    wx.showModal({
      title: '确认删除此条地址信息吗？',
      // content: '这是一个模态弹窗',
      success: (res) => {
        if (res.confirm) {
          userApi.delAddr(e.currentTarget.dataset.item.addrId).then(() => {
            wx.showToast({
              title: '删除成功'
            });
            userApi.addressList().then((res) => {
              this.setData({
                addressList: res,
              })
            });
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  // 去编辑
  handleEdit (e:any) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `../address/update?item=${encodeURIComponent(JSON.stringify(item))}`
    })
  }
})
