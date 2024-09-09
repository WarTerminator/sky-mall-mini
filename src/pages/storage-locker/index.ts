import blindBoxService from "../../api/blind-box";
import WXToast from "../../utils/WXToast";

interface StorageLocker {
  loading: boolean;
  hasMore: boolean;
  totalCount: number;
  cards: any[];
  selectedCount: number;
  mode: 'large' | 'small';
  showRule: boolean;
  showOder: boolean;
  orderParams: any;
}

// pages/storage-locker/index.ts
Page<StorageLocker, Record<string, any>>({
  _current: 1,
  _loadingMore: false,
  data: {
    loading: true,
    hasMore: false,
    totalCount: 0,
    cards: [],
    selectedCount: 0,
    mode: 'large',
    showRule: false,
    showOder: false,
    orderParams: null,
  },
  onLoad() {
    this.getStorageLocker();
  },
  onSubmitSuccess() {
    this._current = 1;
    this.getStorageLocker();
  },
  async getStorageLocker() {
    try {
      const res = await blindBoxService.getUserAsset({
        current: this._current,
        size: 30,
        fillUpDetailInfo: true,
        assetTypes: [0],
        statusList: [0],
      });
  
      const { records = [] } = res || {};
      let cards = records.map((item: any) => ({
        ...item,
        selected: false,
      }));
  
      if (this._current > 1) {
        cards = [...this.data.cards, ...cards];
      }

      const selectedCount = cards.filter((item: any) => item.selected).length || 0;
  
      this.setData({
        loading: false,
        cards,
        totalCount: res.total,
        selectedCount,
        hasMore: res.current < res.pages,
      });
    } catch (e) {
      WXToast(e?.data);
      
      this.setData({
        loading: false,
      });
    }

    this._loadingMore = false;
  },
  handleLoadMore() {
    if (this.data.hasMore && !this._loadingMore) {
      this._loadingMore = true;
      this._current += 1;
      this.getStorageLocker();
    }
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
  },
  handleSubmit() {
    const selectedCards = this.data.cards.filter(item => item.selected);

    if (!selectedCards.length) {
      WXToast('请先选择需要发货的商品');
      return;
    }

    const userAssetIds = selectedCards.map(item => item.userAssetId);
    const shopId = selectedCards[0]?.fromId;
    const firstPic = selectedCards[0]?.pic;
    let assetName = selectedCards.slice(0, 3).map(item => item.name).join('、');

    if (selectedCards.length > 3) {
      assetName += '等卡片';
    }

    this.setData({
      showOder: true,
      orderParams: {
        assetName,
        shopId,
        userAssetIds,
        firstPic,
      },
    });
  },
  handleShowRule() {
    this.setData({ showRule: true });
  },
  handleClosePop() {
    this.setData({
      showOder: false,
      showRule: false,
    });
  },
})