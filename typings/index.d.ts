/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    scene: number,
    userInfo?: WechatMiniprogram.UserInfo | any,
    orderProduct?: any;
    addressList: [],
    addressSelected: any;
    config: {
      editorWebUrl: string,
    };
    publishStepForm: any;
    navBar: {
      statusBarHeight: number,
      navBarHeight: number,
      windowHeight: number,
      scrollViewHeight: number,
    },
    categoryCurrent: string;
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
  triggerUpdate: Function,
  getUserInfo: Function,
  getGlobalConfigAsync: Function,
  getBarHeight: Function
}

interface Area {
  areaId: number;
  areaName: string;
  areas: any;
  level: number;
  maxGrade: any;
  parentId: number;
}

interface Address {
  addrId?: number;
  mobile: number;
  receiver: string;
  areaId: number;
  cityId: number;
  provinceId: number;
  addr: string;
  area: string;
  city: string;
  province: string;
}

interface LoginRes {
  accessToken: string,
  expiresIn: number,
  refreshToken: string,
  userId: number,
}

interface RequestConfig{
  ignore401?: boolean
}