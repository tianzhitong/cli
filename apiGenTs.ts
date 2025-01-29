/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 22:11:15
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-29 18:48:08
 * @FilePath: /cli/apiGenTs.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

interface apiProps {
    GET: string[];
    POST: string[];
    PUT: string[];
    DELETE: string[];
}

export interface swaggerListProps {
    /** 标题 */
    title: string;
    /** 接口数据的地址。可以是url也可以是相对路径 */
    url: string;
    /** 生成接口文件的名字 */
    name: string;
    /** 当前生成的接口的前缀地址 /api 开头 */
    basePath?: string;
    /** 如果传入当前属性。只生成部分接口。 */
    apis: Partial<apiProps>;
}

export interface mockServeProps {
    /** 是否开启mock */
    enable: boolean;
    /** mock地址 */
    url?: string;
    /** mock接口扔到那个项目下 默认：default */
    projectName?: string;
    /** 模型数据。最外层的数据 code。message之类 */
    modelData?: object;
}

export interface configProps {
    /** swagger接口数据open 数据 */
    swaggerList: Array<swaggerListProps>;
    /** 把生成的接口文件扔到那个目录下 默认为./src/service/下 */
    outDir?: string;
    /** 是否启用mock服务 */
    mockServe?: mockServeProps;
}

const config: configProps = {
    /** 接口文档 */
    swaggerList: [],
    /** 把接口扔在那个目录下 */
    outDir: './src/service/',
    /** 是否启用mock服务 */
    mockServe: {
        enable: true,
        url: 'http://localhost:3000',
    },
};

export default config;
