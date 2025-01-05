/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 22:11:15
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-06 01:13:14
 * @FilePath: /cli/apiGenTs.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

interface apiProps {
    'GET': string[]
    'POST': string[]
}

export interface swaggerListProps {
    title: string;
    url: string;
    name: string;
    apis: Partial<apiProps>;
};

export interface configProps {
    swaggerList: Array<swaggerListProps>,
}

const config: configProps = {
    swaggerList: [],
}

export default config;