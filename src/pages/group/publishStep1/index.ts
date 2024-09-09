import { groupApi } from "../../../api/index";
import { IMG_HOST_OBJECTS } from "../../../constant/host";

Page<any, any>({
  data: {
    IMG_HOST_OBJECTS,
    startTime: '', // 2024-09-05 10:00:00
    endTime: '',
    targetAmount: '',
    skuPopShow: false,
    searchText: '',
    skuSelectedIndex: 0,
    skuList: [],
    skuListAll: [],
    skuListPushed: [],
  },
  onLoad() {
    groupApi.enableSkuList().then((res) => {
      this.setData({
        skuList: res,
        skuListAll: res,
      });
    });
  },
  // 开始时间
  handleStartTimeChange (e: any) {
    this.setData({
      startTime: e.detail.value
    })
  },
  // 结束时间
  handleEndTimeChange (e: any) {
    this.setData({
      endTime: e.detail.value
    })
  },
  // 拉起skuPop
  handleShowSkuPop () {
    this.setData({
      skuPopShow: true
    });
  },
  // 关闭skuPop
  handleCloseSkuPop () {
    this.setData({
      skuPopShow: false
    });
  },
  // 搜索词变化
  handleSearchTextChange (e: any) {
    const value = e.detail.value;
    if (value) {
      this.setData({
        searchText: value
      });
    } else {
      this.setData({
        searchText: value,
        skuSelectedIndex: 0,
        skuList: this.data.skuListAll
      });
    }
  },
  // 搜索sku
  handleSearchSku () {
    const targetSkuList = this.data.searchText ?
      this.data.skuListAll.filter((sku: any) => sku.skuName.indexOf(this.data.searchText) > -1)
      : this.data.skuListAll;
    this.setData({
      skuSelectedIndex: 0,
      skuList: targetSkuList
    });
  },
  // 选择sku
  handleSelectSku (e: any) {
    this.setData({
      skuSelectedIndex: e.currentTarget.dataset.index
    });
  },
  // 添加sku
  handleSkuPush () {
    const {
      skuList,
      skuListPushed,
      skuSelectedIndex,
    } = this.data;
    const targetSku = skuList[skuSelectedIndex];
    if (targetSku.count == 0) {
      targetSku.count = 1;
    }
    this.setData({
      skuPopShow: false,
      skuListPushed: [...skuListPushed, targetSku]
    })
  },
  handleTargetAmount (e: any) {
    this.setData({
      targetAmount: e.detail.value
    });
  },
  handlePriceChange (e: any) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    const {
      skuListPushed,
    } = this.data;
    const targetSku = skuListPushed[index];
    targetSku.price = value;
    this.setData({
      skuListPushed: [...skuListPushed]
    });
  },
  handleCountChange (e: any) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    const {
      skuListPushed,
    } = this.data;
    const targetSku = skuListPushed[index];
    targetSku.count = value;
    this.setData({
      skuListPushed: [...skuListPushed]
    })
  },
  handleSubmit () {
    const {
      startTime,
      endTime,
      targetAmount,
      skuListPushed,
    } = this.data;
    if (!startTime || !endTime || !targetAmount || !skuListPushed.length) return;
    const {
      publishStepForm,
    } = getApp().globalData;
    const {
      activityName,
      content,
      rotateImgs,
      media
    } = publishStepForm || {};
    groupApi.createActivity({
      cgpActivity: {
        ipId: publishStepForm.ipId,
        shopId: publishStepForm.shopId,
        activityName,
        content,
        rotateImgs: rotateImgs.join(','),
        media: media.join(','),
        startTime,
        endTime,
        targetAmount
      },
      groupProd: {
        groupSkuList: skuListPushed,
        shopId: publishStepForm.shopId,
        prodId: publishStepForm.prodId,
      }
    })
  }
})
