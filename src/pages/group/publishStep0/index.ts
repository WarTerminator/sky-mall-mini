import uploadMedia from '../../../utils/uploadMedia';

Page<any,any>({
  data: {
    category: [
      {
        name: 'LOL',
        id: 1
      },
      {
        name: 'test',
        id: 2
      },
    ],
    categoryIndex: '',
    activityName: '',
    rotateImgs: [],
    content: '',
    media: [],
    maxImgCount: 5,
  },
  onLoad() {
    //
  },
  // 分类
  bindPickerChange (e: any) {
    this.setData({
      categoryIndex: e.detail.value,
    })
  },
  // 标题
  handleTitleChange (e: any) {
    this.setData({
      activityName: (e.detail.value).trimStart(),
    })
  },
  // 轮播图
  handleUploadSwiperPic () {
    if (this.data.maxImgCount <= this.data.rotateImgs.length) return;
    uploadMedia({
      count: this.data.maxImgCount - this.data.rotateImgs.length,
    }).then((res:string[]) => {
      this.setData({
        rotateImgs: [...this.data.rotateImgs, ...res]
      })
    });
  },
  // 描述
  handleDescriptionChange (e: any) {
    this.setData({
      content: (e.detail.value).trimStart(),
    })
  },
  // 描述图
  handleUploadDesPic () {
    if (this.data.maxImgCount <= this.data.media.length) return;
    uploadMedia({
      count: this.data.maxImgCount - this.data.media.length,
    }).then((res:string[]) => {
      this.setData({
        media: [...this.data.media, ...res]
      })
    });
  },
  // 下一步
  handleNext () {
    const {
      activityName,
      content,
      rotateImgs,
      media,
      category,
      categoryIndex,
    } = this.data;
    if (activityName && content && rotateImgs.length && categoryIndex !== '') {
      const globalData = getApp().globalData;
      globalData.publishStepForm = {
        activityName,
        content,
        rotateImgs,
        media,
        ipId: category[categoryIndex].id,
        shopId: globalData.orderProduct.shopId,
        prodId: globalData.orderProduct.prodId,
      };
      wx.navigateTo({
        url: '/pages/group/publishStep1/index',
      })
    }
  },
})
