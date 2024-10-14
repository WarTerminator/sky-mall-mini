const {
  platform,
} = wx.getSystemInfoSync();
const isDev = platform == 'devtools' || true;

export enum Env {
  DEV = 'dev',
  ONLINE = 'online',
};
export enum Host {
  API = 'api',
};
const hostMap = {
  [Env.DEV]: {
    // [Host.API]: 'https://sky-api-test.war6sky.com',
    [Host.API]: 'https://sky-mallapi.war6sky.com',
  },
  [Env.ONLINE]: {
    [Host.API]: 'https://sky-mallapi.war6sky.com',
  }
};
export const IMG_HOST = 'https://img.war6sky.com';
export const IMG_HOST_OBJECTS = 'https://objects.buff-box.com';
export const IMG_PRE = IMG_HOST + '/resources/images/mini/';
export const env = isDev ? Env.DEV : Env.ONLINE;
export default hostMap[env];
