/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 19:51:15
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-07 20:20:50
 * @FilePath: /cli/src/config/global.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import fs from "fs-extra"
import { resolveApp } from "../utils/common/removeDir";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

/** 获取package.json信息 */
const currentNpmPackagePath = resolve(fileURLToPath(import.meta.url), '../../package.json');

/** package文件信息 */
const pkg = fs.readJsonSync(currentNpmPackagePath);

/** 脚手架的名字 */
export const CLI_NAME = 'tianzhitong-cli';

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

/** 接口配置文件目录 */
export const API_CONFIG_BASE_URL_FILE = './src/config/request/'

// 当前文件地址
export const CURRENT_FILE_PATH = fileURLToPath(import.meta.url);

// nrmlist
export const NRM_LIST = [
    {
        name: 'npm',
        value: 'https://registry.npmjs.org/',
    },
    {
        name: 'yarn',
        value: 'https://registry.yarnpkg.com/'
    },
    {
        name: 'tencent',
        value: 'https://mirrors.tencent.com/npm/'
    },
    {
        name: 'cnpm',
        value: 'https://r.cnpmjs.org/'
    },
    {
        name: 'taobao',
        value: 'https://registry.npmmirror.com/',
    },
    {
        name: 'npmMirror',
        value: 'https://skimdb.npmjs.com/registry/'
    },
    {
        name: 'huawei',
        value: 'https://repo.huaweicloud.com/repository/npm/'
    },
    {
        name: 'private',
        value: 'http://private.npm.com/'
    }
]