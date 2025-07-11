/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-24 20:30:01
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-02-16 16:08:47
 * @FilePath: /cli/src/utils/apiGenTs/adapters/axiosWrapper.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { InternalAxiosRequestConfig } from 'axios';

interface MOCK_API_MAP_Props {
    GET?: Array<Record<string, string>>;
    POST?: Array<Record<string, string>>;
    PUT?: Array<Record<string, string>>;
    DELETE?: Array<Record<string, string>>;
}
interface mockConfigProps {
    /** mock项目的名字 */
    projectName?: string;
    /** mock服务器的地址 http://localhost:3000 */
    mockBaseUrl: string;
    /** 去除前缀比如：/api */
    removePrefix?: string;
    MOCK_API_MAP?: MOCK_API_MAP_Props;
}


const progressApiMapToServiceApiUrl = (currentApiUrl: string,apiMethod: string, MOCK_API_MAP: MOCK_API_MAP_Props,useMapApi: boolean) => {
    if(!useMapApi) {
        return currentApiUrl;
    }
    const mapApiListByApiMethod = MOCK_API_MAP[apiMethod as keyof MOCK_API_MAP_Props];
    if(mapApiListByApiMethod.length === 0) {
        return currentApiUrl;
    }

    for(let i = 0; i < mapApiListByApiMethod.length; i++) {
        const item = mapApiListByApiMethod[i];
        const keyList = Object.keys(item);
        if(keyList.length === 1) {
            if(currentApiUrl.includes(keyList[0])) {
                return item[keyList[0]];
            }
        }
    }

    return currentApiUrl;
}

export const axiosMockWrapper = (config: InternalAxiosRequestConfig, mockConfig: mockConfigProps) => {
    const { removePrefix, projectName = 'default', mockBaseUrl, MOCK_API_MAP = {} } = mockConfig;
    const useMock = config['useMock'];
    const useMapApi = config['useMapApi'];

    if (!useMock) return;
    // https://www.baidu.com/api/user/getuser?name=1&b=2
    // 转换为
    // /api/user/getuser?name=1&b=2
    let queryPath = (config.baseURL! + config.url!).replace(
        // eslint-disable-next-line no-useless-escape
        /https{0,1}:\/\/[^\/]+/,
        '',
    );
    const apiMethod = config.method?.toUpperCase();
    if ((removePrefix ?? '').length > 0) {
        queryPath = queryPath.replace(removePrefix, '');
    }
    queryPath = progressApiMapToServiceApiUrl(queryPath,apiMethod,MOCK_API_MAP,useMapApi);

    config.headers['Mock-Query-Path'] = queryPath;
    config.baseURL = `${mockBaseUrl}/mock/mock/clientGetMockData?apiUrl=${queryPath}&projectName=${projectName}&apiMethod=${apiMethod}`;
    config.url = '';
};
