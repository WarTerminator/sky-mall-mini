// pages/blind-box/pop-adapter/index.ts

const PopConfigMap: any = {
  'confirmOrder': {
    position: 'bottom',
    height: '74%',
  },
  'confirmPay': {
    position: 'bottom',
    height: '254px',
  },
  'unboxing': {
    position: 'center',
    height: '100%',
  },
  'detailPop': {
    position: 'bottom',
    height: '74%',
  },
  'probabilityInfo': {
    position: 'bottom',
    height: '80%',
  },
  'unboxRecord': {
    position: 'bottom',
    height: '74%',
  },
};

Component<{
  showPopKey: string;
  popConfig: any;
  extraData: any;
}, {}, {
  handleClose(): void;
  onConfirmOrderSubmit(event: any): void;
  onPaySuccess(event: any): void;
  handleShowPop(key: string, extraData?: any): void;
  handleShowConfirmOrder(data: any): void;
  handleShowDetailPop(data: any): void;
}, {}, false>({
  properties: {
    blindBox: {
      type: Object,
    },
    isTrial: {
      type: Boolean,
    },
  },
  data: {
    showPopKey: '',
    popConfig: {},
    extraData: {},
  },
  methods: {
    onConfirmOrderSubmit(event) {
      const totalPrice = event?.detail?.totalPrice;
      const count = event?.detail?.count;
      this.handleShowPop('confirmPay', { totalPrice, count });
    },
    onPaySuccess(event) {
      const assetIds = event?.detail?.assetIds;
      this.handleShowPop('unboxing', { assetIds });
    },
    handleClose() {
      this.setData({
        showPopKey: '',
        popConfig: {},
        extraData: {},
      });
    },
    handleShowPop(key, extraData) {
      this.setData({
        showPopKey: key,
        popConfig: PopConfigMap[key],
        extraData: extraData || {},
      });
    },
    handleShowConfirmOrder(data) {
      this.handleShowPop('confirmOrder', data);
    },
    handleShowDetailPop(data) {
      this.handleShowPop('detailPop', data);
    },
  }
})