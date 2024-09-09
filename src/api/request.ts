import { userApi } from './index';
import hostMap, { Host } from '../constant/host';

export default function request<T = any>(params: {
  host?: Host,
  url: string,
  method?: "GET" | "OPTIONS" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined,
  data?: any,
}, config?: RequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    const hostName: Host = params.host || Host.API;
    const requestCb = () => {
      wx.request({
        url: hostMap[hostName] + params.url,
        method: params.method || 'GET',
        data: params.data || {},
        header: {
          'Authorization': wx.getStorageSync('Authorization'),
          'Accept-Language': 'zh-CN',
        },
        success(res: any) {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else if (res.statusCode === 401 && !config?.ignore401) {
            userApi.login().then(() => {
              requestCb();
            }).catch(e => {
              reject(e);
            })
          } else {
            reject(res);
          }
        },
        fail(err) {
          reject(err);
        }
      });
    }
    requestCb();
  });
};

request.get = function(url: string, data?: any) {
  return request({ url, method: 'GET', data });
};

request.post = function(url: string, data?: any) {
  return request({ url, method: 'POST', data });
};