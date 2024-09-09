import promisify from "./promisify";
import hostMap, { Host } from '../constant/host';

// @ts-ignore
const compressImage = promisify(wx.compressImage);
const chooseMedia = promisify(wx.chooseMedia);
// @ts-ignore
const uploadFile = promisify(wx.uploadFile);
export default ({
  count,
  maxSize,
  mediaType,
  sourceType,
}: {
  count?: number,
  maxSize?: number,
  mediaType?: Array<'image' | 'video' | 'mix'>,
  sourceType?: Array<'album' | 'camera'>
}) => {
  return chooseMedia({
    count,
    mediaType,
    sourceType,
  }).then((res) => {
    const promiseAll = res.tempFiles.map((file) => {
      const {
        tempFilePath,
        size,
      } = file;
      if (size > 1024 * (maxSize || 1024)) {
        wx.showToast({ title: '图片应小于1M' });
        return Promise.reject(new Error('图片应小于1M'));
      }
      return compressImage({
        src: tempFilePath, // 临时图片路径
        quality: 80
      }).then((res: any) => {
        return upload(res.tempFilePath)
      });
    });
    return Promise.all(promiseAll);
  });
};

const upload = (filePath: any) => {
  wx.showLoading({
    title: '上传中...'
  })
  return uploadFile({
    url: hostMap[Host.API] + '/p/file/upload',
    filePath,
    name: 'file',
    header: {
      'Content-Type': 'multipart/form-data',
      'Authorization': wx.getStorageSync('Authorization')
    },
  }).then(res => {
    if (res.statusCode !== 200) return Promise.reject(res);
    const {
      resourcesUrl,
      filePath,
    } = JSON.parse(res.data);
    return resourcesUrl + filePath;
  }).finally(() => wx.hideLoading())
};