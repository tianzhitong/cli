/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-06 23:39:38
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-08 01:24:17
 * @FilePath: /cli/src/utils/apiGenTs/runProjectTemplate/interceptors.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { AxiosResponse } from 'axios';
import { api, apiInstanceList } from '../../service';

// Wrapper function to set request headers
const wrapperRequestHeader = (config: any) => {
    config.headers = config.headers ?? {};
    // TODO：获取token。对请求的内容作处理
};

// Response interceptor
const responseInterceptor = async (response: AxiosResponse<any, any>) => {
    // 对返回的数据做处理。需要什么类型的数据
    if (response.data?.code === 200) {
        return Promise.resolve(response);
    }
    // 请求失败reject掉的数据
    return Promise.reject(response);
};

// Loop through apiInstanceList and apply request interceptor
apiInstanceList.forEach(async (item) => {
    item.instance.instance.interceptors.request.use(async (config) => {
        wrapperRequestHeader(config);
        return config;
    });
    item.instance.instance.interceptors.response.use(responseInterceptor, function (error) {
        return Promise.reject(error);
    });
});

export const interceptorsRequest = api;
