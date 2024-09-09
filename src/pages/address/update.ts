import {
  userApi,
} from '../../api/index';
import eventBus from '../../utils/event-bus';

function validatePhoneNumber(phoneNumber: string) {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phoneNumber);
}
Page({
  data: {
    areaItem: null, // 地址编辑对象
    isDefault: 0,
    areaInfo: [], // 省市区[{},{},{}] addressPicker输出
    areaInfoText: '', // 省市区地址
    from: '',
  },
  onLoad(params: any) {
    this.setData({
      from: params.from,
    })
    if (params.item) {
      const {
        province,
        provinceId,
        city,
        cityId,
        area,
        areaId,
        commonAddr,
      } = JSON.parse(decodeURIComponent(params.item));
      this.setData({
        areaItem: JSON.parse(decodeURIComponent(params.item)),
        isDefault: Number(commonAddr),
        // @ts-ignore
        areaInfo: [{ areaName: province, areaId: provinceId },{ areaName: city, areaId: cityId },{ areaName: area, areaId }],
        areaInfoText: `${province||''} ${city||''} ${area||''}`,
      })
    }
  },
  toggleDefault() {
    this.setData(({
      isDefault: this.data.isDefault ? 0 : 1,
    }))
  },
  handleChange (e: any) {
    const result: Area[] = e.detail;
    this.setData(({
      // @ts-ignore
      areaInfo: result,
      areaInfoText: `${result[0].areaName} ${result[1].areaName} ${result[2].areaName}`
    }))
  },
  handleSubmit(e: any) {
    const isEdit = !!this.data.areaItem;
    const {
      receiver,
      mobile,
      addr,
    } = e?.detail?.value || {};
    if (!receiver.trim()) {
      return wx.showToast({
        title: 'Invalid name',
        icon: 'error'
      })
    }
    if (!validatePhoneNumber(mobile)) {
      return wx.showToast({
        title: 'Invalid phone number',
        icon: 'error'
      })
    }
    if (!this.data.areaInfoText) {
      return wx.showToast({
        title: 'Invalid address',
        icon: 'error'
      })
    }
    if (!addr) {
      return wx.showToast({
        title: 'Invalid addr',
        icon: 'error'
      })
    }
    const [
      province,
      city,
      area,
    ] = this.data.areaInfo as any || [];
    let params = {
      receiver,
      mobile,
      addr,
      provinceId: province.areaId,
      province: province.areaName,
      cityId: city.areaId,
      city: city.areaName,
      areaId: area.areaId,
      area: area.areaName,
      commonAddr: this.data.isDefault
    };
    if (isEdit) {
      params = Object.assign({}, this.data.areaItem, params);
    }
    return userApi[isEdit ? 'updateAddr' : 'addAddr'](params).then((res) => {
      wx.showToast({
        title: isEdit ? '编辑成功' : '新增成功',
      }).then(() => {
        // 更新订单选择的地址
        if (!isEdit && (this.data.from == 'pay' || this.data.from === 'submit-dispatch')) {
          eventBus.emit('onBack', res);
        }
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      })
    });
  }
})
