/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-06 04:04:39
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-07 21:40:07
 * @FilePath: /cli/apiGenTs.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/** @type {import("tianzhitong-cli/dist").GlobalConfigProps} */
const config = {
    swaggerList: [
        {
            title: '订单API文档',
            url: 'http://127.0.0.1:5500/proxy/swaggerData.json',
            name: 'orderApi',
            apis: {
                GET: ['/system/user/profile'],
                POST: [],
                PUT: ['/system/user/profile'],
                DELETE: [],
            },
        },
    ],
};

export default config;
