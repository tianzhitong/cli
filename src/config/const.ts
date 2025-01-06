/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 19:51:15
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-06 16:45:13
 * @FilePath: /cli/src/config/global.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import fs from "fs-extra"
import { resolveApp } from "../utils/common/removeDir";

/** 获取package.json信息 */
const pkg = fs.readJsonSync(new URL('../package.json', import.meta.url));

/** 脚手架的名字 */
export const CLI_NAME = '@tianzhitong-cli';

/** 脚手架版本 */
export const CLI_VERSION = pkg.version;

/** git仓库模板列表 */
export const GIT_TEMPLATE_LIST = [
    {
        name: 'webpack-template',
        value: 'yingside/webpack-template',
        desc: '基于webpack5的vue3项目模板'
    },
    {
        name: 'vue-cli-template',
        value: 'yingside/vue-cli-template',
        desc: '基于vue-cli4的vue3项目模板'
    },
    {
        name: 'vite-template',
        value: 'yingside/vite-template',
        desc: '基于vite的vue3 + 前端工具链项目模板'
    }
];


/** 生成的ts默认放在那个文件夹下 */
export const API_GEN_TS_THROW_DIR_NAME = resolveApp('./src/service');