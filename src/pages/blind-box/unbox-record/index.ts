// pages/blind-box/unbox-record/index.ts
Component({
  properties: {

  },
  data: {
    onlyMine: false,
  },
  methods: {
    handlwSwitchTab(event: WechatMiniprogram.BaseEvent) {
      const onlyMine = event?.currentTarget?.dataset?.item === 'mine';
      this.setData({ onlyMine })
    }
  }
})