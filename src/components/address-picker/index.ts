import { mallApi } from "../../api/index";

Component<
  {
    addressPickerViewShow: boolean,
    value: number[],
    PROVINCES: Area[],
    cities: Area[],
    areas: Area[],
    province: string,
    city: string,
    area: string,
    areaInfo: string,
  },
  any,
  any
>({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    extClass: {
      type: String,
      value: ''
    },
  },
  data: {
    addressPickerViewShow: false,
    value: [0, 0, 0],
    PROVINCES: [],
    cities: [],
    areas: [],
    province: '',
    city: '',
    area: '',
    areaInfo: ''
  },
  lifetimes: {
    // 初始化
    async attached () {
      const PROVINCES = await this.getArea(0);
      const beiJingAreaId = PROVINCES[0].areaId;
      const beiJingCities = await this.getArea(beiJingAreaId);
      const beiJingFirstCityId = beiJingCities[0].areaId;
      const beiJingAreas = await this.getArea(beiJingFirstCityId);
      this.setData({
        PROVINCES,
        cities: beiJingCities,
        areas: beiJingAreas,
      })
    },
  },
  methods: {
    // 获取省/市/区
    getArea: (pid: number) => mallApi.areaList(pid),
    // 展示
    handleShowAddressPickerView() {
      this.setData({
        addressPickerViewShow: true,
      });
    },
    // 隐藏
    handleHiddenAddressPickerView() {
      this.setData({
        addressPickerViewShow: false,
      });
    },
    // 确认
    handleEnsure() {
      const {
        value,
        PROVINCES,
        cities,
        areas,
      } = this.data;
      this.triggerEvent('onChange', [
          PROVINCES[value[0]],
          cities[value[1]],
          areas[value[2]],
        ]
      );
      this.handleHiddenAddressPickerView();
    },
    // 切换省/市
    async onPickerViewChange (e: any) {
      const targetValue = e.detail.value
      const provinceNum = targetValue[0]
      const cityNum = targetValue[1]

      if (this.data.value[0] != provinceNum) {
        const targetCities = await this.getArea(this.data.PROVINCES[provinceNum].areaId);
        return this.setData({
          value: [provinceNum, 0, 0],
          cities: targetCities,
          areas: await this.getArea(targetCities[0].areaId),
        })
      }
      if (this.data.value[1] != cityNum) {
        return this.setData({
          value: [provinceNum, cityNum, 0],
          areas: await this.getArea(this.data.cities[cityNum].areaId),
        })
      }
      this.setData({
        value: [provinceNum, cityNum, targetValue[2]]
      })
    },
  },
})