import { userApi } from '../../api/index';
import hostMap, { Host, IMG_PRE } from '../../constant/host';
import promisify from '../../utils/promisify';

// @ts-ignore
const compressImage = promisify(wx.compressImage);
Page<any,any>({
  data: {
    IMG_PRE,
    sexList: [
      {
        type: '0',
        name: '男',
      },
      {
        type: '1',
        name: '女',
      },
      {
        type: '',
        name: '神秘',
      }
    ],
    sex: '',
    avatar: '',
    nickName: '',
    mobile: '',
  },
  onLoad() {
    const { sex, avatar, nickName, mobile } = getApp().globalData.userInfo;
    this.setData({
      sex,
      avatar,
      nickName,
      mobile,
    });
  },
  handleEditAvatar () {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const {
          tempFilePath,
          size,
        } = res.tempFiles[0];
        if (size > 1024 * 1024) return wx.showToast({ title: '图片应小于1M' });
        return compressImage({
          src: tempFilePath, // 临时图片路径
          quality: 80
        }).then((res: any) => {
          this.upload(res.tempFilePath)
        });
      }
    });
  },
  upload (filePath: any) {
    wx.showLoading({
      title: '上传中...'
    })
    wx.uploadFile({
      url: hostMap[Host.API] + '/p/file/upload',
      filePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization': wx.getStorageSync('Authorization')
      },
      success: (res: any) => {
        if (res.statusCode == 200) {
          const {
            resourcesUrl,
            filePath,
          } = JSON.parse(res.data);
          this.setData({
            avatar: resourcesUrl + filePath,
          });
          this.saveUserInfo();
        }
      },
      complete () {
        wx.hideLoading();
      }
    })
  },
  handleInputName (e: any) {
    this.setData({
      nickName: e.detail.value,
    });
  },
  handleSavaName() {
    this.saveUserInfo();
  },
  saveUserInfo () {
    const {
      nickName,
      avatar,
      sex,
    } = this.data;
    // @ts-ignore
    return userApi.userEdit({
      nickName,
      avatar,
      sex,
    }).then(() => {
      wx.showToast({
        title: '更新成功'
      });
      this.updateGlobalView();
    }).catch((e) => {
      wx.showToast({
        title: e
      })
    })
  },
  updateGlobalView () {
    const {
      globalData,
      triggerUpdate,
    } = getApp();
    const { sex, avatar, mobile, nickName } = this.data;
    globalData.userInfo.avatar = avatar;
    globalData.userInfo.nickName = nickName;
    globalData.userInfo.sex = sex;
    globalData.userInfo.mobile = mobile;
    triggerUpdate(); // 触发视图更新
  },
  // 性别
  handleSelectSex (e: any) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      sex: item.type,
    });
    this.saveUserInfo();
  },
  getPhoneNumber(e: any) {
    return userApi.bindMobile(e.detail.code).then((mobile: number) => {
      this.setData({
        mobile,
      });
      wx.showToast({
        title: '手机号绑定成功'
      });
      this.updateGlobalView();
    })
  }
})
