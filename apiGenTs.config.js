/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-06 04:04:39
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-29 19:28:48
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
    /** ts扔到哪里。默认为 ./src/service/下 */
    outDir: './src/service',
    /** 如果不启用mock服务 不传递mockServe字段 */
    mockServe: {
        /** 是否启用mock 服务 */
        enable: true,
        /** mock服务地址 */
        url: 'http://localhost:3000',
        /** modelData返回的数据，最外层的数据，比如code，message。替换掉随机生成的code */
        modelData: {
            code: 200,
        },
    },
};

export default config;
