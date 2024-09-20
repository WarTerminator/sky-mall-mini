import { IMG_PRE } from '../../../constant/host';

Page<any,any>({
  data: {
    IMG_PRE,
    entries: [
      {
        label: '隐私条款',
        type: 'servicePolicy'
      },
      {
        label: '用户协议',
        type: 'serviceTerms'
      },
      // {
      //   label: '用户充值协议',
      //   type: 'serviceRecharge'
      // },
    ],
  },
  // 入口
  handleToPath(e:any) {
    const {
      type,
      label,
    } = e.currentTarget.dataset.item;
    return wx.navigateTo({
      url: `/pages/my/about/protocol?type=${type}&title=${encodeURIComponent(label)}`,
    })
  },
})
