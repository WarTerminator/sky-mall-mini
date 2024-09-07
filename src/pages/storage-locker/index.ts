import blindBoxService from "../../api/blind-box";

// pages/storage-locker/index.ts
Page({
  data: {
    cards: [
      'https://img.war6sky.com/2024/08/6899c6068eec424fb5962cd9b7200229.png', 'https://img.war6sky.com/2024/08/ed04ab4877af4d8488562eb97e4a3686.png', 'https://img.war6sky.com/2024/08/dc18a0a70c06449283b095fd135cf699.png',
      'https://img.war6sky.com/2024/08/6899c6068eec424fb5962cd9b7200229.png', 'https://img.war6sky.com/2024/08/ed04ab4877af4d8488562eb97e4a3686.png', 'https://img.war6sky.com/2024/08/dc18a0a70c06449283b095fd135cf699.png',
      'https://img.war6sky.com/2024/08/6899c6068eec424fb5962cd9b7200229.png', 'https://img.war6sky.com/2024/08/ed04ab4877af4d8488562eb97e4a3686.png', 'https://img.war6sky.com/2024/08/dc18a0a70c06449283b095fd135cf699.png',
    ].map(item => ({
      value: item,
      selected: false,
    })),
    selectedCount: 0,
    mode: 'large',
  },
  onLoad() {
    blindBoxService.getStorageLocker().then(res => {
      console.log('##', res);
    });
  },
  handleSelectItem(event: WechatMiniprogram.BaseEvent) {
    const index = event?.currentTarget?.dataset?.index;
    const cards = [...this.data.cards];

    if (cards[index]) {
      cards[index].selected = !cards[index].selected;
      const selectedCount = cards.filter(item => item.selected).length || 0;
      this.setData({
        cards,
        selectedCount,
      });
    }
  },
  handleSelectAll() {
    const allSelected = this.data.selectedCount === this.data.cards.length;
    const cards = [...this.data.cards].map(item => ({
      ...item,
      selected: allSelected ? false : true,
    }));
    const selectedCount = allSelected ? 0 : cards.length;

    this.setData({
      cards,
      selectedCount,
    });
  },
  handleSwitchMode() {
    const mode = this.data.mode;

    this.setData({
      mode: mode === 'small' ? 'large' : 'small',
    });
  }
})