/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-06 18:33:58
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-09 18:19:49
 * @FilePath: /cli/src/utils/apiGenTs/runProjectTemplate/swaggerServiceConfig.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export interface serviceConfigProps {
    baseURL: string;
};

export const serviceConfig = (() => {
    return {
        // 所有接口的baseUrl地址
        baseURL: 'https://www.baidu.com/api'
    };
})();

