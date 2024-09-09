import blindBoxService from "../../../api/blind-box";
import { tryJsonParse } from "../../../utils/index";
import WXToast from "../../../utils/WXToast";

// pages/blind-box/unbox-record/index.ts
Component<{
  onlyMine: boolean;
  loading: boolean;
  records: any[];
  hasMore: boolean;
}, Record<string, any>, Record<string, Function>, Record<string, any>, false>({
  properties: {
    blindBox: {
      type: Object,
    },
  },
  data: {
    onlyMine: false,
    loading: false,
    records: [],
    hasMore: false,
  },
  lifetimes: {
    attached() {
      this._current = 1;
      this.getUnboxRecord();
    },
  },
  methods: {
    handlwSwitchTab(event: WechatMiniprogram.BaseEvent) {
      const onlyMine = event?.currentTarget?.dataset?.item === 'mine';
      this.setData({ onlyMine });
      this._current = 1;
      this.getUnboxRecord();
    },
    async getUnboxRecord() {
      try {
        const res = await blindBoxService.getUnboxRecord({
          current: this._current,
          gameItemId: this.properties.blindBox?.gameItemId,
          status: this.data.onlyMine ? 1 : 0,
        });

        const { records = [] } = res || {};

        let _records = records.reduce((acc: any[], current: any) => {
          const items = tryJsonParse(current.items);
          const cardRecords = (items.records || []).map((item: any) => {
            const detail = tryJsonParse(item.items);
            
            return {
              ...item,
              ...detail,
              recordTime: current.createTime,
              avatar: current.pic,
            };
          });
          
          acc = [...acc, ...cardRecords];

          return acc;
        }, []);

        if (this._current > 1) {
          _records = [...this.data.records, ..._records];
        }

        this.setData({
          loading: false,
          records: _records,
          hasMore: res.current < res.pages,
        });
      } catch(e) {
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
        this.getUnboxRecord();
      }
    },
  }
})