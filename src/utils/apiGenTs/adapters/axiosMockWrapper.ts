/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-24 20:30:01
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-24 21:45:26
 * @FilePath: /cli/src/utils/apiGenTs/adapters/axiosWrapper.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { InternalAxiosRequestConfig } from 'axios';

interface mockConfigProps {
    /** mock项目的名字 */
    projectName?: string;
    /** mock服务器的地址 http://localhost:3000 */
    mockBaseUrl: string;
    /** 去除前缀比如：/api */
    removePrefix?: string;
}

export const axiosMockWrapper = (config: InternalAxiosRequestConfig, mockConfig: mockConfigProps) => {
    const { removePrefix, projectName = 'default', mockBaseUrl } = mockConfig;
    const useMock = config.headers['useMock'];

    if (!useMock) return;
    let queryPath = (config.baseURL! + config.url!).replace(
        // eslint-disable-next-line no-useless-escape
        /https{0,1}:\/\/[^\/]+/,
        '',
    );
    const apiMethod = config.method?.toUpperCase();
    if ((removePrefix ?? '').length > 0) {
        queryPath = queryPath.replace(removePrefix, '');
    }
    config.headers['Mock-Query-Path'] = queryPath;
    config.baseURL = `${mockBaseUrl}/mock/mock/clientGetMockData?apiUrl=${queryPath}&projectName=${projectName}&apiMethod=${apiMethod}`;
    config.url = '';
};
