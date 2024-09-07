const designHostEditorUrl = 'https://objects.buff-box.com/web/pixi-editor-page/0827_10/editor.html';
Page<any,any>({
  data: {
    designHostEditorUrl,
  },
  onLoad() {
    const {
      orderProduct,
      config,
    } = getApp().globalData;
    const {
      $selectSkuItem: {
        skuId,
        customCenterSkuEditTempId,
        customSupplyChainId,
        customSupplyChainSkuId,
      },
      prodId,
    } = orderProduct;
    this.setData({
      designHostEditorUrl: (config.editorWebUrl || designHostEditorUrl) + `?env=${'daily'}&token=${encodeURIComponent(wx.getStorageSync('Authorization'))}&mallSkuId=${skuId}&customCenterSkuEditTempId=${customCenterSkuEditTempId}&customSupplyChainId=${customSupplyChainId}&customSupplyChainSkuId=${customSupplyChainSkuId}&prodId=${prodId}`
    })
  },
})